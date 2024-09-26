import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import {
  FaHeart,
  FaRegHeart,
  FaShareAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaWhatsapp,
  FaWeixin,
  FaTelegramPlane,
  FaShare,
} from "react-icons/fa";

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!product) return null;

  const {
    id, // Add product id
    name = "",
    images = [],
    price = "",
    quantity = "",
    description = "",
  } = product;

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
    twitter: `https://twitter.com/intent/tweet?url=${window.location.href}&text=Check out this product!`,
    instagram: `https://www.instagram.com/?url=${window.location.href}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${window.location.href}`,
    whatsapp: `https://wa.me/?text=Check out this product! ${window.location.href}`,
    wechat: `https://www.wechat.com/`,
    telegram: `https://telegram.me/share/url?url=${window.location.href}&text=Check out this product!`,
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `Check out this product! ${description}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      toggleDropdown();
    }
  };

  return (
    <div className="relative bg-black text-white rounded-lg shadow-lg p-4 mx-auto max-w-xs flex flex-col">
      {/* Favorite Icon */}
      <div
        className="absolute top-2 right-2 cursor-pointer text-red-500"
        onClick={toggleFavorite}
      >
        {isFavorite ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
      </div>

      {/* Share Icon */}
      <div className="absolute top-2 right-12 cursor-pointer text-red-500">
        <button onClick={toggleDropdown} className="flex items-center">
          <FaShareAlt size={20} />
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-black bg-opacity-90 text-white rounded-lg shadow-lg py-2 z-50">
            <ul className="space-y-1">
              <li className="px-3 py-1 hover:bg-gray-100 flex items-center">
                <FaShare className="text-red-500 mr-2" />
                <button onClick={handleWebShare} className="text-white">
                  Share
                </button>
              </li>
              {Object.entries(shareLinks).map(([key, link]) => (
                <li
                  key={key}
                  className="px-3 py-1 hover:bg-gray-100 flex items-center"
                >
                  {React.createElement(
                    {
                      facebook: FaFacebook,
                      twitter: FaTwitter,
                      instagram: FaInstagram,
                      linkedin: FaLinkedin,
                      pinterest: FaPinterest,
                      whatsapp: FaWhatsapp,
                      wechat: FaWeixin,
                      telegram: FaTelegramPlane,
                    }[key],
                    {
                      className: `text-${
                        {
                          facebook: "blue-600",
                          twitter: "blue-400",
                          instagram: "pink-500",
                          linkedin: "blue-700",
                          pinterest: "red-600",
                          whatsapp: "green-500",
                          wechat: "green-400",
                          telegram: "blue-500",
                        }[key]
                      } mr-2`,
                    }
                  )}
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Product Photo Section */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-64 h-48 bg-white rounded-lg overflow-hidden flex items-center justify-center">
          {images.length > 0 && (
            <img
              src={images[0]}
              alt={name}
              className="w-full h-full object-contain"
            />
          )}
        </div>
      </div>

      {/* Product Info Section */}
      <div className="flex flex-col flex-grow">
        <h1 className="text-lg font-bold mb-2">{name}</h1>
        <p className="text-xl font-bold text-red-500 mb-2">${price}</p>
        <div className="flex items-center mb-1">
          {" "}
          {/* Reduced margin-bottom */}
          <h3 className="text-sm font-semibold">Quantity Available:</h3>
          <p className="text-sm px-4">{quantity}</p>
        </div>
        <div className="flex-grow"></div>
        <Link
          to={`/product/${id}`}
          className="w-full mb-2 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 text-center"
        >
          View Details
        </Link>
        <button className="w-full py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
