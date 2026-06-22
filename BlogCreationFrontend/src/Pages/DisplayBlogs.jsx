import React, { useState } from "react";
import useBlogs from "../hooks/useBlogs";
import BlogCard from "./Components/BlogCard";
import BlogSkeleton from "./Components/BlogSkeleton";
import { BLOG_CATEGORIES } from "../Utils/Constants";

const DisplayBlogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);

  const { blogs, pagination, loading, error, refetch } = useBlogs({
    page,
    limit,
    search: searchTerm,
    category: selectedCategory,
    sort,
  });

  const resetToFirstPage = (callback) => {
    callback();
    setPage(1);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSort("latest");
    setLimit(9);
    setPage(1);
  };

  const pageNumbers = (() => {
    if (!pagination?.totalPages) return [];

    const startPage = Math.max(1, pagination.currentPage - 2);
    const endPage = Math.min(pagination.totalPages, pagination.currentPage + 2);

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  })();

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">Explore Blogs</h1>
          <p className="mt-2 text-gray-600">Discover articles, ideas, tutorials, and insights.</p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => resetToFirstPage(() => setSearchTerm(e.target.value))}
            className="md:col-span-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <select
            value={selectedCategory}
            onChange={(e) => resetToFirstPage(() => setSelectedCategory(e.target.value))}
            className="px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Categories</option>
            {BLOG_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => resetToFirstPage(() => setSort(e.target.value))}
            className="px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="latest">Latest</option>
            <option value="most-liked">Most Liked</option>
          </select>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-gray-600">
            {pagination
              ? `Showing page ${pagination.currentPage} of ${pagination.totalPages || 1} • Total blogs: ${pagination.totalBlogs || 0}`
              : "Showing blogs"}
          </p>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Blogs per page</label>
            <select
              value={limit}
              onChange={(e) => resetToFirstPage(() => setLimit(Number(e.target.value)))}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {[6, 9, 12, 15].map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={refetch}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && <div className="mt-8 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl">{error}</div>}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {Array.from({ length: Math.min(limit, 9) }).map((_, index) => <BlogSkeleton key={index} />)}
          </div>
        ) : blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
              {blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
            </div>

            {pagination?.totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {pageNumbers.map((pageNumber) => (
                    <button
                      type="button"
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`w-10 h-10 rounded-full border transition ${
                        pagination.currentPage === pageNumber
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={page === pagination.totalPages}
                  onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                  className="px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="mt-10 text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900">No blogs found</h2>
            <p className="mt-2 text-gray-600">Try a different keyword or category.</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default DisplayBlogs;
