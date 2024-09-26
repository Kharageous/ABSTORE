import React, { useState, useEffect } from "react";
import { Header, Footer, ProductCard } from "../components";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import axios from "axios";
import HeroVid from "../assets/videos/HeroVid.mp4";
import living from "../assets/living.jpg";

const Home = () => {
  const { ref: heroRef, inView: heroInView } = useInView();
  const { ref: prodRef, inView: prodInView } = useInView();
  const { ref: saleRef, inView: saleInView } = useInView();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/products?limit=4`
        ); // Fetch only 4 products
        setProducts(response.data);
      } catch (err) {
        setError("Failed to fetch products.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative h-screen flex items-center justify-center overflow-hidden bg-black text-white"
        >
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            style={{
              zIndex: 1,
              objectFit: "cover",
              width: "100vw",
              height: "100vh",
              maxHeight: "100vh", // Ensures proper scaling on mobile
            }}
          >
            <source src={HeroVid} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            style={{ zIndex: 0 }}
          />
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : -50 }}
            transition={{ duration: 1 }}
            className="relative z-10 text-center px-4 py-8 md:px-6 md:py-12 bg-black bg-opacity-50 rounded-lg"
          >
            <h1 className="text-3xl md:text-6xl font-bold mb-4">
              Welcome to Our Store
            </h1>
            <p className="text-md md:text-xl mb-8">
              Discover exclusive products and deals just for you.
            </p>
            <Link
              to="/shop"
              className="bg-yellow-500 text-black py-2 px-4 md:py-3 md:px-6 rounded-full font-semibold hover:bg-yellow-600 transition-colors"
            >
              Shop Now
            </Link>
          </motion.div>
        </section>

        {/* Featured Products Section */}
        <section ref={prodRef} className="py-12 bg-gray-100">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: prodInView ? 1 : 0, y: prodInView ? 0 : 50 }}
            transition={{ duration: 1 }}
            className="container mx-auto px-4"
          >
            <h2 className="text-4xl font-bold text-center mb-12">
              Featured Products
            </h2>
            {loading ? (
              <p className="text-center">Loading products...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : products.length > 0 ? (
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8`}
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-center">No products available.</p>
            )}
          </motion.div>
        </section>

        {/* Promotional Banner Section */}
        <section
          ref={saleRef}
          className="relative bg-yellow-500 text-white py-20 overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${living})`,
              backgroundSize: "cover", // Ensures the image covers the section
              backgroundPosition: "center center", // Centers the image
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: saleInView ? 1 : 0,
              scale: saleInView ? 1 : 0.9,
            }}
            transition={{ duration: 1 }}
            className="relative z-10 flex items-center justify-center h-full"
          >
            <div className="text-center px-6 py-12 bg-black bg-opacity-50 rounded-lg">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Summer Sale - Up to 50% Off!
              </h2>
              <p className="text-lg mb-8">
                Don’t miss out on our biggest sale of the year. Shop now and
                save big!
              </p>
              <Link
                to="/sale"
                className="bg-black text-white py-4 px-8 rounded-full font-semibold hover:bg-gray-800 transition-colors"
              >
                Shop the Sale
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Newsletter Signup Section */}
        <section className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg mb-8">
              Sign up for our newsletter to get the latest updates and exclusive
              offers.
            </p>
            <form className="flex flex-col sm:flex-row justify-center items-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="p-3 rounded-l-lg w-full sm:w-64 mb-4 sm:mb-0"
              />
              <button
                type="submit"
                className="bg-yellow-500 text-black py-3 px-6 rounded-r-lg font-semibold hover:bg-yellow-600 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
