import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FiCamera, FiSend, FiUser, FiHeart, FiTag, FiClock, FiBookmark, FiBarChart2, FiPieChart, FiTrendingUp, FiMessageSquare, FiThumbsUp, FiThumbsDown, FiDownload, FiTable } from 'react-icons/fi';
import { RiRobot2Line, RiPulseLine } from 'react-icons/ri';

export default function AIStylistContent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userPreferences, setUserPreferences] = useState({
    stylePreferences: [],
    sizeInfo: {},
    colorPreferences: [],
    occasions: [],
    priceRange: {},
    brands: [],
    feedbackHistory: []
  });
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [feedbackSummary, setFeedbackSummary] = useState({
    keyInsights: [],
    styleProfile: {},
    recentFeedback: [],
    actionableItems: []
  });
  
  const [conversationContext, setConversationContext] = useState({
    currentTopic: null,
    feedbackDepth: 0,
    userSentiment: null,
    lastRecommendation: null
  });

  const [feedbackAnalytics, setFeedbackAnalytics] = useState({
    keyInsights: [],
    sentimentAnalysis: {
      positive: 0,
      negative: 0,
      neutral: 0
    },
    actionableRecommendations: [],
    stylePreferences: {},
    followUpQuestions: []
  });

  const [feedbackHistory, setFeedbackHistory] = useState([]);

  // Enhanced conversation starters for better feedback collection
  const feedbackTopics = {
    stylePreferences: {
      questions: [
        "What aspects of your current wardrobe make you feel most confident?",
        "Can you describe a recent outfit that didn't work for you and why?",
        "What's a style you've wanted to try but haven't yet?",
      ],
      followUps: {
        positive: "What specific elements made it work so well?",
        negative: "What would have made it better for you?",
        neutral: "How could this be more aligned with your preferences?"
      }
    },
    shoppingExperience: {
      questions: [
        "What frustrates you most when shopping for clothes?",
        "Tell me about your best recent shopping experience",
        "How do you usually decide what to buy?",
      ],
      followUps: {
        positive: "What made this experience stand out?",
        negative: "How could this have been improved?",
        neutral: "What would make shopping easier for you?"
      }
    },
    fitAndSizing: {
      questions: [
        "Which brands fit you best and why?",
        "What fit issues do you commonly encounter?",
        "How do you prefer your clothes to fit?",
      ],
      followUps: {
        positive: "What makes this fit perfect for you?",
        negative: "What specific adjustments would help?",
        neutral: "How could the fit be more comfortable?"
      }
    }
  };

  // Initialize conversation with more context
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        type: 'assistant',
        content: "Hi! I'm your AI Style Assistant. I'll help understand your style preferences and challenges. Would you like to:",
        options: [
          'Share Your Style Journey',
          'Discuss Recent Purchases',
          'Get Style Recommendations',
          'Report Fit Issues'
        ]
      }
    ]);
  }, []);

  // Enhanced feedback processing
  const processWithGemini = async (userInput, context) => {
    try {
      const response = await fetch('/api/process-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: userInput,
          context: context,
          conversationHistory: messages.slice(-5),
          userPreferences: userPreferences
        }),
      });

      const data = await response.json();
      
      // Update feedback analytics with correct data structure
      setFeedbackAnalytics(prev => ({
        keyInsights: [...prev.keyInsights, ...(data.insights?.mainPoints || [])],
        sentimentAnalysis: {
          ...prev.sentimentAnalysis,
          [data.sentiment.type]: (prev.sentimentAnalysis[data.sentiment.type] || 0) + 1
        },
        actionableRecommendations: [
          ...prev.actionableRecommendations, 
          ...(data.recommendations?.immediate || [])
        ],
        stylePreferences: {
          ...prev.stylePreferences,
          ...(data.styleAnalysis?.preferredStyles || {})
        },
        followUpQuestions: [
          ...prev.followUpQuestions,
          ...(data.followUpQuestions || [])
        ]
      }));

      // Store feedback in history with proper structure
      setFeedbackHistory(prev => [...prev, {
        timestamp: new Date().toISOString(),
        userInput: userInput,
        analysis: data
      }]);

      return data;
    } catch (error) {
      console.error('Error processing feedback:', error);
      return null;
    }
  };

  // Enhanced message handling
  const handleSendMessage = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      image: selectedImage,
      context: conversationContext
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const response = await processWithGemini(input, conversationContext);
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: response.message,
        insights: response.insights,
        suggestions: response.suggestions,
        options: response.followUpOptions
      }]);

      // Update conversation context
      setConversationContext(prev => ({
        ...prev,
        currentTopic: response.detectedTopic || prev.currentTopic,
        feedbackDepth: prev.feedbackDepth + 1,
        userSentiment: response.sentiment || prev.userSentiment
      }));

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: "I'm here to help. Could you rephrase that?",
        options: ["Try Again", "Start Over", "Help"]
      }]);
    }

    setIsLoading(false);
  };

  const handleOptionClick = async (option) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      content: option
    }]);

    try {
      const response = await processWithGemini(option, conversationContext);
      
      // Store feedback in history
      setFeedbackHistory(prev => [...prev, {
        timestamp: new Date().toISOString(),
        userInput: option,
        analysis: response
      }]);

      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'assistant',
        content: response.message,
        options: response.followUpOptions
      }]);

    } catch (error) {
      console.error('Option handling error:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'assistant',
        content: "Could you tell me more about that?",
        options: ['Explain More', 'Try Something Else']
      }]);
    }
  };

  // Enhanced CSV export
  const exportToCSV = () => {
    const headers = [
      'Timestamp',
      'User Input',
      'Sentiment Type',
      'Sentiment Score',
      'Key Phrases',
      'Pain Points',
      'Main Insights',
      'Product Mentions',
      'Fit Issues',
      'Style Preferences',
      'Preferred Styles',
      'Avoided Styles',
      'Immediate Recommendations',
      'Product Recommendations',
      'Categories'
    ];

    const rows = feedbackHistory.map(feedback => {
      const analysis = feedback.analysis;
      return [
        feedback.timestamp,
        feedback.userInput,
        analysis.sentiment.type,
        analysis.sentiment.score,
        analysis.sentiment.keyPhrases.join('; '),
        analysis.sentiment.painPoints.join('; '),
        analysis.insights.mainPoints.join('; '),
        analysis.insights.productMentions.join('; '),
        analysis.insights.fitIssues.join('; '),
        analysis.insights.stylePreferences.join('; '),
        Object.entries(analysis.styleAnalysis.preferredStyles).map(([k,v]) => `${k}:${v}`).join('; '),
        Object.entries(analysis.styleAnalysis.avoidedStyles).map(([k,v]) => `${k}:${v}`).join('; '),
        analysis.recommendations.immediate.join('; '),
        analysis.recommendations.products.join('; '),
        Object.entries(analysis.categories).filter(([,v]) => v).map(([k]) => k).join('; ')
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `detailed_feedback_report_${new Date().toISOString()}.csv`;
    a.click();
  };

  // Enhanced Feedback Report Table
  const FeedbackReport = () => (
    <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Detailed Feedback Analysis</h2>
        <button
          onClick={exportToCSV}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <FiDownload className="mr-2" />
          Export Detailed Report
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Feedback</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sentiment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Key Insights</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Style Preferences</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {feedbackHistory.map((feedback, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(feedback.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{feedback.userInput}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex flex-col">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      feedback.analysis.sentiment.type === 'positive' ? 'bg-green-100 text-green-800' :
                      feedback.analysis.sentiment.type === 'negative' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {feedback.analysis.sentiment.type} ({feedback.analysis.sentiment.score}/5)
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <ul className="list-disc list-inside">
                    {feedback.analysis.insights.mainPoints.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {Object.entries(feedback.analysis.styleAnalysis.preferredStyles).map(([style, count], i) => (
                    <span key={i} className="inline-block px-2 py-1 mr-1 mb-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                      {style}: {count}
                    </span>
                  ))}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <ul className="list-disc list-inside">
                    {feedback.analysis.recommendations.immediate.map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Feedback Summary Component
  const FeedbackSummary = () => (
    <div className="bg-white rounded-xl p-4 mb-4 border border-purple-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Feedback Insights</h3>
        <RiPulseLine className="text-purple-500" />
      </div>
      
      <div className="space-y-3">
        {feedbackSummary.keyInsights.map((insight, index) => (
          <div key={index} className="flex items-start space-x-2">
            <FiBookmark className="text-purple-500 mt-1" />
            <p className="text-sm text-gray-600">{insight}</p>
          </div>
        ))}
      </div>

      {feedbackSummary.actionableItems.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Actionable Recommendations:</h4>
          <div className="flex flex-wrap gap-2">
            {feedbackSummary.actionableItems.map((item, index) => (
              <span key={index} className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Feedback Analytics Component
  const FeedbackAnalytics = () => (
    <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <FiBarChart2 className="mr-2" />
        Feedback Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Insights */}
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center">
            <FiMessageSquare className="mr-2" />
            Key Insights
          </h3>
          <div className="space-y-2">
            {feedbackAnalytics.keyInsights.slice(-5).map((insight, index) => (
              <div key={index} className="bg-white rounded-md p-3 shadow-sm">
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
            <FiPieChart className="mr-2" />
            Sentiment Analysis
          </h3>
          <div className="space-y-2">
            {Object.entries(feedbackAnalytics.sentimentAnalysis).map(([sentiment, count]) => (
              <div key={sentiment} className="flex items-center justify-between bg-white rounded-md p-3 shadow-sm">
                <span className="capitalize text-sm text-gray-700">{sentiment}</span>
                <div className="flex items-center">
                  {sentiment === 'positive' ? <FiThumbsUp className="text-green-500 mr-2" /> : 
                   sentiment === 'negative' ? <FiThumbsDown className="text-red-500 mr-2" /> : 
                   <FiMessageSquare className="text-gray-500 mr-2" />}
                  <span className="text-sm font-semibold">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Style Preferences */}
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
            <FiTrendingUp className="mr-2" />
            Style Preferences
          </h3>
          <div className="space-y-2">
            {Object.entries(feedbackAnalytics.stylePreferences).map(([style, count]) => (
              <div key={style} className="bg-white rounded-md p-3 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 capitalize">{style}</span>
                  <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {count} mentions
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="bg-yellow-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">
            Actionable Recommendations
          </h3>
          <div className="space-y-2">
            {feedbackAnalytics.actionableRecommendations.slice(-5).map((rec, index) => (
              <div key={index} className="bg-white rounded-md p-3 shadow-sm">
                <p className="text-sm text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Follow-up Questions */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Suggested Follow-up Questions
        </h3>
        <div className="flex flex-wrap gap-2">
          {feedbackAnalytics.followUpQuestions.slice(-5).map((question, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(question)}
              className="text-sm bg-white px-4 py-2 rounded-full shadow-sm 
                border border-gray-200 hover:bg-purple-50 transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Add FeedbackAnalytics to the return JSX
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {/* Chat Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <RiRobot2Line className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">AI Style Assistant</h2>
                <p className="text-sm text-gray-500">Collecting your style preferences</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Style Profile:</span>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
          </div>

          {/* Add Feedback Summary */}
          {feedbackSummary.keyInsights.length > 0 && <FeedbackSummary />}

          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="bg-gray-50 rounded-xl p-4 h-[500px] overflow-y-auto mb-4 space-y-4"
          >
            {messages.map((message) => (
              <div key={message.id} 
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : 'order-2'}`}>
                  <div className={`rounded-2xl p-4 ${
                    message.type === 'user' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white border border-gray-200'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    
                    {message.options && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 
                              rounded-full transition-colors text-gray-700"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}

                    {message.suggestions && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <span key={index} 
                            className="inline-flex items-center px-3 py-1 rounded-full 
                              text-xs bg-purple-100 text-purple-600"
                          >
                            <FiTag className="mr-1" />
                            {suggestion}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => fileInputRef.current.click()}
              className="p-3 text-gray-500 hover:text-purple-600 transition-colors"
            >
              <FiCamera className="w-5 h-5" />
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => setSelectedImage(e.target.files[0])}
                accept="image/*"
                className="hidden"
              />
            </button>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share your style preferences..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 
                focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="p-3 bg-purple-600 text-white rounded-xl 
                hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              <FiSend className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Analytics */}
        <FeedbackAnalytics />

        {/* Feedback Report */}
        <FeedbackReport />
      </div>
    </div>
  );
} 