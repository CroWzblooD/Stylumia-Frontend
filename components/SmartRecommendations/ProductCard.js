import React from 'react';
import styles from '../../styles/ProductCard.module.css';
import { Heart, ShoppingBag } from 'react-feather';

export default function ProductCard({ 
    product, 
    onLike, 
    onBuy, 
    isLiked,
    isPurchased 
}) {
    return (
        <div className={styles.card}>
            <div className={styles.image_container}>
                <img 
                    src={product.image_url} 
                    alt={product.name}
                    className={styles.product_image}
                />
                <div className={styles.actions}>
                    <button 
                        onClick={() => onLike(product)}
                        className={`${styles.action_button} ${isLiked ? styles.liked : ''}`}
                        disabled={isLiked}
                    >
                        <Heart />
                    </button>
                    <button 
                        onClick={() => onBuy(product)}
                        className={`${styles.action_button} ${isPurchased ? styles.purchased : ''}`}
                        disabled={isPurchased}
                    >
                        <ShoppingBag />
                    </button>
                </div>
            </div>

            <div className={styles.product_info}>
                <h3>{product.name}</h3>
                <p className={styles.brand}>{product.brand}</p>
                <p className={styles.price}>₹{product.price}</p>
                
                <div className={styles.tags}>
                    {product.style && (
                        <span className={styles.tag}>{product.style}</span>
                    )}
                    {product.materials?.map((material, index) => (
                        <span key={index} className={styles.tag}>{material}</span>
                    ))}
                </div>
            </div>
        </div>
    );
} 