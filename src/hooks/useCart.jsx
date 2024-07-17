import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthProvider';

const useCart = () => {
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem('access-token');

    console.log('user:', user);
    console.log('token:', token);

    // Fetch cart data using react-query
    const { refetch, data: cart = [], isError } = useQuery({
        queryKey: ['carts', user?.email],
        queryFn: async () => {
            try {
                // Ensure user and token are valid before making the request
                if (!user || !user.email || !token) {
                    throw new Error('User or token is invalid');
                }

                const res = await fetch(` https://complete-foodi-server-vjyn.onrender.com/carts?email=${user.email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch cart data');
                }

                const data = await res.json();
                console.log('Fetched cart data:', data); // Log fetched data for debugging

                return data;
            } catch (error) {
                console.error('Error fetching cart data:', error);
                throw new Error('Error fetching cart data');
            }
        },
    });

    console.log('cart:', cart);
    console.log('isError:', isError);

    return [cart, refetch, isError];
};

export default useCart;



