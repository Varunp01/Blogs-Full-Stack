import React, { useState } from "react";
import { Link } from "react-router-dom";

const HomeHero = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
    <section className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-4 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <span className="mb-4 inline-block rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
            Read. Write. Inspire.
          </span>

          <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
            Discover{" "}
            <span className="text-blue-600 transition-colors hover:text-blue-800">
              Stories
            </span>
            ,{" "}
            <span className="text-blue-600 transition-colors hover:text-blue-800">
              Ideas
            </span>
            , and{" "}
            <span className="text-blue-600 transition-colors hover:text-blue-800">
              Insights
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-700 sm:text-xl md:text-2xl">
            A modern blog platform where readers explore meaningful articles
            and writers share powerful ideas.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/blogs"
              className="w-full rounded-xl border-2 border-blue-600 bg-white px-7 py-3 text-lg font-semibold text-blue-700 shadow-md transition duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-lg sm:w-auto"
            >
              Explore Blogs
            </Link>

            <Link
              to="/create-blog"
              className="w-full rounded-xl border-2 border-blue-600 bg-blue-600 px-7 py-3 text-lg font-semibold text-white shadow-md transition duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-lg sm:w-auto"
            >
              Start Writing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeHero;