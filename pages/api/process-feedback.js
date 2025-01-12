import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { input, context, conversationHistory } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Modified prompt to ensure proper JSON response
    const prompt = `
      Analyze this fashion feedback: "${input}"
      
      Provide analysis in ONLY valid JSON format with this exact structure:
      {
        "sentiment": {
          "type": "negative",
          "score": 2,
          "keyPhrases": ["phrase1", "phrase2"],
          "painPoints": ["point1", "point2"]
        },
        "insights": {
          "mainPoints": ["point1", "point2"],
          "productMentions": ["product1", "product2"],
          "fitIssues": ["issue1", "issue2"],
          "stylePreferences": ["style1", "style2"]
        },
        "styleAnalysis": {
          "preferredStyles": {"style1": 1, "style2": 1},
          "avoidedStyles": {"style1": 1, "style2": 1},
          "fitPreferences": {"preference1": 1},
          "occasions": ["occasion1", "occasion2"]
        },
        "recommendations": {
          "immediate": ["action1", "action2"],
          "products": ["product1", "product2"],
          "alternatives": ["alt1", "alt2"],
          "improvements": ["improvement1", "improvement2"]
        },
        "categories": {
          "productQuality": true,
          "styleMatch": false,
          "fitIssues": false,
          "userExperience": true,
          "priceConcerns": false
        },
        "followUpQuestions": ["question1", "question2"]
      }

      Analyze the feedback and replace the example values with real analysis. Return ONLY the JSON object, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let analysis;

    try {
      // Clean the response text and parse JSON
      const cleanText = response.text()
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      analysis = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      // Fallback analysis
      analysis = {
        sentiment: {
          type: "neutral",
          score: 3,
          keyPhrases: [input],
          painPoints: []
        },
        insights: {
          mainPoints: [input],
          productMentions: [],
          fitIssues: [],
          stylePreferences: []
        },
        styleAnalysis: {
          preferredStyles: {},
          avoidedStyles: {},
          fitPreferences: {},
          occasions: []
        },
        recommendations: {
          immediate: ["Analyze feedback further"],
          products: [],
          alternatives: [],
          improvements: []
        },
        categories: {
          productQuality: false,
          styleMatch: false,
          fitIssues: false,
          userExperience: true,
          priceConcerns: false
        },
        followUpQuestions: ["Could you provide more details?"]
      };
    }

    // Generate response message based on analysis
    const responseMessage = analysis.sentiment.type === 'negative' 
      ? `I understand your concerns. Let me help address these issues.`
      : `Thank you for your feedback! I'll use this to improve your recommendations.`;

    return res.status(200).json({
      message: responseMessage,
      ...analysis,
      followUpOptions: analysis.followUpQuestions
    });

  } catch (error) {
    console.error('Feedback processing error:', error);
    // Return fallback response
    return res.status(200).json({
      message: "I understand. Could you tell me more?",
      sentiment: {
        type: "neutral",
        score: 3,
        keyPhrases: [],
        painPoints: []
      },
      insights: {
        mainPoints: ["Further analysis needed"],
        productMentions: [],
        fitIssues: [],
        stylePreferences: []
      },
      styleAnalysis: {
        preferredStyles: {},
        avoidedStyles: {},
        fitPreferences: {},
        occasions: []
      },
      recommendations: {
        immediate: ["Gather more feedback"],
        products: [],
        alternatives: [],
        improvements: []
      },
      categories: {
        productQuality: false,
        styleMatch: false,
        fitIssues: false,
        userExperience: true,
        priceConcerns: false
      },
      followUpQuestions: ["Could you provide more details?"],
      followUpOptions: ["Tell me more", "Give examples", "Start over"]
    });
  }
}