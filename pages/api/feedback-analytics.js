export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { timeRange } = JSON.parse(req.body);

    // Mock data - replace with actual database queries
    const mockData = {
      feedbackMetrics: {
        totalFeedback: 245,
        positiveRate: 78,
        negativeRate: 22,
        topPreferences: [
          { style: 'Casual Chic', count: 45 },
          { style: 'Minimalist', count: 38 },
          { style: 'Bohemian', count: 27 },
          { style: 'Streetwear', count: 22 },
          { style: 'Business Casual', count: 18 }
        ],
        avoidedStyles: [
          { style: 'Neon Colors', count: 15 },
          { style: 'Animal Prints', count: 12 },
          { style: 'Oversized', count: 8 },
          { style: 'Ultra Formal', count: 7 },
          { style: 'Crop Tops', count: 5 }
        ],
        styleAlignment: 85
      },
      trendData: generateTrendData(timeRange),
      categoryBreakdown: {
        labels: ['Color Preferences', 'Style Fit', 'Size & Fit', 'Price Range', 'Quality'],
        data: [35, 25, 20, 15, 5]
      }
    };

    return res.status(200).json(mockData);
  } catch (error) {
    console.error('Feedback analytics error:', error);
    return res.status(500).json({ message: 'Error processing feedback analytics' });
  }
}

function generateTrendData(timeRange) {
  const days = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30;
  const labels = [];
  const positiveData = [];
  const matchData = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    labels.push(timeRange === '24h' 
      ? date.toLocaleTimeString([], { hour: '2-digit' })
      : date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    );
    
    positiveData.push(Math.floor(Math.random() * 30) + 60); // 60-90 range
    matchData.push(Math.floor(Math.random() * 25) + 70); // 70-95 range
  }

  return {
    labels,
    datasets: [
      {
        label: 'Positive Feedback',
        data: positiveData,
        borderColor: '#22C55E',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true
      },
      {
        label: 'Style Matches',
        data: matchData,
        borderColor: '#FF6B35',
        fill: false
      }
    ]
  };
} 