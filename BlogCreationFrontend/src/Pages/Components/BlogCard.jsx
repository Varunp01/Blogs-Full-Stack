import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../Utils/date";

const BlogCard = ({ blog, manage = false, onDelete }) => {
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition">
      {blog.featuredImage ? (
        <img src={blog.featuredImage} alt={blog.title} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      <div className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-600">
            {blog.category || "General"}
          </span>

          {manage && (
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                blog.status === "published"
                  ? "bg-green-50 text-green-600"
                  : "bg-yellow-50 text-yellow-700"
              }`}
            >
              {blog.status}
            </span>
          )}
        </div>

        <Link to={blog.status === "published" ? `/exploreblogs/${blog.slug}` : `/edit/${blog._id}`}>
          <h2 className="mt-3 text-xl font-bold text-gray-900 hover:text-blue-600 transition">
            {blog.title}
          </h2>
        </Link>

        <p className="mt-2 text-gray-600 line-clamp-3">{blog.excerpt}</p>

        <div className="mt-4 flex items-center justify-between gap-3 text-sm text-gray-500">
          <span className="truncate">{blog.author?.name || "Unknown Author"}</span>
          <span className="shrink-0">{formatDate(blog.publishedAt || blog.createdAt)}</span>
        </div>

        <div className="mt-3 text-sm text-gray-500">Likes: {blog.likes?.length || 0}</div>

        {manage ? (
          <div className="mt-5 flex items-center gap-4">
            <Link to={`/edit/${blog._id}`} className="text-blue-600 font-semibold hover:underline">
              Edit
            </Link>
            <button
              type="button"
              onClick={() => onDelete?.(blog._id)}
              className="text-red-600 font-semibold hover:underline"
            >
              Delete
            </button>
          </div>
        ) : (
          <Link
            to={`/exploreblogs/${blog.slug}`}
            className="mt-5 inline-block text-blue-600 font-semibold hover:underline"
          >
            Read More
          </Link>
        )}
      </div>
    </article>
  );
};

export default BlogCard;
