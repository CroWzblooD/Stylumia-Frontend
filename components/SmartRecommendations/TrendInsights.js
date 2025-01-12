import React from 'react';
import styles from '../../styles/TrendInsights.module.css';
import { TrendingUp, Clock, Package, Users } from 'react-feather';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    LineElement,
    PointElement, 
    ArcElement,
    RadialLinearScale,
    Title, 
    Tooltip, 
    Legend 
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend
);

export default function TrendInsights({ 
    likedProducts = [], 
    purchaseHistory = [], 
    recommendations = []
}) {
    const popularItems = recommendations.length > 0 ? recommendations : [
        { name: 'Summer Dress', category: 'Dresses', popularity: 85 },
        { name: 'Classic Denim', category: 'Jeans', popularity: 78 },
        { name: 'Floral Blouse', category: 'Tops', popularity: 72 }
    ];

    return (
        <div className={styles.insights_grid}>
            {/* Top Stats Row */}
            <div className={styles.stats_row}>
                <div className={styles.stat_card}>
                    <Package className={styles.stat_icon} />
                    <div className={styles.stat_content}>
                        <h4>Analyzing Items</h4>
                        <div className={styles.stat_value}>16</div>
                    </div>
                </div>
                <div className={styles.stat_card}>
                    <TrendingUp className={styles.stat_icon} />
                    <div className={styles.stat_content}>
                        <h4>Processing Trend Data</h4>
                        <div className={styles.stat_value}>85%</div>
                    </div>
                </div>
            </div>

            {/* Two Column Grid */}
            <div className={styles.main_grid}>
                {/* Left Column */}
                <div className={styles.grid_column}>
                    {/* Category Performance */}
                    <div className={styles.chart_card}>
                        <h3>Category Performance</h3>
                        <Bar 
                            data={{
                                labels: ['Dresses', 'Tops', 'Accessories', 'Footwear'],
                                datasets: [{
                                    data: [65, 85, 45, 55],
                                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                    borderColor: 'rgba(255, 99, 132, 1)',
                                    borderWidth: 1
                                }]
                            }}
                            options={{
                                plugins: { legend: { display: false } },
                                scales: { y: { beginAtZero: true } }
                            }}
                        />
                    </div>

                    {/* Style Evolution */}
                    <div className={styles.chart_card}>
                        <h3>Style Evolution</h3>
                        <Line 
                            data={{
                                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                datasets: [{
                                    label: 'Trend Adoption',
                                    data: [30, 45, 55, 60, 75, 85],
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    tension: 0.4
                                }]
                            }}
                            options={{
                                plugins: { legend: { display: false } }
                            }}
                        />
                    </div>
                </div>

                {/* Right Column */}
                <div className={styles.grid_column}>
                    {/* Seasonal Trends */}
                    <div className={styles.chart_card}>
                        <h3>Seasonal Trends</h3>
                        <div className={styles.seasonal_trends}>
                            <div className={styles.season_item}>
                                <h4>Spring</h4>
                                <div className={styles.trend_list}>
                                    <span>Floral Patterns (75%)</span>
                                    <span>Light Fabrics (68%)</span>
                                </div>
                            </div>
                            <div className={styles.season_item}>
                                <h4>Summer</h4>
                                <div className={styles.trend_list}>
                                    <span>Bright Colors (82%)</span>
                                    <span>Breathable Materials (70%)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Popular Items */}
                    <div className={styles.chart_card}>
                        <h3>Most Popular Items</h3>
                        <div className={styles.popular_items}>
                            {popularItems.slice(0, 3).map((item, index) => (
                                <div key={index} className={styles.popular_item}>
                                    <span className={styles.rank}>{index + 1}</span>
                                    <div className={styles.item_info}>
                                        <span>{item.name}</span>
                                        <small>{item.category}</small>
                                    </div>
                                    <span className={styles.popularity}>
                                        {item.popularity}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 