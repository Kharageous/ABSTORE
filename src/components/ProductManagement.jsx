import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import bg from "../assets/bg.jpeg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditProductModal from "./EditProductModal"; // Import your modal component

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [initialProduct, setInitialProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/products");
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

  const handleEditProduct = (product) => {
    setInitialProduct({ ...product });
    setEditProduct(product);
    setImageFile(null);
    setModalOpen(true);
  };

  const handleSaveProduct = async (updatedProduct, imageFile) => {
    try {
      if (
        JSON.stringify(updatedProduct) === JSON.stringify(initialProduct) &&
        !imageFile
      ) {
        toast.info("No changes detected.");
        setModalOpen(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", updatedProduct.name);
      formData.append("description", updatedProduct.description);
      formData.append("price", updatedProduct.price);
      formData.append("quantity", updatedProduct.quantity);
      formData.append("regDate", updatedProduct.regDate);

      if (imageFile) {
        formData.append("images", imageFile);
      }

      const response = await axios.put(
        `http://localhost:3000/api/products/${updatedProduct.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updatedProductData = response.data;
      if (!updatedProductData) {
        throw new Error("Invalid response from server.");
      }

      // Refetch the entire product list from the server
      const productResponse = await axios.get(
        "http://localhost:3000/api/products"
      );
      setProducts(productResponse.data); // Update the products state with the latest data

      // Reset the modal and states
      setEditProduct(null);
      setImageFile(null);
      setModalOpen(false);

      toast.success("Product updated successfully!");
    } catch (err) {
      let errorMessage = "Failed to update product.";
      if (err.response) {
        if (err.response.data && err.response.data.error) {
          errorMessage = err.response.data.error;
        } else {
          errorMessage = `Error: ${err.response.status} ${err.response.statusText}`;
        }
      } else if (err.request) {
        errorMessage = "No response received from server.";
      }
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating product:", err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setDeleting(true);
      try {
        await axios.delete(`http://localhost:3000/api/products/${id}`);
        const updatedProducts = products.filter((product) => product.id !== id);
        setProducts(updatedProducts);
        toast.success("Product deleted successfully!");
      } catch (err) {
        setError("Failed to delete product.");
        toast.error("Failed to delete product.");
        console.error("Error deleting product:", err);
      } finally {
        setDeleting(false);
      }
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product &&
      product.name &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderPaginationControls = () => (
    <div className="flex justify-center space-x-2 mt-6">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-black text-white font-semibold rounded-lg border border-white hover:bg-gray-700 transition-colors"
      >
        Prev
      </button>
      <span className="text-white">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-black text-white font-semibold rounded-lg border border-white hover:bg-gray-700 transition-colors"
      >
        Next
      </button>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="min-h-screen p-4 sm:p-8 lg:p-12">
        <motion.div
          className=" mx-auto p-6 bg-opacity-60 border border-white rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-center mb-6 text-white">
            Product Management
          </h1>

          <div className="mb-8 text-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/add-product"
                className="inline-block px-6 py-3 bg-black text-white font-semibold rounded-lg border border-white hover:bg-gray-800 transition-colors"
              >
                Add Product
              </Link>
            </motion.div>
          </div>

          <div className="flex flex-col items-center mb-8">
            <div className="flex flex-col sm:flex-row items-center mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Products"
                className="w-full sm:w-64 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <motion.button
                onClick={() => setSearchTerm(searchTerm)}
                className="mt-2 sm:mt-0 sm:ml-2 px-4 py-3 bg-black text-white font-semibold rounded-r-lg border border-white hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Search
              </motion.button>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Product List
            </h2>
            {loading && <p className="text-white">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {currentProducts.map((product) => {
                const imagePath = product.images[0];

                return (
                  <div
                    key={product.id}
                    className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg shadow-sm overflow-hidden flex flex-col"
                  >
                    <div className="w-full h-48 bg-gray-200 overflow-hidden flex items-center justify-center">
                      {imagePath ? (
                        <img
                          src={`http://localhost:3000/${imagePath}`}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-gray-500">No Image</div>
                      )}
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <div className="border-b border-gray-300 pb-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {product.name}
                        </h3>
                      </div>
                      <div className="border-t border-gray-300 pt-2 flex flex-col">
                        <p className="text-gray-200">Price: ${product.price}</p>
                        <p className="text-gray-200">
                          Quantity: {product.quantity}
                        </p>
                        <p className="text-gray-200">
                          Registered Date:{" "}
                          {new Date(product.reg_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center space-x-2 p-4 bg-transparent border-t border-gray-300">
                      <motion.button
                        onClick={() => handleEditProduct(product)}
                        className="px-4 py-2 bg-black text-white font-semibold rounded-lg border border-white hover:bg-gray-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Edit
                      </motion.button>
                      {deleting ? (
                        <motion.button
                          className="px-4 py-2 bg-black text-white font-semibold rounded-lg border border-white cursor-not-allowed"
                          disabled
                        >
                          Deleting...
                        </motion.button>
                      ) : (
                        <motion.button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="px-4 py-2 bg-black text-white font-semibold rounded-lg border border-white hover:bg-gray-700 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Delete
                        </motion.button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {renderPaginationControls()}
          </div>
        </motion.div>
      </div>

      {/* Edit Product Modal */}
      {modalOpen && (
        <EditProductModal
          product={editProduct}
          onSave={handleSaveProduct}
          onClose={() => setModalOpen(false)}
        />
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default ProductManagement;
