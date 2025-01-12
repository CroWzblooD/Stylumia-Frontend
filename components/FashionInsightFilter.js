import React, { useState } from 'react';
import styles from '@/styles/FashionInsightFilter.module.css';
import debounce from 'lodash/debounce';

const FashionInsightFilter = ({ insights, onFilterChange, selectedFilters, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isVoiceListening, setIsVoiceListening] = useState(false);
    const [processingFilter, setProcessingFilter] = useState(false);
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const trendOptions = [
        { value: 'trending', label: 'Trending Now', score: '>80' },
        { value: 'popular', label: 'Popular', score: '70-80' },
        { value: 'stable', label: 'Stable', score: '60-70' },
        { value: 'classic', label: 'Classic', score: '<60' }
    ];

    const priceRanges = [
        { min: 0, max: 1000, label: 'Under ₹1,000' },
        { min: 1000, max: 3000, label: '₹1,000 - ₹3,000' },
        { min: 3000, max: 5000, label: '₹3,000 - ₹5,000' },
        { min: 5000, max: Infinity, label: 'Above ₹5,000' }
    ];

    const colorOptions = [
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Red', hex: '#FF0000' },
        { name: 'Blue', hex: '#0000FF' },
        { name: 'Green', hex: '#00FF00' },
        { name: 'Yellow', hex: '#FFFF00' },
        { name: 'Pink', hex: '#FFC0CB' },
        { name: 'Purple', hex: '#800080' }
    ];

    const handleFilterChange = async (type, value) =>{
        setProcessingFilter(true);
        try {
            await onFilterChange(type, value);
        } finally {
            setProcessingFilter(false);
        }
    };

    const renderSkeletonLoader = () => (
        <div className={styles.skeleton_wrapper}>
            {[1, 2, 3, 4].map((item) => (
                <div key={item} className={styles.skeleton_item}>
                    <div className={styles.skeleton_checkbox} />
                    <div className={styles.skeleton_text} />
                </div>
            ))}
        </div>
    );

    const startVoiceSearch = () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                setIsVoiceListening(true);
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setSearchTerm(transcript);
                onFilterChange('search', transcript);
            };

            recognition.onend = () => {
                setIsVoiceListening(false);
            };

            recognition.start();
        } else {
            alert('Voice search is not supported in your browser');
        }
    };

    const performSemanticSearch = async (query) => {
        try {
            setIsSearching(true);
            const response = await fetch('/api/semantic-search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    category: 'all',
                    threshold: 0.6 // Adjust similarity threshold
                })
            });
            
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Semantic search error:', error);
            return [];
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onFilterChange('search', value);
    };

    const renderSearchSuggestions = () => (
        searchSuggestions.length > 0 && (
            <div className={styles.search_suggestions}>
                {searchSuggestions.map((suggestion, index) => (
                    <div 
                        key={index}
                        className={styles.suggestion_item}
                        onClick={() => {
                            setSearchTerm(suggestion.text);
                            onFilterChange('search', suggestion.text);
                            setSearchSuggestions([]);
                        }}
                    >
                        <span>{suggestion.text}</span>
                        <span className={styles.similarity_score}>
                            {Math.round(suggestion.similarity * 100)}% match
                        </span>
                    </div>
                ))}
            </div>
        )
    );

    return (
        <div className={styles.filter_container}>
            <div className={styles.filter_header}>
                <h2>Fashion Insights</h2>
                <div className={styles.search_section}>
                    <div className={styles.search_wrapper}>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className={styles.search_input}
                        />
                        <button 
                            className={`${styles.voice_button} ${isVoiceListening ? styles.listening : ''}`}
                            onClick={startVoiceSearch}
                        >
                            🎤
                        </button>
                    </div>
                    <button 
                        className={styles.clear_filters}
                        onClick={() => {
                            setSearchTerm('');
                            onFilterChange('clear');
                        }}
                    >
                        Clear All
                    </button>
                </div>
            </div>

            <div className={styles.filters_wrapper}>
                {/* Trend Status Filter */}
                <div className={styles.filter_section}>
                    <h3>Trend Status</h3>
                    {loading || processingFilter ? renderSkeletonLoader() : (
                        <div className={styles.options_grid}>
                            {trendOptions.map(trend => (
                                <label key={trend.value} className={styles.filter_option}>
                                    <input
                                        type="checkbox"
                                        className={styles.checkbox}
                                        checked={selectedFilters?.trends?.includes(trend.value)}
                                        onChange={() => handleFilterChange('trends', trend.value)}
                                        disabled={processingFilter}
                                    />
                                    <span>{trend.label}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Price Range Filter */}
                <div className={styles.filter_section}>
                    <h3>Price Range</h3>
                    {loading || processingFilter ? renderSkeletonLoader() : (
                        <div className={styles.options_grid}>
                            {priceRanges.map((range, index) => (
                                <label key={index} className={styles.filter_option}>
                                    <input
                                        type="checkbox"
                                        className={styles.checkbox}
                                        checked={selectedFilters?.priceRanges?.some(
                                            r => r.min === range.min && r.max === range.max
                                        )}
                                        onChange={() => handleFilterChange('priceRanges', range)}
                                        disabled={processingFilter}
                                    />
                                    <span>{range.label}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Color Filter */}
                <div className={styles.filter_section}>
                    <h3>Colors</h3>
                    {loading || processingFilter ? (
                        <div className={styles.skeleton_colors}>
                            {[1, 2, 3, 4, 5, 6].map(item => (
                                <div key={item} className={styles.skeleton_color} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.color_options}>
                            {colorOptions.map(color => (
                                <button
                                    key={color.name}
                                    className={`${styles.color_button} ${
                                        selectedFilters?.colors?.includes(color.name) ? styles.selected : ''
                                    }`}
                                    style={{ backgroundColor: color.hex }}
                                    onClick={() => handleFilterChange('colors', color.name)}
                                    disabled={processingFilter}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Material Filter */}
                <div className={styles.filter_section}>
                    <h3>Materials</h3>
                    {loading || processingFilter ? renderSkeletonLoader() : (
                        <div className={styles.options_grid}>
                            {insights?.materials?.map((material, index) => (
                                <label key={index} className={styles.filter_option}>
                                    <input
                                        type="checkbox"
                                        className={styles.checkbox}
                                        checked={selectedFilters?.materials?.includes(material)}
                                        onChange={() => handleFilterChange('materials', material)}
                                        disabled={processingFilter}
                                    />
                                    <span>{material}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {processingFilter && (
                <div className={styles.processing_overlay}>
                    <div className={styles.spinner}></div>
                    <span>Filtering...</span>
                </div>
            )}
        </div>
    );
};

export default FashionInsightFilter; 
