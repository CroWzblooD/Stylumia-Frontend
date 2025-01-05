const AZURE_ENDPOINT = process.env.NEXT_PUBLIC_AZURE_VISION_ENDPOINT?.replace(/\/$/, '');
const AZURE_API_KEY = process.env.NEXT_PUBLIC_AZURE_VISION_KEY;

export async function analyzeImageWithAzure(imageFile) {
  try {
    if (!AZURE_ENDPOINT || !AZURE_API_KEY) {
      throw new Error('Azure Vision credentials are not configured');
    }

    const response = await fetch(`${AZURE_ENDPOINT}/vision/v3.2/analyze?visualFeatures=Objects,Color,Description`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': AZURE_API_KEY
      },
      body: imageFile
    });

    if (!response.ok) {
      throw new Error(`Azure API responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Azure Vision API Error:', error);
    throw error;
  }
}

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}; 