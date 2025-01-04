'use client';
import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export function useGemini() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateSuggestion = async (prompt) => {
    try {
      setLoading(true);
      setError(null);
      
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateSuggestion,
    loading,
    error
  };
} 