import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ProductCard, Header, Footer } from "../components/index";

const SearchResult = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const query = new URLSearchParams(useLocation().search).get("query");

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/products?search=${query}`
        );
        setResults(response.data);
      } catch (err) {
        setError("Failed to fetch search results.");
        console.error("Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  if (loading) return <div style={{ color: "white" }}>Loading...</div>;
  if (error) return <div style={{ color: "white" }}>{error}</div>;

  return (
    <div>
      <Header />
      <div style={{ color: "white" }}>
        <h2>Search Results for "{query}"</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchResult;
