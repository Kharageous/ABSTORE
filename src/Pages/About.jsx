import React from "react";
import { Header, Footer } from "../components";
const About = () => {
  return (
    <div>
      <Header />
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="max-w-4xl p-6 bg-white bg-opacity-10 backdrop-blur-md border border-white rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4 text-center text-white">
            About Us
          </h1>
          <p className="text-lg mb-4 text-gray-300">
            Welcome to ABSTORE, your go-to destination for quality products at
            unbeatable prices. Our mission is to provide a seamless shopping
            experience while ensuring customer satisfaction.
          </p>
          <h2 className="text-2xl font-semibold mb-2 text-white">Our Story</h2>
          <p className="mb-4 text-gray-300">
            Founded in 2024, ABSTORE began with a simple idea: to make shopping
            easier and more accessible for everyone. Our passionate team works
            tirelessly to curate a diverse range of products that meet your
            needs.
          </p>
          <h2 className="text-2xl font-semibold mb-2 text-white">Our Values</h2>
          <ul className="list-disc list-inside mb-4 text-gray-300">
            <li>Quality: We prioritize offering high-quality products.</li>
            <li>Customer Service: Our customers are our top priority.</li>
            <li>Innovation: We continuously seek to improve our offerings.</li>
          </ul>
          <h2 className="text-2xl font-semibold mb-2 text-white">Join Us!</h2>
          <p className="text-gray-300">
            Thank you for choosing ABSTORE. We look forward to serving you and
            becoming your trusted shopping partner. For any questions or
            feedback, feel free to reach out to our support team.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
