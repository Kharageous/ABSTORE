import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/categories"
        );
        setCategories(response.data);
      } catch (err) {
        setError("Failed to fetch categories.");
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  return (
    <footer className="bg-black text-white py-8 z-20">
      <div className="container mx-auto px-4 md:px-8 ">
        {/* Footer Links Section */}
        <div className="flex flex-wrap justify-center md:justify-between mb-8">
          <div className="w-full md:w-1/2 lg:w-1/4 mb-6 md:mb-0 text-center md:text-left">
            <h4 className="text-2xl font-semibold mb-4">Company</h4>
            <ul>
              <li>
                <Link
                  to="/home"
                  className="block hover:text-gray-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="block hover:text-gray-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="block hover:text-gray-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/4 mb-6 md:mb-0 text-center md:text-left">
            <h4 className="text-2xl font-semibold mb-4">Collections</h4>
            <ul>
              {categories.slice(0, 3).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/products?category=${category.name}`}
                    className="flex items-center px-4  text-gray-300 hover:bg-gray-700 rounded transition duration-300 ease-in-out"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/4 mb-6 md:mb-0 text-center md:text-left">
            <h4 className="text-2xl font-semibold mb-4">Quick Links</h4>
            <ul>
              <li>
                <Link
                  to="/home"
                  className="block hover:text-gray-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="block hover:text-gray-400 transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/signin"
                  className="block hover:text-gray-400 transition-colors"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/4 mb-6 md:mb-0 text-center">
            <h4 className="text-2xl font-semibold mb-4">Follow Us</h4>
            <div className="flex justify-center space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-300 transition-colors transform hover:scale-110"
              >
                <FaFacebookF className="w-8 h-8" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-300 transition-colors transform hover:scale-110"
              >
                <FaTwitter className="w-8 h-8" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-300 transition-colors transform hover:scale-110"
              >
                <FaInstagram className="w-8 h-8" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-300 transition-colors transform hover:scale-110"
              >
                <FaLinkedinIn className="w-8 h-8" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="border-t border-gray-700 pt-6 mt-6 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} ABSTORE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
