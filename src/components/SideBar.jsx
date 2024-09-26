import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faTags } from "@fortawesome/free-solid-svg-icons";

const SideBar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleLinkClick = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading categories...</div>;
  }

  if (error) {
    return <div className="p-4 text-center">{error}</div>;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 bg-black p-4 border-r border-gray-700 overflow-y-auto transform"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ height: "90vh", zIndex: 20 }}
    >
      <ul className="space-y-2">
        <li>
          <Link
            to="/products"
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded transition duration-300 ease-in-out"
            onClick={handleLinkClick}
          >
            <FontAwesomeIcon icon={faHome} className="h-6 w-6 mr-2" />
            All Products
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              to={`/products?category=${category.name}`}
              className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded transition duration-300 ease-in-out"
              onClick={handleLinkClick}
            >
              <FontAwesomeIcon icon={faTags} className="h-6 w-6 mr-2" />
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default SideBar;
