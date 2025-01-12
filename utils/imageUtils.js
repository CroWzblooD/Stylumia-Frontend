export const validateImageUrl = (url) => {
    if (!url) return false;
    
    // Check if URL is valid
    try {
        new URL(url);
    } catch {
        return false;
    }

    // Check if URL points to an image
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
}; 