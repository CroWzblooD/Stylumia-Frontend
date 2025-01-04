import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { amount, currency, receipt } = req.body;

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
    });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
} 