import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  Checkout,
  Home,
  Login,
  Register,
  Contact,
  About,
  ShippingDelivery,
  SearchResult,
  Product,
  ProductDetails,
  AdminDashboard,
  AddProduct,
  RaindropEffect,
} from "./Pages/index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/products",
    element: <Product />,
  },
  {
    path: "/product/:productId",
    element: <ProductDetails />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  { path: "/shipping-delivery", element: <ShippingDelivery /> },
  { path: "/privacy-policy", element: <div>Privacy Policy</div> },
  { path: "/terms-conditions", element: <div>Terms and Conditions</div> },
  { path: "/faq", element: <div>FAQ</div> },
  { path: "/returns-exchanges", element: <div>Returns and Exchanges</div> },
  { path: "/register", element: <Register /> },
  { path: "/search", element: <SearchResult /> },
  { path: "/add-product", element: <AddProduct /> },
]);

function App() {
  return (
    <div>
      <RaindropEffect />
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
