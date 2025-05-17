import React, { useEffect, useState } from "react";
import { useAppContext } from "../../Context/AppContext";
import { assets, dummyOrders } from "../../assets/assets";

const Orders = () => {
  const { currency } = useAppContext();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    setOrders(dummyOrders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll bg-gray-50">
      <div className="md:p-10 p-4 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Orders List</h2>

        {orders.map((order, index) => (
          <div
            key={index}
            className="bg-white hover:shadow-lg transition-shadow rounded-xl border border-gray-200 p-6 space-y-4 max-w-5xl mx-auto"
          >
            {/* Order Items */}
            <div className="flex flex-wrap gap-6 items-start">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2 bg-gray-50 p-3 rounded-lg w-28 shadow-sm border border-primary"
                >
                  <img
                    src={item.product.image[0]}
                    alt=""
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <p className="text-center text-sm font-medium text-gray-700">
                    {item.product.name}
                    <span className="block text-primary text-xs">x {item.quantity}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Order Info */}
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              {/* Shipping */}
              <div>
                <p className="font-semibold text-gray-800 mb-1">Shipping Info</p>
                <p>{order.address.firstName} {order.address.lastName}</p>
                <p>{order.address.street}, {order.address.city}</p>
                <p>{order.address.state}, {order.address.zipcode}, {order.address.country}</p>
                <p>{order.address.phone}</p>
              </div>

              {/* Payment Info */}
              <div>
                <p className="font-semibold text-gray-800 mb-1">Payment Details</p>
                <p>Method: {order.paymentType}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>Status: 
                  <span className={`ml-1 font-medium ${order.isPaid ? 'text-green-600' : 'text-red-500'}`}>
                    {order.isPaid ? 'Paid' : 'Pending'}
                  </span>
                </p>
              </div>

              {/* Total */}
              <div className="flex flex-col justify-center items-start md:items-end">
                <p className="text-lg font-bold text-gray-800">
                  Total: {currency}{order.amount}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
