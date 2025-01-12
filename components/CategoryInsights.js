// frontend/components/CategoryInsights.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '@/styles/CategoryInsights.module.css';

const CategoryInsights = ({ category }) => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchInsights();
    }, [category]);

    const fetchInsights = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8000/api/insights/${category}`);
            setInsights(response.data);
        } catch (error) {
            console.error('Error fetching insights:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading insights...</div>;
    if (!insights) return null;

    return (
        <div className={styles.insights_container}>
            <h2>Category Insights</h2>
            
            <div className={styles.trend_cards}>
                <div className={styles.trend_card}>
                    <h3>Price Distribution</h3>
                    <div className={styles.price_bars}>
                        {Object.entries(insights.trends.price_ranges).map(([range, count]) => (
                            <div key={range} className={styles.price_bar}>
                                <div 
                                    className={styles.bar} 
                                    style={{height: `${count * 10}px`}}
                                />
                                <span>{range}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.trend_card}>
                    <h3>Popular Materials</h3>
                    <div className={styles.material_tags}>
                        {Object.entries(insights.trends.material_counts)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 5)
                            .map(([material, count]) => (
                                <span key={material} className={styles.tag}>
                                    {material} ({count})
                                </span>
                            ))}
                    </div>
                </div>
            </div>

            <div className={styles.recommendations}>
                <h3>Recommendations</h3>
                <ul>
                    {insights.recommendations.material_insights.map((insight, idx) => (
                        <li key={idx}>{insight}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CategoryInsights;