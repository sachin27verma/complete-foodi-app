import React from 'react';
import CheckoutForm from './CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import useCart from '../../hooks/useCart';

const Payment = () => {
    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);
    const [cart] = useCart();

    // Calculate prices
    const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
    const totalPrice = parseFloat(cartTotal.toFixed(2));

    return (
        <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-28">
            <Elements stripe={stripePromise}>
                <CheckoutForm cart={cart} price={totalPrice} />
            </Elements>
        </div>
    );
};

export default Payment;
