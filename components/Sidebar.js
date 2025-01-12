'use client';
import { useTab } from '../context/TabContext';
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/router';

export default function Sidebar() {
  const { activeTab, setActiveTab } = useTab();
  const { isSignedIn } = useUser();
  const router = useRouter();

  const handleTabClick = (tabId) => {
    if (tabId === 'dashboard' || isSignedIn) {
      setActiveTab(tabId);
    } else {
      // Redirect to sign-in for protected tabs
      router.push('/sign-in');
    }
  };

  const menuItems = [
    {
      id: 'dashboard',
      title: 'AI Dashboard',
      subtitle: 'Personalized fashion insights',
      icon: '🎯'
    },
    {
      id: 'fashionOntology',
      title: 'Fashion Ontology',
      subtitle: 'Interactive fashion knowledge graph',
      icon: '🕸️'
    },
    {
      id: 'ProductList',
      title: 'Feature Extraction',
      subtitle: 'Fashion relationships',
      icon: '🎨'
    },
    {
      id: 'tryOn',
      title: 'Virtual Try-On',
      subtitle: 'Try clothes virtually',
      icon: '👕'
    },
    {
      id: 'FashionTrend',
      title: 'Trend Radar',
      subtitle: 'Fashion trend analysis',
      icon: '📊'
    },
    {
      id: 'RecommendationAgent',
      title: 'Agentic Fashion',
      subtitle: 'Fashion recommendations',
      icon: '🌱'
    },
    {
      id: 'aiStylist',
      title: 'Feedback Engine',
      subtitle: 'Learning engine loop',
      icon: '🤖'
    },
    // {
    //   id: 'fashionAnalytics',
    //   title: 'Fashion Analytics',
    //   subtitle: 'AI-powered garment analysis',
    //   icon: '🔍'
    // },
   
  ];

  return (
    <div className="w-72 bg-white/80 backdrop-blur-lg h-[calc(100vh-64px)] overflow-hidden">
      <div className="p-6 h-full overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={`w-full text-left flex items-start gap-6 p-6 rounded-lg transition-all duration-200 mb-2
              ${activeTab === item.id 
                 ? 'bg-gradient-to-r from-[#FF6B35]/10 to-[#FF8FA3]/10 border-r-4 border-[#FF6B35]' 
                    : 'hover:bg-pink-50/50'
              }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className={`text-sm font-medium ${
                activeTab === item.id ? 'text-fashion-orange' : 'text-gray-700'
              }`}>
                {item.title}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {item.subtitle}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}