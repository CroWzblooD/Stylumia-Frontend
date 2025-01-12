import React, { useState, useEffect } from 'react';
import styles from '@/styles/FashionInsights.module.css';
import stringSimilarity from 'string-similarity';

const FashionInsights = ({ onFilterChange }) => {
    const [allInsights, setAllInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [voiceSearch, setVoiceSearch] = useState(false);
    const [selectedAttribute, setSelectedAttribute] = useState(null);

    useEffect(() => {
        fetchAllInsights();
    }, []);

    const fetchAllInsights = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/api/fashion-insights/all');
            const data = await response.json();
            setAllInsights(data);
        } catch (error) {
            console.error('Error fetching all insights:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const generateSearchSuggestions = (term) => {
        if (!term || !allInsights) {
            setSearchSuggestions([]);
            return;
        }

        const termLower = term.toLowerCase();
        const allTerms = new Set();

        // Collect searchable terms from cross-category trends
        allInsights.cross_category_trends?.popular_combinations?.forEach(combo => {
            combo.styles?.forEach(style => allTerms.add(style));
            combo.materials?.forEach(material => allTerms.add(material));
            combo.colors?.forEach(color => allTerms.add(color));
            combo.categories?.forEach(category => allTerms.add(category));
        });

        // Filter and sort suggestions
        const suggestions = Array.from(allTerms)
            .filter(suggestion => {
                const suggestionLower = suggestion.toLowerCase();
                return suggestionLower.includes(termLower) || 
                       stringSimilarity.compareTwoStrings(termLower, suggestionLower) > 0.3;
            })
            .sort((a, b) => {
                const aScore = stringSimilarity.compareTwoStrings(termLower, a.toLowerCase());
                const bScore = stringSimilarity.compareTwoStrings(termLower, b.toLowerCase());
                return bScore - aScore;
            })
            .slice(0, 5);

        setSearchSuggestions(suggestions);
    };

    const handleSearchInput = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        generateSearchSuggestions(term);
    };

    const handleSearchSubmit = (term) => {
        setIsSearching(true);
        setSearchSuggestions([]);
        onFilterChange('searchTerm', term);
        setIsSearching(false);
    };

    const startVoiceSearch = () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                setVoiceSearch(true);
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setSearchTerm(transcript);
                handleSearchSubmit(transcript);
            };

            recognition.onend = () => {
                setVoiceSearch(false);
            };

            recognition.onerror = () => {
                setVoiceSearch(false);
                alert('Voice search failed. Please try again.');
            };

            recognition.start();
        } else {
            alert('Voice search is not supported in your browser');
        }
    };

    const renderCrossCategoryTrends = () => (
        <div className={styles.cross_category_section}>
            <h3>Cross-Category Fashion Trends</h3>
            <div className={styles.trend_cards}>
                {allInsights?.cross_category_trends?.popular_combinations
                    ?.map((combo, index) => (
                        <div key={index} className={styles.trend_card}>
                            <div className={styles.trend_rank}>#{index + 1}</div>
                            <div className={styles.trend_content}>
                                <h4>Trending Combination</h4>
                                <div className={styles.category_tags}>
                                    {Array.from(combo.categories).map((category, idx) => (
                                        <span key={idx} className={styles.category_tag}>
                                            {category}
                                        </span>
                                    ))}
                                </div>
                                <div className={styles.combo_details}>
                                    {combo.styles?.length > 0 && (
                                        <div className={styles.style_chips}>
                                            {combo.styles.map((style, idx) => (
                                                <button
                                                    key={idx}
                                                    className={styles.style_chip}
                                                    onClick={() => onFilterChange('style', style)}
                                                >
                                                    {style}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {combo.materials?.length > 0 && (
                                        <div className={styles.material_chips}>
                                            {combo.materials.map((material, idx) => (
                                                <button
                                                    key={idx}
                                                    className={styles.material_chip}
                                                    onClick={() => onFilterChange('material', material)}
                                                >
                                                    {material}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {combo.colors?.length > 0 && (
                                        <div className={styles.color_chips}>
                                            {combo.colors.map((color, idx) => (
                                                <button
                                                    key={idx}
                                                    className={styles.color_chip}
                                                    onClick={() => onFilterChange('color', color)}
                                                >
                                                    <span 
                                                        className={styles.color_dot}
                                                        style={{backgroundColor: color.toLowerCase()}}
                                                    />
                                                    {color}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <div className={styles.combo_stats}>
                                        <span>Found in {combo.occurrences.length} products</span>
                                        <span>
                                            Price Range: {formatPrice(combo.price_range.min)} - {formatPrice(combo.price_range.max)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );

    const renderAttributeInsights = () => {
        if (!allInsights?.knowledge_graph?.style_relationships) return null;

        const relationships = allInsights.knowledge_graph.style_relationships;
        return (
            <div className={styles.attribute_section}>
                <h3>Fashion Attribute Analysis</h3>
                <div className={styles.attribute_grid}>
                    {Object.entries(relationships).map(([style, data]) => (
                        <div 
                            key={style} 
                            className={`${styles.attribute_card} ${selectedAttribute === style ? styles.selected : ''}`}
                            onClick={() => setSelectedAttribute(style === selectedAttribute ? null : style)}
                        >
                            <h4>{style}</h4>
                            <div className={styles.attribute_stats}>
                                <span>Frequency: {data.count}</span>
                                <span>Avg Price: {formatPrice(data.price_range.avg)}</span>
                            </div>
                            {selectedAttribute === style && (
                                <div className={styles.attribute_details}>
                                    <div className={styles.material_section}>
                                        <h5>Common Materials</h5>
                                        <div className={styles.material_chips}>
                                            {Object.entries(data.materials)
                                                .sort(([,a], [,b]) => b - a)
                                                .slice(0, 5)
                                                .map(([material, count]) => (
                                                    <button
                                                        key={material}
                                                        className={styles.material_chip}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onFilterChange('material', material);
                                                        }}
                                                    >
                                                        {material} ({count})
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                    <div className={styles.color_section}>
                                        <h5>Popular Colors</h5>
                                        <div className={styles.color_chips}>
                                            {Object.entries(data.colors)
                                                .sort(([,a], [,b]) => b - a)
                                                .slice(0, 5)
                                                .map(([color, count]) => (
                                                    <button
                                                        key={color}
                                                        className={styles.color_chip}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onFilterChange('color', color);
                                                        }}
                                                    >
                                                        <span 
                                                            className={styles.color_dot}
                                                            style={{backgroundColor: color.toLowerCase()}}
                                                        />
                                                        {color} ({count})
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                    <div className={styles.occasion_section}>
                                        <h5>Suitable Occasions</h5>
                                        <div className={styles.occasion_tags}>
                                            {data.occasions.map((occasion, idx) => (
                                                <span key={idx} className={styles.occasion_tag}>
                                                    {occasion}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderEmergingTrends = () => {
        if (!allInsights?.knowledge_graph?.trend_patterns?.emerging_styles) return null;

        return (
            <div className={styles.emerging_trends_section}>
                <h3>Emerging Fashion Trends</h3>
                <div className={styles.trend_timeline}>
                    {allInsights.knowledge_graph.trend_patterns.emerging_styles.map((trend, index) => (
                        <div key={index} className={styles.trend_item}>
                            <div className={styles.trend_marker}>
                                <span className={styles.trend_number}>{index + 1}</span>
                            </div>
                            <div className={styles.trend_content}>
                                <h4>{trend.style}</h4>
                                <span className={styles.trend_count}>
                                    Found in {trend.count} products
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className={styles.loading}>Loading fashion insights...</div>;
    }

    return (
        <div className={styles.insights_container}>
            <div className={styles.insights_header}>
                <h2>Fashion Insights & Trends Analysis</h2>
            </div>

            <div className={styles.search_bar}>
                <div className={styles.search_container}>
                    <button 
                        className={`${styles.voice_search_btn} ${voiceSearch ? styles.active : ''}`}
                        onClick={startVoiceSearch}
                    >
                        🎤
                    </button>
                    <input
                        type="text"
                        placeholder="Search across all categories..."
                        value={searchTerm}
                        onChange={handleSearchInput}
                        className={styles.search_input}
                    />
                    <button 
                        className={styles.search_btn}
                        onClick={() => handleSearchSubmit(searchTerm)}
                        disabled={isSearching}
                    >
                        {isSearching ? 'Searching...' : 'Search'}
                    </button>
                </div>
                {searchSuggestions.length > 0 && (
                    <div className={styles.search_suggestions}>
                        {searchSuggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                className={styles.suggestion_item}
                                onClick={() => {
                                    setSearchTerm(suggestion);
                                    handleSearchSubmit(suggestion);
                                }}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* New Emerging Trends Section */}
            {renderEmergingTrends()}

            {/* New Attribute Insights Section */}
            {renderAttributeInsights()}

            {/* Shop by Budget */}
            <div className={styles.budget_section}>
                <h3>Shop by Budget</h3>
                <div className={styles.budget_ranges}>
                    {[
                        { label: 'Budget Friendly', range: [0, 1000] },
                        { label: 'Mid Range', range: [1000, 3000] },
                        { label: 'Premium', range: [3000, 5000] },
                        { label: 'Luxury', range: [5000, Infinity] }
                    ].map((budget, index) => (
                        <button
                            key={index}
                            className={styles.budget_card}
                            onClick={() => onFilterChange('priceRange', budget.range)}
                        >
                            <span className={styles.budget_label}>{budget.label}</span>
                            <span className={styles.budget_range}>
                                {budget.range[1] === Infinity 
                                    ? `${formatPrice(budget.range[0])}+`
                                    : `${formatPrice(budget.range[0])} - ${formatPrice(budget.range[1])}`
                                }
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Cross-category trends */}
            {renderCrossCategoryTrends()}
        </div>
    );
};

export default FashionInsights;