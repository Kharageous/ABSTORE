import React, { useEffect, useState } from "react";
import { Header, Footer } from "../components/index";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/products/${productId}`
        );
        setProduct(response.data);
        setReviews(response.data.reviews || []);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Could not fetch product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!product) return <div className="text-center">Product not found.</div>;

  const {
    name = "",
    price = "",
    quantity = 0,
    description = "",
    images = [],
    categories = [],
  } = product || {};

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (newReview && newRating) {
      const reviewData = { rating: newRating, review: newReview };
      setReviews([...reviews, reviewData]);
      setNewReview("");
      setNewRating(0);
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
    twitter: `https://twitter.com/intent/tweet?url=${window.location.href}&text=Check out this product!`,
    instagram: `https://www.instagram.com/?url=${window.location.href}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`,
    whatsapp: `https://wa.me/?text=Check out this product! ${window.location.href}`,
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen flex items-center justify-center ">
        <div className="w-full max-w-5xl bg-black bg-opacity-50 border border-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
          <h1 className="text-3xl font-bold text-center mb-4 text-white">
            {name}
          </h1>

          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="flex flex-col items-center mb-4 md:w-1/2">
              {images.length > 0 && (
                <img
                  src={`http://localhost:3000/${images[0].replace(/\\/g, "/")}`}
                  alt={name}
                  className="w-full h-auto object-contain rounded-md shadow-lg mb-4"
                  style={{ maxHeight: "90vh" }}
                />
              )}
              <div className="mt-2 flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="w-16 h-16 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer"
                    onClick={() =>
                      window.open(
                        `http://localhost:3000/${image.replace(/\\/g, "/")}`
                      )
                    }
                  >
                    <img
                      src={`http://localhost:3000/${image.replace(/\\/g, "/")}`}
                      alt={`Product variant ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="md:w-1/2 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2 text-white">
                  Description
                </h2>
                <p className="text-gray-300 mb-4">{description}</p>
                <h3 className="text-lg font-bold text-red-600 mb-2">
                  ${price}
                </h3>
                <p className="text-lg text-white mb-2">
                  Available Quantity: {quantity}
                </p>
              </div>

              {/* Categories Section moved here */}
              {categories.length > 0 && (
                <div className="mb-4 text-center">
                  <h2 className="text-xl font-semibold text-white">
                    Categories
                  </h2>
                  <div className="flex justify-center space-x-2 mb-4">
                    {categories.map((category, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 text-white px-3 py-1 rounded-md"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row md:space-x-4">
                <button className="mt-4 w-full md:w-1/2 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-300">
                  Add to Cart
                </button>
                <button className="mt-4 w-full md:w-1/2 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-300">
                  Chat Supplier
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2 text-white">
              Customer Reviews
            </h2>
            <div className="border-t border-gray-300 pt-4">
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <p key={index} className="text-gray-300">
                    ★{"★".repeat(review.rating - 1)}
                    {"☆".repeat(5 - review.rating)} - {review.review}
                  </p>
                ))
              ) : (
                <p className="text-gray-300">No reviews yet.</p>
              )}
            </div>
          </div>

          <form onSubmit={handleReviewSubmit} className="mt-6">
            <h2 className="text-xl font-semibold mb-2 text-white">
              Write a Review
            </h2>
            <div className="flex flex-col mb-4">
              <label className="text-white">Rating:</label>
              <select
                value={newRating}
                onChange={(e) => setNewRating(parseInt(e.target.value))}
                className="bg-gray-700 text-white p-2 rounded-md"
              >
                <option value={0}>Select Rating</option>
                {[1, 2, 3, 4, 5].map((star) => (
                  <option key={star} value={star}>
                    {star}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-white">Review:</label>
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded-md"
                rows="4"
              />
            </div>
            <button
              type="submit"
              className="bg-red-600 text-white py-2 px-2 rounded-md hover:bg-red-700 transition duration-300"
            >
              Submit Review
            </button>
          </form>

          <div className="mt-6 flex justify-center space-x-4">
            {Object.entries(shareLinks).map(([key, link]) => (
              <a
                key={key}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-500 transition duration-300"
              >
                {React.createElement(
                  {
                    facebook: FaFacebook,
                    twitter: FaTwitter,
                    instagram: FaInstagram,
                    linkedin: FaLinkedin,
                    whatsapp: FaWhatsapp,
                  }[key],
                  { className: "text-2xl" }
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;
