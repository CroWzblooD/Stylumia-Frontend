import React, { useState, useEffect } from 'react';
import styles from '../styles/SmartRecommendations.module.css';
import TrendInsights from './SmartRecommendations/TrendInsights';
import ProductCard from './SmartRecommendations/ProductCard';
import { AlertCircle, Clock, Database, Zap } from 'react-feather';
import Image from 'next/image';
import { FiHeart, FiShoppingBag, FiTrendingUp, FiThumbsUp, FiBarChart2, FiShoppingCart } from 'react-icons/fi';

export default function SmartRecommendations() {
    const [activeTab, setActiveTab] = useState('recommendations');
    const [recommendations, setRecommendations] = useState([]);
    const [likedProducts, setLikedProducts] = useState([]);
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [showInsights, setShowInsights] = useState(false);
    const [userFeedback, setUserFeedback] = useState({});
    const [feedbackBasedProducts, setFeedbackBasedProducts] = useState([]);
    const [userPreferences, setUserPreferences] = useState({});

    const loadingSteps = [
        { icon: <Database />, text: 'Analyzing your preferences...' },
        { icon: <Clock />, text: 'Processing temporal trends...' },
        { icon: <Zap />, text: 'Generating personalized recommendations...' }
    ];

    useEffect(() => {
        generateRecommendations();
    }, [likedProducts, purchaseHistory]);

    useEffect(() => {
        // Load feedback data from CSV or localStorage
        const loadFeedbackData = async () => {
            try {
                const response = await fetch('/api/get-feedback-data');
                const data = await response.json();
                processUserPreferences(data);
            } catch (error) {
                console.error('Error loading feedback data:', error);
            }
        };

        loadFeedbackData();
    }, []);

    const processUserPreferences = (feedbackData) => {
        // Process feedback data to extract preferences
        const preferences = {
            styles: {},
            colors: {},
            occasions: {},
            priceRanges: {},
            brands: {}
        };

        feedbackData.forEach(feedback => {
            // Update preferences based on feedback analysis
            if (feedback.styleAnalysis?.preferredStyles) {
                Object.entries(feedback.styleAnalysis.preferredStyles).forEach(([style, count]) => {
                    preferences.styles[style] = (preferences.styles[style] || 0) + count;
                });
            }
            // ... process other preferences
        });

        setUserPreferences(preferences);
        updateRecommendations(preferences);
    };

    const generateRecommendations = async () => {
        try {
            setLoading(true);
            
            // Simulate loading steps
            for (let i = 0; i < loadingSteps.length; i++) {
                setLoadingStep(i);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            console.log('Sending liked products:', likedProducts);
            console.log('Sending purchase history:', purchaseHistory);

            const response = await fetch('/api/recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    likedProducts,
                    purchaseHistory
                }),
            });

            if (!response.ok) throw new Error('Failed to fetch recommendations');

            const data = await response.json();
            console.log('Received recommendations:', data);
            setRecommendations(data.recommendations);

        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
            setLoadingStep(0);
        }
    };

    const handleLike = (product) => {
        if (!likedProducts.find(p => p.product_id === product.product_id)) {
            setLikedProducts(prev => [...prev, product]);
            // Store in localStorage
            localStorage.setItem('likedProducts', JSON.stringify([...likedProducts, product]));
        }
    };

    const handleBuy = (product) => {
        if (!purchaseHistory.find(p => p.product_id === product.product_id)) {
            setPurchaseHistory(prev => [...prev, product]);
            // Store in localStorage
            localStorage.setItem('purchaseHistory', JSON.stringify([...purchaseHistory, product]));
        }
    };

    const handleFeedback = async (productId, feedbackType) => {
        setUserFeedback(prev => ({
            ...prev,
            [productId]: feedbackType
        }));

        try {
            await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId,
                    feedbackType,
                    likedProducts,
                    purchaseHistory,
                    timestamp: new Date().toISOString()
                }),
            });
        } catch (error) {
            console.error('Error sending feedback:', error);
        }
    };

    // Load liked and purchased products from localStorage on component mount
    useEffect(() => {
        const storedLikedProducts = localStorage.getItem('likedProducts');
        const storedPurchaseHistory = localStorage.getItem('purchaseHistory');
        
        if (storedLikedProducts) {
            setLikedProducts(JSON.parse(storedLikedProducts));
        }
        if (storedPurchaseHistory) {
            setPurchaseHistory(JSON.parse(storedPurchaseHistory));
        }
    }, []);

    if (loading) {
        return (
            <div className={styles.loading_container}>
                <div className={styles.loading_steps}>
                    {loadingSteps.map((step, index) => (
                        <div 
                            key={index} 
                            className={`${styles.loading_step} ${index === loadingStep ? styles.active : ''}`}
                        >
                            {step.icon}
                            <span>{step.text}</span>
                        </div>
                    ))}
                </div>
                <div className={styles.progress_bar}>
                    <div className={styles.progress_fill} />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Smart Recommendations</h1>
                <button 
                    className={styles.insights_toggle}
                    onClick={() => setShowInsights(!showInsights)}
                >
                    {showInsights ? 'Hide Insights' : 'Show Insights'}
                </button>
            </div>

            {showInsights && (
                <TrendInsights 
                    likedProducts={likedProducts}
                    purchaseHistory={purchaseHistory}
                />
            )}

            {recommendations.length > 0 && (
                <div className={styles.trend_banner}>
                    <AlertCircle />
                    <span>Based on your {likedProducts.length} liked and {purchaseHistory.length} purchased items</span>
                </div>
            )}

            <div className={styles.tabs}>
                <button 
                    className={`${styles.tab} ${activeTab === 'recommendations' ? styles.active : ''}`}
                    onClick={() => setActiveTab('recommendations')}
                >
                    Recommendations ({recommendations.length})
                </button>
                <button 
                    className={`${styles.tab} ${activeTab === 'liked' ? styles.active : ''}`}
                    onClick={() => setActiveTab('liked')}
                >
                    Liked Items ({likedProducts.length})
                </button>
            </div>

            <div className={styles.product_grid}>
                {activeTab === 'recommendations' ? (
                    recommendations.map(product => (
                        <ProductCard
                            key={product.product_id}
                            product={product}
                            onLike={handleLike}
                            onBuy={handleBuy}
                            onFeedback={handleFeedback}
                        />
                    ))
                ) : (
                    likedProducts.map(product => (
                        <ProductCard
                            key={product.product_id}
                            product={product}
                            onLike={handleLike}
                            onBuy={handleBuy}
                            onFeedback={handleFeedback}
                        />
                    ))
                )}
            </div>

            {/* New Feedback-Based Recommendations Section */}
            {activeTab === 'feedback' && (
                <div className={styles.feedback_recommendations}>
                    <div className={styles.preferences_summary}>
                        <h3 className="text-xl font-semibold mb-4">Your Style Preferences</h3>
                        <div className={styles.preference_tags}>
                            {Object.entries(userPreferences.styles || {}).map(([style, count]) => (
                                <span key={style} className={styles.preference_tag}>
                                    {style} ({count})
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className={styles.product_grid}>
                        {feedbackBasedProducts.map(product => (
                            <div key={product.id} className={styles.product_card}>
                                <div className={styles.image_container}>
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        layout="fill"
                                        className={styles.product_image}
                                    />
                                    <div className={styles.feedback_match}>
                                        {product.matchScore}% Match
                                    </div>
                                </div>
                                <div className={styles.product_info}>
                                    <h3 className={styles.product_name}>{product.name}</h3>
                                    <p className={styles.brand}>{product.brand}</p>
                                    <p className={styles.price}>${product.price}</p>
                                    <div className={styles.match_details}>
                                        <div className={styles.match_criteria}>
                                            {product.matchCriteria.map(criteria => (
                                                <span key={criteria} className={styles.match_tag}>
                                                    {criteria}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Purchase History Section */}
            {activeTab === 'purchases' && (
                <div className={styles.purchase_history}>
                    <h3 className="text-xl font-semibold mb-4">Your Shopping History</h3>
                    <div className={styles.history_grid}>
                        {purchaseHistory.map(purchase => (
                            <div key={purchase.id} className={styles.history_card}>
                                <div className={styles.purchase_info}>
                                    <Image
                                        src={purchase.image}
                                        alt={purchase.name}
                                        width={100}
                                        height={100}
                                        className={styles.history_image}
                                    />
                                    <div className={styles.purchase_details}>
                                        <h4>{purchase.name}</h4>
                                        <p className={styles.purchase_date}>
                                            Purchased on {new Date(purchase.date).toLocaleDateString()}
                                        </p>
                                        <div className={styles.similar_products}>
                                            <button className={styles.similar_button}>
                                                Find Similar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
