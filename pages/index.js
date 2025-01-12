import { useState, useEffect } from 'react';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { TabProvider, useTab } from '../context/TabContext';


function DynamicContent() {
  const { activeTab } = useTab();
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    const loadComponent = async () => {
      let component;
      switch(activeTab) {
        case 'dashboard':
          component = (await import('../components/DashboardContent')).default;
          break;
        case 'tryOn':
          component = (await import('../components/TryOnContent')).default;
          break;
        case 'FashionTrend':
          component = (await import('../components/FashionTrend')).default;
          break;
        case 'RecommendationAgent':
          component = (await import('../components/SmartRecommendations')).default;
          break;
        case 'aiStylist':
          component = (await import('../components/AIStylistContent')).default;
          break;
        case 'fashionAnalytics':
          component = (await import('../components/FashionAnalyticsContent')).default;
          break;
        case 'fashionOntology':
          component = (await import('../components/FashionOntology')).default;
          break;
        case 'ProductList':
          component = (await import('../components/ProductList')).default;
          break;
        case 'profile':
          component = (await import('../components/Profile/ProfilePage')).default;
          break;
        default:
          component = (await import('../components/DashboardContent')).default;
      }
      setComponent(() => component);
    };

    loadComponent();
  }, [activeTab]);

  if (!Component) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fashion-orange"></div>
      </div>
    );
  }

  return <Component />;
}

export default function Home() {
  const products = [
    {
      id: '1',
      title: 'Organic Cotton Sweater',
      price: '89',
      image: '/images/sweater.jpg',
      description: 'Made from 100% organic cotton, eco-friendly dyes',
      carbonSaved: '2.5',
      sustainabilityScore: 85
    },
    {
      id: '2',
      title: 'Recycled Denim Jeans',
      price: '120',
      image: '/images/jeans.jpg',
      description: 'Created from recycled denim materials',
      carbonSaved: '3.8',
      sustainabilityScore: 90
    },
    // Add other products...
  ];

  return (
    <TabProvider>
      {/* Navbar - Fixed */}
      <Navbar className="fixed top-0 left-0 right-0 h-16 z-50" />
      
      {/* Main container */}
      <div className="min-h-screen pt-16">
        <div className="flex">
          {/* Sidebar wrapper - Scrolls with page */}
          <div className="w-[280px] relative">
            <aside className="fixed top-16 w-[280px] bg-white border-r border-gray-100">
              <Sidebar />
            </aside>
          </div>

          {/* Content area */}
          <div className="flex-1">
            <main className="min-h-[calc(100vh-64px-280px)] bg-gradient-to-br from-fashion-pink to-white">
              <div className="max-w-6xl mx-auto px-6 py-8 overflow-y-auto">
                <DynamicContent />
              </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100">
              <Footer />
            </footer>
          </div>
        </div>
      </div>
    </TabProvider>
  );
}