import formidable from 'formidable';
import fs from 'fs/promises';
import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = formidable({});
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const sambanovaKey = process.env.SAMBANOVA_API_KEY;
    if (!sambanovaKey) {
      return res.status(400).json({ message: 'Missing Sambanova API key' });
    }

    let messages = [];
    
    // Handle image if present
    if (files.image && files.image[0]) {
      const imageFile = files.image[0];
      const imageBuffer = await fs.readFile(imageFile.filepath);
      const imageBase64 = imageBuffer.toString('base64');
      
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: fields.message?.[0] || "What do you see in this image? Please provide fashion advice."
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${imageFile.mimetype};base64,${imageBase64}`
            }
          }
        ]
      });
    } else {
      // Text-only message
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: fields.message?.[0] || ""
          }
        ]
      });
    }

    const response = await fetch('https://api.sambanova.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sambanovaKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'Llama-3.2-90B-Vision-Instruct',
        messages: messages,
        temperature: 0.1,
        top_p: 0.1
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Sambanova API error: ${error}`);
    }

    const data = await response.json();
    res.status(200).json({ response: data.choices[0].message.content });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
} 