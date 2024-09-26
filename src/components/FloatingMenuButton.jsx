import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const FloatingMenuButton = ({ onClick, isSidebarOpen }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-4 right-4 bg-red-700 text-white p-3 rounded-full shadow-lg hover:bg-black transition-colors z-100 ${
        isSidebarOpen ? "hidden" : ""
      }`}
    >
      <FontAwesomeIcon icon={faBars} />
    </button>
  );
};

export default FloatingMenuButton;
