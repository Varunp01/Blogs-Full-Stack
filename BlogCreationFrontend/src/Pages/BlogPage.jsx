import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BlogCard from "./HomeComponents/BlogCard.jsx";
import BlogCardSkeleton from "./HomeComponents/BlogCardSkeleton.jsx";
import { useBlogs } from "../hooks/useBlogs.js";

const CATEGORIES = ["Web Development", "Technology", "SEO", "Design", "Marketing", "Writing", "Productivity", "General"];
// const CATEGORIES = [];

const BlogPage = () => {
  // 1. Read URL search params for ONLY the 'tag' parameter
  const [searchParams, setSearchParams] = useSearchParams();
  const tag = searchParams.get("tag") || "";

  // Helper to update or clear the 'tag' in the URL query string
  const setTagInUrl = (newTag) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      if (newTag) {
        updated.set("tag", newTag);
      } else {
        updated.delete("tag");
      }
      return updated;
    });
    setPage(1); // Reset page on tag change
  };

  // 2. Component state for remaining non-URL filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("latest"); // Options: "latest" | "most-liked"

  // Search state + debounced query state
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1); // Reset to page 1 on new search term
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Hook destructuring (passing the URL tag alongside local state)
  const {
    blogs = [],
    pagination,
    loading: blogLoading,
    error: blogError,
    refetch,
  } = useBlogs({
    page,
    limit,
    category,
    tag, // Dynamic value synced directly from URL
    search,
    sort,
  });

  const totalPages = pagination?.totalPages || 1;

  // Filter change handlers
  const handleCategoryChange = (cat) => {
    setCategory(cat === "All" ? "" : cat);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setCategory("");
    setTagInUrl(""); // Clears ?tag from URL
    setSort("latest");
    setPage(1);
  };

  return (
    <section className="w-full bg-[#A5CFFF] px-4 py-16 pt-40 sm:px-6 lg:px-8 min-h-screen">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col gap-4 border-b border-blue-200/60 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-700">
              Latest Articles
            </p>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Explore Blogs
            </h2>
            <p className="mt-2 text-base text-gray-700 sm:text-lg">
              Discover insights, tutorials, and stories shared by creators.
            </p>
          </div>

          {pagination?.totalBlogs > 0 && (
            <p className="text-xs font-semibold text-gray-700 bg-white/70 px-3 py-1.5 rounded-full border border-white/50 self-start sm:self-auto">
              Total Articles: {pagination.totalBlogs}
            </p>
          )}
        </div>

        {/* Active Tag Indicator Banner (if present in URL) */}
        {tag && (
          <div className="mt-6 flex items-center justify-between rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm">
            <span className="text-sm font-medium">
              Filtering by tag: <span className="font-bold">#{tag}</span>
            </span>
            <button
              onClick={() => setTagInUrl("")}
              className="text-xs font-semibold underline hover:text-blue-200"
            >
              Clear tag filter
            </button>
          </div>
        )}

        {/* Filter Controls Card */}
        <div className="mt-8 grid gap-4 rounded-xl bg-white/80 p-5 backdrop-blur-md shadow-sm border border-white/50 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search Input */}
          <div className="flex flex-col col-span-full lg:col-span-1">
            <label className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-600">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by title or topic..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-600">
              Category
            </label>
            <select
              value={category === "" ? "All" : category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-600">
              Sort By
            </label>
            <select
              value={sort}
              onChange={handleSortChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="latest">Latest</option>
              <option value="most-liked">Most Liked</option>
            </select>
          </div>

          {/* Items Per Page Select */}
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-600">
              Per Page
            </label>
            <select
              value={limit}
              onChange={handleLimitChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={3}>3</option>
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive =
              cat === "All" ? category === "" : category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white/70 text-gray-700 hover:bg-white border border-white/60"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Blog Grid Content */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* 1. Loading State */}
          {blogLoading &&
            Array.from({ length: limit }).map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}

          {/* 2. Error State */}
          {!blogLoading && blogError && (
            <div className="col-span-full flex flex-col items-center justify-center rounded-xl bg-white/60 p-8 text-center shadow-sm">
              <p className="mb-3 font-semibold text-red-600">{blogError}</p>
              <button
                onClick={refetch}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          )}

          {/* 3. Empty State */}
          {!blogLoading && !blogError && blogs.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center rounded-xl bg-white/60 p-10 text-center shadow-sm">
              <p className="text-lg font-medium text-gray-800">
                No articles match your criteria.
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Try adjusting your search query, selecting another category, or clearing tag filters.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* 4. Data Listing State */}
          {!blogLoading &&
            !blogError &&
            blogs.map((blog) => (
              <BlogCard key={blog._id || blog.id} blog={blog} />
            ))}
        </div>

        {/* Pagination Section */}
        {!blogLoading && !blogError && blogs.length > 0 && (
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-blue-200/60 pt-6 sm:flex-row">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="w-full sm:w-auto rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              Previous
            </button>

            {/* Numeric Page Buttons */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`h-8 w-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      page === pageNum
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white/70 text-gray-700 hover:bg-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page >= totalPages}
              className="w-full sm:w-auto rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogPage;