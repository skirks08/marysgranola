import Stripe from 'stripe';

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not Allowed' });
    }

    const stripe =  new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-03-31',
    });

    const { cart } = JSON.parse(req.body);

    // Map cart IDs to Stripe Price IDs
    const priceMap = {
        'honey-almond': 'price_abc123', // replace with real price ids
        // ...
    };

    const line_items = Object.entries(cart).map(([id, qty]) => ({
        price: priceMap[id],
        quantity: qty,
    }));

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items,
            success_url: `${process.env.URL}/success.html`,
            cancel_url: `${process.env.URL}/cart.html`,
        });
        return res.status(200).json({ url: session.url });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Stripe error' });
    }
};