import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-lg">
        <div className="w-40 h-40 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-6xl">❌</span>
        </div>
        <h1 className="mt-8 text-8xl md:text-9xl font-extrabold text-blue-600">404</h1>
        <h2 className="mt-6 text-3xl font-bold text-gray-900">Page Not Found</h2>
        <p className="mt-3 text-gray-600">Sorry, the page you are looking for does not exist.</p>
        <Link to="/" className="inline-block mt-8 px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md">
          Go Back Home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
