import React from "react";
import bg from "../assets/bg.jpeg";

const Dashboard = () => {
  return (
    <div
      className="w-full h-full p-6 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="bg-black bg-opacity-60 p-8 rounded-lg">
        {/* Welcome Message */}
        <h1 className="text-4xl font-bold text-white mb-6">
          Welcome to the Dashboard
        </h1>
        <p className="text-lg text-white mb-8">
          Here you can manage your products, orders, and users. Explore the
          various sections to get insights and manage your platform effectively.
        </p>

        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
            <h2 className="text-2xl font-semibold mb-2">Total Products</h2>
            <p className="text-xl">150</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
            <h2 className="text-2xl font-semibold mb-2">Total Orders</h2>
            <p className="text-xl">230</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
            <h2 className="text-2xl font-semibold mb-2">Total Users</h2>
            <p className="text-xl">1200</p>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
          <h2 className="text-2xl font-semibold mb-4">Sales Statistics</h2>
          <p className="text-lg mb-2">Total Sales: $12,345</p>
          <p className="text-lg mb-2">Monthly Sales: $1,234</p>
          <p className="text-lg">Annual Growth: 15%</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
