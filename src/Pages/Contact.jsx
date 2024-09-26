import React from "react";
import { motion } from "framer-motion";
import { Header, Footer } from "../components";

const Contact = () => {
  return (
    <div>
      <Header />
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl p-6">
          <motion.div
            className="bg-white bg-opacity-10 backdrop-blur-md border border-gray-300 rounded-lg shadow-lg p-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-6 text-center text-white">
              Contact Us
            </h1>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300"
                >
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm p-3 bg-transparent text-white focus:ring-red-500 focus:border-red-500 transition duration-200"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300"
                >
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm p-3 bg-transparent text-white focus:ring-red-500 focus:border-red-500 transition duration-200"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-300"
                >
                  Message:
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm p-3 bg-transparent text-white focus:ring-red-500 focus:border-red-500 transition duration-200"
                  rows="5"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 transition duration-200 ease-in-out transform hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </motion.div>

          <motion.div
            className="bg-white bg-opacity-10 backdrop-blur-md border border-gray-300 rounded-lg shadow-lg p-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-white">
              Contact Information
            </h2>
            <p className="text-gray-300 mb-2">
              <strong>Email:</strong> arthurcourageous@gmail.com
            </p>
            <p className="text-gray-300 mb-2">
              <strong>Phone:</strong> +86 132-16001172
            </p>
            <p className="text-gray-300 mb-2">
              <strong>Location:</strong> Wenzhou Zhejiang Province, China
            </p>
            <p className="text-gray-300 mb-4">
              Feel free to reach out via email or phone for any inquiries!
            </p>

            <h3 className="text-xl font-bold mb-2 text-white">
              Contact Support
            </h3>
            <p className="text-gray-300 mb-2">
              <strong>Email:</strong> support@example.com
            </p>
            <p className="text-gray-300 mb-4">
              For any technical issues or assistance.
            </p>

            <h3 className="text-xl font-bold mb-2 text-white">
              Sales Inquiries
            </h3>
            <p className="text-gray-300 mb-2">
              <strong>Email:</strong> sales@example.com
            </p>
            <p className="text-gray-300">
              For questions about pricing and services.
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
