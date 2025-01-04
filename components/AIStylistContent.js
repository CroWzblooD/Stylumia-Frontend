import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FiCamera, FiSend, FiUser } from 'react-icons/fi';
import { RiRobot2Line } from 'react-icons/ri';

export default function AIStylistContent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Welcome message when component mounts
  useEffect(() => {
    setMessages([
      {
        type: 'assistant',
        content: "Hello! I'm your AI Fashion Stylist. I can help you with outfit recommendations, style advice, and fashion trends. Feel free to upload photos or ask me anything about fashion!"
      }
    ]);
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() && !selectedImage) return;

    setIsLoading(true);
    const newMessage = {
      type: 'user',
      content: input,
      image: selectedImage
    };

    setMessages(prev => [...prev, newMessage]);
    
    try {
      const formData = new FormData();
      if (selectedImage) {
        formData.append('image', selectedImage, selectedImage.name);
      }
      formData.append('message', input);

      const response = await fetch('/api/sambanova-chat', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: data.response
      }]);
    } catch (error) {
      console.error('Error:', error);
    }

    setInput('');
    setSelectedImage(null);
    setIsLoading(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">AI Fashion Stylist</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your personal fashion advisor powered by AI. Get outfit recommendations, style tips, and trend insights instantly.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Features Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-pink-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">What I Can Help You With</h3>
            <ul className="space-y-3">
              {[
                '🎯 Personalized outfit recommendations',
                '📸 Analyze your clothing photos',
                '🎨 Color combination advice',
                '🛍️ Shopping suggestions',
                '💫 Latest fashion trends',
                '👗 Body type styling tips'
              ].map((feature, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <span className="mr-2">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-pink-100">
            {/* Chat Messages */}
            <div 
              ref={chatContainerRef}
              className="bg-gray-50 rounded-xl p-4 h-[500px] overflow-y-auto mb-4 scroll-smooth"
            >
              {messages.map((message, index) => (
                <div key={index} className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-fashion-orange text-white ml-2' 
                        : 'bg-purple-100 text-purple-600 mr-2'
                    }`}>
                      {message.type === 'user' ? <FiUser /> : <RiRobot2Line />}
                    </div>
                    
                    {/* Message Content */}
                    <div className={`rounded-2xl p-4 ${
                      message.type === 'user' 
                        ? 'bg-fashion-orange text-white' 
                        : 'bg-white border border-gray-200'
                    }`}>
                      {message.image && (
                        <div className="mb-3">
                          <Image 
                            src={URL.createObjectURL(message.image)} 
                            alt="Uploaded fashion item"
                            width={200}
                            height={200}
                            className="rounded-lg"
                          />
                        </div>
                      )}
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                      <RiRobot2Line className="text-purple-600" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-4">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="flex gap-3">
              <button 
                onClick={() => fileInputRef.current.click()}
                className="p-3 text-gray-500 hover:text-fashion-orange transition-colors bg-gray-50 rounded-xl hover:bg-gray-100"
              >
                <FiCamera className="w-5 h-5" />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about fashion, styles, or upload a photo..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-fashion-orange/50"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="p-3 bg-fashion-orange text-white rounded-xl hover:bg-fashion-orange/90 transition-colors disabled:opacity-50"
              >
                <FiSend className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Style Tips Card */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Today's Style Tip",
                content: "Layer different textures to add depth to your outfit. Try combining smooth silk with rough denim or soft knits with leather.",
                icon: "💡"
              },
              {
                title: "Trending Now",
                content: "Oversized blazers, sustainable fashion, and monochromatic outfits are making waves this season.",
                icon: "🔥"
              },
              {
                title: "Seasonal Advice",
                content: "Transitional weather? Layer light pieces that can be easily removed as the temperature changes throughout the day.",
                icon: "🌤️"
              }
            ].map((tip, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-pink-100">
                <div className="text-2xl mb-3">{tip.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{tip.title}</h3>
                <p className="text-gray-600">{tip.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 