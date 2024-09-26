import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const EditProductModal = ({ product, onSave, onClose }) => {
  const [editProduct, setEditProduct] = useState(product);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (product.images && product.images.length > 0) {
      setImagePreviews(product.images);
    } else {
      setImagePreviews([]);
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    if (e.target.files[0]) {
      const newImagePreview = URL.createObjectURL(e.target.files[0]);
      setImagePreviews((prev) => [newImagePreview, ...prev]);
    }
  };

  const handleSave = () => {
    onSave(editProduct, imageFile);
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

        {/* Display main image */}
        {imagePreviews.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Main Image:</h3>
            <img
              src={imagePreviews[0]}
              alt="Main Preview"
              className="w-full h-48 object-contain border border-gray-300 rounded mb-4"
            />
          </div>
        )}

        {/* Display all images */}
        {imagePreviews.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Other Images:</h3>
            <div className="flex flex-wrap gap-2">
              {imagePreviews.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Preview ${index}`}
                  className="w-24 h-24 object-cover border border-gray-300 rounded"
                />
              ))}
            </div>
          </div>
        )}

        <input
          type="text"
          name="name"
          value={editProduct.name}
          onChange={handleInputChange}
          placeholder="Product Name"
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <textarea
          name="description"
          value={editProduct.description}
          onChange={handleInputChange}
          placeholder="Product Description"
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="price"
          value={editProduct.price}
          onChange={handleInputChange}
          placeholder="Price"
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="quantity"
          value={editProduct.quantity}
          onChange={handleInputChange}
          placeholder="Quantity"
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <input
          type="date"
          name="regDate"
          value={editProduct.regDate}
          onChange={handleInputChange}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <input
          type="file"
          onChange={handleImageChange}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EditProductModal;
