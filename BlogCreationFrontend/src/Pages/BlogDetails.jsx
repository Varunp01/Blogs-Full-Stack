import React from "react";
import { Link, useParams } from "react-router-dom";
import useBlogBySlug from "../hooks/useBlogBySlug";
import { formatDate } from "../Utils/date";

const BlogDetails = () => {
  const { slug } = useParams();
  const { blog, loading, error } = useBlogBySlug(slug);

  if (loading) {
    return (
      <main className="min-h-screen bg-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600">Loading blog...</p>
        </div>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="min-h-screen bg-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/exploreblogs" className="text-blue-600 hover:underline font-medium">
            ← Back to Blogs
          </Link>
          <p className={error ? "mt-8 text-red-500" : "mt-8 text-gray-600"}>
            {error || "Blog not found."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white py-10 px-4">
      <article className="max-w-4xl mx-auto">
        <Link to="/exploreblogs" className="text-blue-600 hover:underline font-medium">
          ← Back to Blogs
        </Link>

        <div className="mt-8">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
            {blog.category || "General"}
          </span>
        </div>

        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          {blog.title}
        </h1>

        <div className="mt-6 flex items-center gap-3 text-gray-600">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            {blog.author?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-medium text-gray-900">{blog.author?.name || "Unknown Author"}</p>
            <p className="text-sm text-gray-500">Published on {formatDate(blog.publishedAt)}</p>
          </div>
        </div>

        {blog.tags?.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {blog.featuredImage && (
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="mt-8 w-full h-72 md:h-96 object-cover rounded-2xl shadow-sm"
          />
        )}

        {blog.excerpt && <p className="mt-8 text-xl leading-8 text-gray-600 font-medium">{blog.excerpt}</p>}

        <div className="mt-10 max-w-none text-gray-700">
          {blog.content
            ?.split("\n")
            .filter((paragraph) => paragraph.trim())
            .map((paragraph, index) => (
              <p key={index} className="text-lg leading-8 text-gray-700 mb-6">
                {paragraph}
              </p>
            ))}
        </div>

        <div className="mt-10 border-t border-gray-100 pt-6">
          <p className="text-gray-600">
            Likes: <span className="font-semibold text-gray-900">{blog.likes || 0}</span>
          </p>
        </div>
      </article>
    </main>
  );
};

export default BlogDetails;
