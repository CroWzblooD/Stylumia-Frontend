export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { likedProducts, purchaseHistory } = req.body;
        
        // Debug log
        console.log('Sending to backend:', {
            liked_products: likedProducts,
            purchase_history: purchaseHistory || []
        });

        // Call the backend recommendation engine API
        const response = await fetch('http://localhost:8000/api/recommendations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                liked_products: likedProducts.map(product => ({
                    product_id: product.product_id || '',
                    category_name: product.category || '',
                    brand: product.brand || '',
                    style_attributes: product.style || '',
                    material_composition: Array.isArray(product.materials) ? product.materials.join(', ') : '',
                    color: product.color || '',
                    mrp: product.price || 0,
                    product_name: product.product_name || '',
                    image_url: product.image_url || ''
                })),
                purchase_history: (purchaseHistory || []).map(product => ({
                    product_id: product.product_id || '',
                    category_name: product.category || '',
                    brand: product.brand || '',
                    style_attributes: product.style || '',
                    material_composition: Array.isArray(product.materials) ? product.materials.join(', ') : '',
                    color: product.color || '',
                    mrp: product.price || 0,
                    product_name: product.product_name || '',
                    image_url: product.image_url || ''
                }))
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Backend API error:', errorData);
            throw new Error(`Backend API error: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();

        // Transform backend response to match frontend format
        const recommendations = data.recommendations.map(product => ({
            product_id: product.product_id,
            product_name: product.product_name,
            price: parseFloat(product.mrp || '0'),
            image_url: product.feature_image || product.image_url,
            website_url: `https://www.myntra.com/${product.category_name}/${product.product_id}`,
            brand: product.brand || 'Unknown',
            category: product.category_name,
            materials: (product.material || '').split(',').map(m => m.trim()).filter(Boolean),
            style: product.style_attributes,
            description: product.description,
            similarity_score: product.similarity_score,
            color: product.color
        }));

        console.log(`Returning ${recommendations.length} recommendations`);
        const categoryCounts = recommendations.reduce((acc, rec) => {
            acc[rec.category] = (acc[rec.category] || 0) + 1;
            return acc;
        }, {});
        console.log('Recommendations per category:', categoryCounts);

        return res.status(200).json({
            recommendations,
            totalProcessed: data.total || recommendations.length,
            categoryDistribution: categoryCounts
        });

    } catch (error) {
        console.error('Error in recommendation process:', error);
        return res.status(500).json({ 
            message: 'Error processing recommendations',
            error: error.message 
        });
    }
} 