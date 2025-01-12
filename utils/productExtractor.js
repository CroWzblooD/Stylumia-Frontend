export const extractProductInfo = (rawProduct) => {
    try {
        console.log('Raw Product Data:', rawProduct);
        
        return {
            product_id: rawProduct.product_id || rawProduct.id,
            product_name: rawProduct.product_name || rawProduct.title || 'Untitled Product',
            brand: rawProduct.brand_name || rawProduct.brand || 'Generic',
            category_name: rawProduct.category_name || rawProduct.category || 'Uncategorized',
            mrp: rawProduct.mrp || rawProduct.price || '0.00',
            feature_image: rawProduct.image_url || 
                          rawProduct.product_image ||
                          rawProduct.image || 
                          '/no-image.png',
            description: rawProduct.product_details || rawProduct.description || '',
            material: rawProduct.material_composition || rawProduct.material || '',
            style_attributes: rawProduct.style_attributes || '',
            color: rawProduct.dominant_color || rawProduct.color || '',
            meta_info: {
                occasion: rawProduct.occasion || '',
                pattern: rawProduct.pattern_type || rawProduct.pattern || '',
                sleeve_length: rawProduct.sleeve_length || '',
                neck: rawProduct.neck_type || rawProduct.neck || '',
                fit: rawProduct.fit_type || rawProduct.fit || ''
            }
        };
    } catch (error) {
        console.error('Error extracting product info:', error);
        return null;
    }
}; 