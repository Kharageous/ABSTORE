import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ProductCard, SideBar, Header, Footer } from "../components/index";
import bg from "../assets/bg.jpeg";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const productsPerPage = 9;

  const sidebarRef = useRef(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/products", {
          params: { category },
        });
        setProducts(response.data);
      } catch (err) {
        setError("Failed to fetch products.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const filteredProducts = products.filter(
    (product) =>
      product &&
      product.name &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  useEffect(() => {
    if (isSidebarOpen && sidebarRef.current) {
      sidebarRef.current.style.overflowY = "hidden";
      sidebarRef.current.offsetHeight;
      sidebarRef.current.style.overflowY = "auto";
    }
  }, [isSidebarOpen]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Header />
      <main className="flex-grow flex">
        <div
          id="sidebar"
          ref={sidebarRef}
          className={`fixed left-0 top-0  bg-black p-4 border-r border-gray-700 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out w-full sm:w-64`}
          style={{
            height: "calc(100vh - 80px)",
            overflowY: "auto",
            top: "80px",
            zIndex: 50,
          }}
        >
          <SideBar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </div>

        <div className="flex-grow p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <div key={product.id} className="flex justify-center">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <p>No products available.</p>
            )}
          </div>
          {renderPaginationControls()}
        </div>
      </main>
      <Footer />
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-4 right-4 bg-red-700 text-white p-3 rounded-full shadow-lg hover:bg-black transition-colors"
        style={{ zIndex: 1000 }} // Set z-index higher than any other element
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
    </div>
  );
};

export default Product;
