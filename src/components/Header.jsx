import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaShoppingCart,
  FaSearch,
  FaRegHeart,
  FaClipboardList,
} from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(3);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const collectionsRef = useRef(null);
  const pagesRef = useRef(null);
  const profileRef = useRef(null);
  const sidebarRef = useRef(null);

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

  const handleDropdownToggle =
    (setter, otherSetters = []) =>
    () => {
      setter((prev) => {
        if (!prev) {
          otherSetters.forEach((set) => set(false));
        }
        return !prev;
      });
    };

  const handleClickOutside = (event) => {
    if (
      collectionsRef.current &&
      !collectionsRef.current.contains(event.target) &&
      isCollectionsOpen
    ) {
      setIsCollectionsOpen(false);
    }
    if (
      pagesRef.current &&
      !pagesRef.current.contains(event.target) &&
      isPagesOpen
    ) {
      setIsPagesOpen(false);
    }
    if (
      profileRef.current &&
      !profileRef.current.contains(event.target) &&
      isProfileMenuOpen
    ) {
      setIsProfileMenuOpen(false);
    }
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCollectionsOpen, isPagesOpen, isProfileMenuOpen]);

  const handleSearch = () => {
    if (searchTerm) {
      navigate(`/search?query=${searchTerm}`); // Navigate using useNavigate
    }
  };

  return (
    <header className="bg-black text-white shadow-lg py-6 sticky top-0 z-50 border-b-2 border-white">
      {/* Desktop Header */}
      <div className="container mx-auto hidden md:flex justify-between items-center px-8">
        {/* Left Section */}
        <div className="flex items-center space-x-12">
          {/* Logo */}
          <div className="text-3xl font-extrabold tracking-wider">
            <Link to="/" className="hover:text-gray-400">
              ABSTORE
            </Link>
          </div>

          {/* Collections */}
          <div ref={collectionsRef} className="relative group">
            <button
              onClick={handleDropdownToggle(setIsCollectionsOpen, [
                setIsPagesOpen,
                setIsProfileMenuOpen,
              ])}
              className="hover:text-gray-400 flex items-center text-lg border-b-2 border-transparent hover:border-white transition-all duration-300 ease-in-out"
            >
              Collections <IoIosArrowDown className="ml-1" />
            </button>
            {isCollectionsOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 bg-gray-800 text-white shadow-lg border-t-2 border-white group-hover:block">
                <ul>
                  {categories.map((category) => (
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
            )}
          </div>

          {/* Pages */}
          <div ref={pagesRef} className="relative group">
            <button
              onClick={handleDropdownToggle(setIsPagesOpen, [
                setIsCollectionsOpen,
                setIsProfileMenuOpen,
              ])}
              className="hover:text-gray-400 flex items-center text-lg border-b-2 border-transparent hover:border-white transition-all duration-300 ease-in-out"
            >
              Pages <IoIosArrowDown className="ml-1" />
            </button>
            {isPagesOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 bg-gray-800 text-white shadow-lg border-t-2 border-white group-hover:block">
                <ul>
                  <li>
                    <Link
                      to="/home"
                      className="block px-4 py-2 hover:bg-gray-600 transition-all duration-300 ease-in-out"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="block px-4 py-2 hover:bg-gray-600 transition-all duration-300 ease-in-out"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="block px-4 py-2 hover:bg-gray-600 transition-all duration-300 ease-in-out"
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* All Products */}
          <div>
            <Link
              to="/products"
              className="hover:text-gray-400 text-lg border-b-2 border-transparent hover:border-white transition-all duration-300 ease-in-out"
            >
              All Products
            </Link>
          </div>
        </div>

        {/* Center Section - Search Bar */}
        <div className="flex-grow mx-8 relative">
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-3 rounded-full text-gray-800 pr-16 bg-gray-200 focus:bg-white focus:outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
            />
            <div
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white rounded-full p-2 flex items-center justify-center
            "
              onClick={handleSearch}
            >
              <FaSearch className="w-5 h-5 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-8">
          {/* Favorites Icon */}
          <Link to="/favorites" className="hover:text-gray-400">
            <FaRegHeart className="w-7 h-7" />
          </Link>

          {/* Profile Icon */}
          <div ref={profileRef} className="relative group">
            <button
              onClick={handleDropdownToggle(setIsProfileMenuOpen, [
                setIsCollectionsOpen,
                setIsPagesOpen,
              ])}
              className="hover:text-gray-400"
            >
              <FaUserCircle className="w-7 h-7" />
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white shadow-lg rounded-lg group-hover:block">
                <ul>
                  <li>
                    <Link
                      to="/register"
                      className="block px-4 py-2 hover:bg-gray-600 rounded-t-lg"
                    >
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-gray-600 rounded-b-lg"
                    >
                      Login
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Order Icon */}
          <Link to="/orders" className="hover:text-gray-400">
            <FaClipboardList className="w-7 h-7" /> {/* Order icon */}
          </Link>

          {/* Cart Icon with Quantity */}
          <Link to="/cart" className="relative hover:text-gray-400">
            <FaShoppingCart className="w-7 h-7" />
            {cartQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartQuantity}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div className="text-2xl font-extrabold tracking-wider">
          <Link to="/" className="hover:text-gray-400">
            ABSTORE
          </Link>
        </div>
        {/* Hamburger Menu */}
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <FaBars className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-0 bg-black text-white transform transition-transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setIsSidebarOpen(false)}>
            <FaTimes className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {/* Search Bar in Sidebar */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-3 rounded-full text-gray-800 pr-12 bg-gray-200 focus:bg-white focus:outline-none"
                placeholder="Search products..."
              />
            </div>
            <button className="mt-3 w-full py-3 bg-white text-black rounded-full hover:bg-gray-200 border-2 border-white">
              Search
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            <div className="relative group">
              <button className="block w-full text-left text-lg font-medium hover:text-gray-400 border-b-2 border-transparent hover:border-white">
                Collections
              </button>
              <div className="mt-2 bg-gray-800 text-white rounded-lg group-hover:block">
                <ul>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        to={`/products?category=${category.name}`}
                        className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded transition duration-300 ease-in-out"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="relative group">
              <button className="block w-full text-left text-lg font-medium hover:text-gray-400 border-b-2 border-transparent hover:border-white">
                Pages
              </button>
              <div className="mt-2 bg-gray-800 text-white rounded-lg group-hover:block">
                <ul>
                  <li>
                    <Link
                      to="/home"
                      className="block px-4 py-2 hover:bg-gray-600 transition-all duration-300 ease-in-out"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="block px-4 py-2 hover:bg-gray-600 transition-all duration-300 ease-in-out"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="block px-4 py-2 hover:bg-gray-600 transition-all duration-300 ease-in-out"
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            {/* All Products */}
            <div>
              <Link
                to="/products"
                className="hover:text-gray-400 block text-lg font-medium border-b-2 border-transparent hover:border-white"
              >
                All Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
