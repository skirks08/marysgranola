import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { cart } = JSON.parse(event.body);

    const priceMap = {
        "honey-almond": 899,
    }

    const lineItems = Object.entries(cart).map(([id, qty]) => ({
        price: priceMap[id],
        quantity: qty,
    }));

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: lineItems,
            success_url: `${process.env.URL}/success.html`,
            cancel_url: `${process.env.URL}/cart.html`,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ url: session.url }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};