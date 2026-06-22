import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../api/axios";
import useMyBlogs from "../hooks/useMyBlogs";
import BlogCard from "./Components/BlogCard";
import BlogSkeleton from "./Components/BlogSkeleton";

const Profile = () => {
  const { user } = useSelector((store) => store.user);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { blogs, pagination, loading, error, refetch } = useMyBlogs({
    page,
    limit: 9,
    status,
    search,
  });

  const handleDelete = async (blogId) => {
    const confirmed = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmed) return;

    try {
      const res = await api.delete(`/blog/delete/${blogId}`);
      if (res.data.success) {
        toast.success(res.data.message || "Blog deleted successfully");
        refetch();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete blog");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-4xl font-bold border-4 border-blue-50">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user?.name || "User"}</h1>
                <p className="mt-1 text-gray-600">{user?.email}</p>
                <p className="mt-3 text-gray-600 max-w-2xl">
                  Manage your published posts and drafts from one place.
                </p>
              </div>
            </div>

            <Link to="/create" className="px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition text-center">
              Create New Blog
            </Link>
          </div>
        </section>

        <section className="mt-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">My Blogs</h2>
              <p className="mt-2 text-gray-600">Edit, publish, draft, or delete your blogs.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search your blogs..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {error && <div className="mt-8 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl">{error}</div>}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {Array.from({ length: 6 }).map((_, index) => <BlogSkeleton key={index} />)}
            </div>
          ) : blogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {blogs.map((blog) => <BlogCard key={blog._id} blog={blog} manage onDelete={handleDelete} />)}
              </div>

              {pagination?.totalPages > 1 && (
                <div className="mt-10 flex justify-center gap-3">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    className="px-4 py-2 rounded-full border border-gray-300 bg-white disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page === pagination.totalPages}
                    onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                    className="px-4 py-2 rounded-full border border-gray-300 bg-white disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="mt-8 text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-900">No blogs found</h3>
              <p className="mt-2 text-gray-600">Start writing your first blog and share your ideas.</p>
              <Link to="/create" className="inline-block mt-6 px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition">
                Create Blog
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Profile;
