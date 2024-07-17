import React from "react";
import useAuth from '../../hooks/useAuth'
import { useQuery } from "@tanstack/react-query";
const Order = () => {
  const {user}=useAuth;
  const token=localStorage.getItem('access-token')
  const { refetch, data: orders = [], isError } = useQuery({
        queryKey: ['orders', user?.email],
        queryFn: async () => {
            try {
                // Ensure user and token are valid before making the request
                if (!user || !user.email || !token) {
                    throw new Error('User or token is invalid');
                }

                const res = await fetch(` https://complete-foodi-server-whx8.onrender.com/payments?email=${user.email}`, {
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
   const formatDate=(createdAt)=>{
     const createdAtDate=new Date(createdAt)
     return createdAtDate.toLocaleDateString()
   }
  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <div className=" bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
        <div className="py-28 flex flex-col items-center justify-center">
          <div className="text-center px-4 space-y-7">
            <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
              Track all your<span className="text-green"> Orders</span>
            </h2>
          </div>
        </div>
      </div>
      <div>
        {orders.length > 0 ? (
          <div>
            <div className="">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead className="bg-green text-white rounded-sm">
                    <tr>
                      <th>#</th>
                      <th>Order Date</th>
                      <th>Transaction id</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="font-medium">{item.transactionId}</td>
                        <td>
                          ${item.price}
                        </td>
                        <td>{item.status}</td>
                        <td>
                          <Link to='/contact'
                            className="btn btn-sm border-none text-red bg-transparent">
                            Contact
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <hr />
            <div className="flex flex-col md:flex-row justify-between items-start my-12 gap-8">
              <div className="md:w-1/2 space-y-3">
                <h3 className="text-lg font-semibold">Customer Details</h3>
                <p>Name: {user?.displayName || "None"}</p>
                <p>Email: {user?.email}</p>
                <p>
                  User_id: <span className="text-sm">{user?.uid}</span>
                </p>
              </div>
              <div className="md:w-1/2 space-y-3">
                <h3 className="text-lg font-semibold">Shopping Details</h3>
                <p>Total Items: {cart.length}</p>
                <p>
                  Total Price:{" "}
                  <span id="total-price">${orderTotal.toFixed(2)}</span>
                </p>
                <Link to="process-checkout">
                  <button className="btn btn-md bg-green text-white px-8 py-1">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mt-20">
            <p>Cart is empty. Please add products.</p>
            <Link to="/menu">
              <button className="btn bg-green text-white mt-3">
                Back to Menu
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
