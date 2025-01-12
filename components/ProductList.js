import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from '@/styles/ProductList.module.css';
import FashionInsights from './FashionInsights';
import FashionInsightFilter from './FashionInsightFilter';
import { HeartIcon as HeartIconOutline, ShoppingBagIcon as ShoppingBagIconOutline, CameraIcon } from '@heroicons/react/24/outline';

const ActionButtons = ({ product }) => {
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const likedProducts = JSON.parse(localStorage.getItem('likedProducts') || '[]');
        const isProductLiked = likedProducts.some(p => p.product_id === product.product_id);
        setIsLiked(isProductLiked);
    }, [product.product_id]);

    const handleLike = () => {
        setIsLiked(!isLiked);
        const likedProducts = JSON.parse(localStorage.getItem('likedProducts') || '[]');
        if (!isLiked) {
            likedProducts.push(product);
        } else {
            const index = likedProducts.findIndex(p => p.product_id === product.product_id);
            if (index > -1) likedProducts.splice(index, 1);
        }
        localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
    };

    const handleBuy = () => {
        const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
        purchaseHistory.push({
            ...product,
            purchaseDate: new Date().toISOString()
        });
        localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
        
        if (product.product_url) {
            window.open(product.product_url, '_blank');
        }
    };

    return (
        <div className={styles.card_actions}>
            <button 
                onClick={handleLike}
                className={`${styles.action_button} ${isLiked ? styles.liked : ''}`}
            >
                <HeartIconOutline className={styles.icon} />
            </button>
            <button 
                onClick={handleBuy}
                className={styles.action_button}
            >
                <ShoppingBagIconOutline className={styles.icon} />
            </button>
        </div>
    );
};

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [category, setCategory] = useState('dresses');
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imageErrors, setImageErrors] = useState({});
    const [selectedFilters, setSelectedFilters] = useState({
        trends: [],
        priceRanges: [],
        materials: [],
        colors: [],
        styles: [],
        seasons: [],
        search: ''
    });
    const [filterProcessing, setFilterProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCached, setIsCached] = useState(false);
    const [imageSearchLoading, setImageSearchLoading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchProducts();
        fetchInsights();
    }, [category]);

    useEffect(() => {
        const filtered = filterProducts(products);
        setFilteredProducts(filtered);
    }, [products, selectedFilters]);

    useEffect(() => {
        let pollTimer;
        
        const pollForUpdates = async () => {
            if (!isCached) {
                try {
                    const response = await axios.get(`http://localhost:8000/api/products/${category}`);
                    const newProducts = response.data.products;
                    
                    if (newProducts.length > products.length) {
                        setProducts(newProducts);
                        setFilteredProducts(filterProducts(newProducts));
                    }
                    
                    setIsCached(response.data.extraction_progress.is_cached);
                    
                    if (!response.data.extraction_progress.is_cached) {
                        pollTimer = setTimeout(pollForUpdates, 2000);
                    }
                } catch (error) {
                    console.error('Polling error:', error);
                }
            }
        };

        if (!isCached) {
            pollTimer = setTimeout(pollForUpdates, 2000);
        }

        return () => {
            if (pollTimer) {
                clearTimeout(pollTimer);
            }
        };
    }, [isCached, category, products.length]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8000/api/products/${category}`);
            
            const uniqueProducts = Array.from(
                new Map(response.data.products.map(item => [item.product_id, item])).values()
            );
            
            setProducts(uniqueProducts);
            setFilteredProducts(uniqueProducts);
            setIsCached(response.data.extraction_progress.is_extracting === false);
            
        } catch (err) {
            console.error('Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchInsights = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/insights/${category}`);
            console.log("Insights data:", response.data);
            setInsights(response.data);
        } catch (err) {
            console.error('Error fetching insights:', err);
        }
    };

    const handleFilterChange = async (filterType, value) => {
        setFilterProcessing(true);
        try {
            if (filterType === 'clear') {
                setSelectedFilters({
                    trends: [],
                    priceRanges: [],
                    materials: [],
                    colors: [],
                    styles: [],
                    seasons: [],
                    search: ''
                });
            } else {
                setSelectedFilters(prev => {
                    const newFilters = { ...prev };
                    
                    if (filterType === 'search') {
                        newFilters.search = value;
                    } else if (filterType === 'priceRanges') {
                        const existingIndex = newFilters.priceRanges.findIndex(
                            r => r.min === value.min && r.max === value.max
                        );
                        if (existingIndex === -1) {
                            newFilters.priceRanges = [...newFilters.priceRanges, value];
                        } else {
                            newFilters.priceRanges = newFilters.priceRanges.filter((_, index) => index !== existingIndex);
                        }
                    } else {
                        const index = newFilters[filterType].indexOf(value);
                        if (index === -1) {
                            newFilters[filterType] = [...newFilters[filterType], value];
                        } else {
                            newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
                        }
                    }
                    
                    return newFilters;
                });
            }

            // Simulate async filtering process
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } finally {
            setFilterProcessing(false);
        }
    };

    const filterProducts = (products) => {
        return products.filter(product => {
            // Search filter
            if (selectedFilters.search) {
                const searchTerm = selectedFilters.search.toLowerCase();
                const searchFields = [
                    product.product_name,
                    product.description,
                    product.brand,
                    ...(product.materials || []),
                    ...(product.colors?.map(c => c[0]) || [])
                ].map(field => String(field).toLowerCase());
                
                if (!searchFields.some(field => field.includes(searchTerm))) {
                    return false;
                }
            }

            // Trend filter
            if (selectedFilters.trends.length > 0) {
                if (!selectedFilters.trends.includes(
                    product.ai_insights?.trend_analysis?.trend_status
                )) {
                    return false;
                }
            }

            // Price range filter
            if (selectedFilters.priceRanges.length > 0) {
                const price = product.price;
                const inRange = selectedFilters.priceRanges.some(
                    range => price >= range.min && price <= range.max
                );
                if (!inRange) return false;
            }

            // Color filter
            if (selectedFilters.colors.length > 0) {
                const productColors = product.colors?.map(c => c[0].toLowerCase()) || [];
                if (!selectedFilters.colors.some(color => 
                    productColors.includes(color.toLowerCase())
                )) {
                    return false;
                }
            }

            // Material filter
            if (selectedFilters.materials.length > 0) {
                const productMaterials = product.materials?.map(m => m.toLowerCase()) || [];
                if (!selectedFilters.materials.some(material => 
                    productMaterials.includes(material.toLowerCase())
                )) {
                    return false;
                }
            }

            return true;
        });
    };

    const getImageUrl = (product) => {
        if (!product) return null;
        
        if (product.feature_image) {
            return product.feature_image;
        }
        if (product.feature_image_s3) {
            return product.feature_image_s3;
        }
        return product.image_url;
    };

    const handleImageError = (productId) => {
        setImageErrors(prev => ({
            ...prev,
            [productId]: true
        }));
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setImageSearchLoading(true);
        try {
            const response = await axios.post(
                'http://localhost:8000/api/image-search',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.products) {
                setProducts(response.data.products);
                setFilteredProducts(response.data.products);
            }
        } catch (error) {
            console.error('Image search error:', error);
        } finally {
            setImageSearchLoading(false);
        }
    };

    const triggerImageUpload = () => {
        fileInputRef.current.click();
    };

    const renderProductCard = (product) => {
        const imageUrl = getImageUrl(product);
        const hasError = imageErrors[product.product_id];

        return (
            <div key={product.product_id} className={styles.product_card}>
                <div className={styles.image_container}>
                    {imageUrl && !hasError ? (
                        <img 
                            src={imageUrl}
                            alt={product.product_name}
                            className={styles.product_image}
                            onError={() => handleImageError(product.product_id)}
                            loading="lazy"
                            style={{ 
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                position: 'absolute',
                                top: 0,
                                left: 0
                            }}
                        />
                    ) : (
                        <div className={styles.placeholder_image}>
                            <span>No Image Available</span>
                            {imageUrl && <small>URL: {imageUrl}</small>}
                        </div>
                    )}
                    
                    <ActionButtons product={product} />
                </div>
                
                <div className={styles.card_content}>
                    <h3>{product.product_name}</h3>
                    <div className={styles.tags_container}>
                        <span className={styles.brand_tag}>{product.brand}</span>
                        {product.ai_insights?.trend_analysis?.trend_status && (
                            <span className={`${styles.trend_tag} ${styles[product.ai_insights.trend_analysis.trend_status]}`}>
                                {product.ai_insights.trend_analysis.trend_status}
                            </span>
                        )}
                    </div>

                    <div className={styles.price_trend_container}>
                        <span className={styles.price}>₹{product.price.toLocaleString()}</span>
                        <div className={styles.trend_score}>
                            <div className={styles.trend_circle}
                                 style={{
                                     background: `conic-gradient(#FF4E50 ${product.ai_insights?.trend_analysis?.score || 0}%, #f0f0f0 0)`
                                 }}>
                                <span>{Math.round(product.ai_insights?.trend_analysis?.score || 0)}%</span>
                            </div>
                            <span>Trend Score</span>
                        </div>
                    </div>

                    <div className={styles.features_container}>
                        {(product.colors?.length > 0 || product.materials?.length > 0) && (
                            <div className={styles.features_row}>
                                {product.colors?.length > 0 && (
                                    <div className={styles.feature_box}>
                                        <h4>Colors</h4>
                                        <div className={styles.chips}>
                                            {product.colors.map(([colorName, hexValue], idx) => (
                                                <span key={idx} className={styles.chip}>
                                                    <span 
                                                        className={styles.color_dot}
                                                        style={{backgroundColor: hexValue}}
                                                    />
                                                    {colorName}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {product.materials?.length > 0 && (
                                    <div className={styles.feature_box}>
                                        <h4>Materials</h4>
                                        <div className={styles.chips}>
                                            {product.materials.map((material, idx) => (
                                                <span key={idx} className={styles.chip}>{material}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {(product.style_attributes?.length > 0 || product.patterns?.length > 0) && (
                            <div className={styles.features_row}>
                                {product.style_attributes?.length > 0 && (
                                    <div className={styles.feature_box}>
                                        <h4>Style</h4>
                                        <div className={styles.chips}>
                                            {product.style_attributes.map((style, idx) => (
                                                <span key={idx} className={styles.chip}>{style}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {product.patterns?.length > 0 && (
                                    <div className={styles.feature_box}>
                                        <h4>Pattern</h4>
                                        <div className={styles.chips}>
                                            {product.patterns.map((pattern, idx) => (
                                                <span key={idx} className={styles.chip}>{pattern}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {product.description && (
                        <p className={styles.description}>{product.description}</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Fashion Insights</h1>
                <div className={styles.header_actions}>
                    <button 
                        onClick={triggerImageUpload}
                        className={styles.image_search_button}
                        disabled={imageSearchLoading}
                    >
                        <CameraIcon className={styles.icon} />
                        {imageSearchLoading ? 'Searching...' : 'Search by Image'}
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className={styles.hidden_input}
                    />
                    <select 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                        className={styles.category_selector}
                    >
                        <option value="dresses">Dresses</option>
                        <option value="earrings">Earrings</option>
                        <option value="jeans">Jeans</option>
                        <option value="sarees">Sarees</option>
                        <option value="shirts">Shirts</option>
                        <option value="sneakers">Sneakers</option>
                        <option value="tshirts">T-shirts</option>
                    </select>
                </div>
            </div>

            <FashionInsightFilter
                insights={insights}
                onFilterChange={handleFilterChange}
                selectedFilters={selectedFilters}
                loading={loading || filterProcessing}
            />

            <div className={styles.product_grid}>
                {filteredProducts.map(product => renderProductCard(product))}
            </div>

            {loading && (
                <div className={styles.loading_overlay}>
                    <div className={styles.loading_spinner}></div>
                </div>
            )}
        </div>
    );
};

export default ProductList;