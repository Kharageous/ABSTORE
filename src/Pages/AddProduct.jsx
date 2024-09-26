import React, { useState, useEffect } from "react";
import axios from "axios";
import bg from "../assets/bg.jpeg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProduct = () => {
  const generateProductId = () => `PROD-${Date.now()}`;
  const generateRandomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const generateRatingCount = () => generateRandomNumber(3000, 50000);
  const generateRatingStars = () => generateRandomNumber(4, 10) * 5;

  const categoryOptions = [
    "Electronics",
    "Clothing and Fashion",
    "Books",
    "Health",
    "Computing",
    "Phones and Tablets",
    "Sporting",
    "Gaming",
    "Other",
    "Machines",
    "Interior Design",
    "Building Equipment",
    "Car Parts",
  ];

  const initialProductData = {
    id: generateProductId(),
    name: "",
    images: [],
    categories: [],
    regDate: "",
    price: "",
    quantity: "",
    description: "",
  };

  const [productData, setProductData] = useState(initialProductData);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setProductData((prevData) => ({
        ...prevData,
        categories: checked
          ? [...prevData.categories, value]
          : prevData.categories.filter((category) => category !== value),
      }));
    } else {
      setProductData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProductData((prevData) => ({
      ...prevData,
      images: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      const ratingCount = generateRatingCount();
      const ratingStars = generateRatingStars();
      formData.append("id", productData.id);
      formData.append("name", productData.name);
      formData.append("category", productData.categories.join(","));
      formData.append("regDate", productData.regDate);
      formData.append("price", productData.price);
      formData.append("quantity", productData.quantity);
      formData.append("description", productData.description);

      productData.images.forEach((file) => {
        formData.append("images", file);
      });

      formData.append("ratingCount", ratingCount);
      formData.append("ratingStars", ratingStars);

      await axios.post("http://localhost:3000/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMessage("Product added successfully!");
      toast.success("Product added successfully!"); // Display success toast

      setTimeout(() => {
        setSuccessMessage("");
        setProductData(initialProductData);
        window.location.reload(); // Refresh the page
      }, 3000);
    } catch (error) {
      console.error("Error submitting product data:", error);
    }
  };

  const handleReset = () => {
    setProductData(initialProductData);
  };

  useEffect(() => {
    setProductData((prevData) => ({
      ...prevData,
      id: generateProductId(),
    }));
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}
    >
      <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg w-full max-w-4xl transition-transform transform hover:scale-105 border-4 border-white">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Add Product
        </h1>
        {successMessage && (
          <p className="text-center text-xl text-green-400 mb-4">
            {successMessage}
          </p>
        )}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="col-span-1">
            <label htmlFor="id" className="block text-white mb-2">
              ID: <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="id"
              name="id"
              value={productData.id}
              readOnly
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white"
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="images" className="block text-white mb-2">
              Product Images:<span className="text-red-400">*</span>
            </label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleImageChange}
              multiple
              required
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white"
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="name" className="block text-white mb-2">
              Product Name:<span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={productData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-white mb-2">
              Category:<span className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-4">
              {categoryOptions.map((category) => (
                <div key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    id={category}
                    name="categories"
                    value={category}
                    checked={productData.categories.includes(category)}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor={category} className="text-white">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-1">
            <label htmlFor="regDate" className="block text-white mb-2">
              Reg-Date:<span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              id="regDate"
              name="regDate"
              value={productData.regDate}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white"
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="price" className="block text-white mb-2">
              Price:<span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={productData.price}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white"
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="quantity" className="block text-white mb-2">
              Quantity:<span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={productData.quantity}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white"
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="description" className="block text-white mb-2">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={productData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white"
              rows="4"
            />
          </div>
          <div className="col-span-1 md:col-span-2 flex gap-4">
            <button
              type="submit"
              className="w-full py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-300"
            >
              Add Product
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-300"
            >
              Reset
            </button>
          </div>
        </form>
        {/* ToastContainer for displaying notifications */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddProduct;
