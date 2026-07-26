import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetBlogBySlug } from "../hooks/useGetBlogBySlug.js";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { BLOG_API_END_POINT } from "../Constants.js";
import CommentSection from "./BlogDetails/Comments.jsx";

const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const BlogSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-32 md:py-32 font-sans animate-pulse">
      <div className="mb-8 flex items-center justify-between">
        <div className="h-9 w-28 bg-gray-200 rounded-lg"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </div>
      <header className="mb-6">
        <div className="h-5 w-24 bg-gray-200 rounded-full mb-4"></div>
        <div className="h-10 w-5/6 bg-gray-200 rounded-lg mb-3"></div>
        <div className="h-10 w-2/3 bg-gray-200 rounded-lg mb-6"></div>
        <div className="border-l-4 border-gray-200 pl-4 py-1 mb-6 space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-4/5 bg-gray-200 rounded"></div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-gray-100 py-4">
          <div className="space-y-2">
            <div className="h-4 w-36 bg-gray-200 rounded"></div>
            <div className="h-3 w-44 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2 text-right">
            <div className="h-4 w-24 bg-gray-200 rounded ml-auto"></div>
            <div className="h-3 w-20 bg-gray-200 rounded ml-auto"></div>
          </div>
        </div>
      </header>
      <div className="my-8 aspect-[16/9] bg-gray-200 rounded-xl shadow-sm"></div>
      <div className="space-y-4 my-8">
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-11/12 bg-gray-200 rounded"></div>
        <div className="h-4 w-full bg-gray-200 rounded pt-3"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

const BlogDetails = () => {
  const location = useLocation();
  const { slug } = useParams();
  const navigate = useNavigate();

  // Cleaned selector syntax
  const { user } = useSelector((state) => state.user);
  const userLoginId = user?._id;

  const { blog, loading, error, refetch } = useGetBlogBySlug(slug);
  const redirectPath = location.state?.from || "/";
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    if (blog) {
      setLikes(blog.likes?.length || 0);
      const alreadyLiked = blog.likes?.some(
        (id) => id.toString() === userLoginId?.toString()
      );
      setHasLiked(alreadyLiked || false);
    }
  }, [blog, userLoginId]);

  const handleLikeClick = async () => {
    try {
      if (!userLoginId) {
        toast.error("Login to like this Blog");
        return;
      }
      const { data } = await axios.patch(
        `${BLOG_API_END_POINT}/blog/togglelike/${blog._id}`,
        {},
        {
          headers: {
            'Content-Type': "application/json"
          },
          withCredentials: true
        }
      );

      if (data.success) {
        if (data.liked) {
          setHasLiked(true);
          setLikes((prev) => prev + 1);
          toast.success("Liked");
        } else {
          setHasLiked(false);
          setLikes((prev) => prev - 1);
          toast.success("DisLiked");
        }
      }
    } catch (error) {
      // FIX: Changed from 'err' to 'error' to match catch parameter scoping
      const errMsg = error.response?.data?.message || error.message || "Something went wrong";
      toast.error(errMsg);
    }
  };

  const isInitialFetch = loading || (!blog && !error);

  if (isInitialFetch) {
    return <BlogSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 mt-40 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
        <h3 className="text-red-800 font-semibold mb-2">Failed to Load Content</h3>
        <p className="text-red-600 text-sm mb-4">{error}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!blog && !loading) {
    return (
      <div className="text-center my-16 mt-40">
        <h2 className="text-2xl font-bold text-gray-700">Article Not Found</h2>
        <p className="text-gray-500 mt-2">The article you are looking for might have been removed.</p>
      </div>
    );
  }

  const {
    title,
    excerpt,
    content,
    featuredImage,
    category,
    tags,
    author,
    publishedAt,
    updatedAt
  } = blog;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-32 md:py-32 font-sans text-gray-900 selection:bg-blue-100">
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors bg-gray-50 hover:bg-blue-50/50 px-4 py-2 rounded-lg border border-gray-100"
        >
          <ArrowLeftIcon />
          <span>Go Back</span>
        </button>

        <Link
          to={redirectPath}
          className="text-xs text-gray-400 hover:text-gray-600 underline"
        >
          Return to Home
        </Link>
      </div>

      <header className="mb-6">
        {category && (
          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            {category}
          </span>
        )}

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4 leading-tight">
          {title}
        </h1>

        {excerpt && (
          <p className="text-lg md:text-xl text-gray-600 mb-6 italic border-l-4 border-blue-500 pl-4 py-1">
            {excerpt}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-gray-100 py-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div>
              <p className="font-semibold text-gray-800">{author?.name}</p>
              {author?.email && (
                <a href={`mailto:${author.email}`} className="text-blue-600 hover:underline text-xs">
                  {author.email}
                </a>
              )}
            </div>
          </div>

          <div className="text-right text-xs md:text-sm">
            <p>Published: <time dateTime={publishedAt}>{formatDate(publishedAt)}</time></p>
            {updatedAt && updatedAt !== publishedAt && (
              <p className="text-gray-400 mt-0.5">
                Updated: <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
              </p>
            )}
          </div>
        </div>
      </header>

      {featuredImage && (
        <div className="my-8 overflow-hidden rounded-xl aspect-[16/9] bg-gray-100 shadow-md">
          <img
            src={featuredImage}
            alt={`Featured visual for ${title}`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.01]"
          />
        </div>
      )}

      <section
        className="prose prose-blue max-w-none md:text-lg leading-relaxed text-gray-800 my-8 space-y-4"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <footer className="mt-12 pt-6 border-t border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex flex-wrap gap-2 items-center">
          {tags && tags.length > 0 && <span className="text-sm font-medium text-gray-500 mr-1">Tags:</span>}
          {tags && tags.map((tag, index) => (
            <Link to={`/blogs?tag=${tag}`}>
            <span
              key={index}
              className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded hover:bg-gray-200 cursor-pointer transition-colors"
            >
              #{tag}
            </span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={handleLikeClick}
            className={`flex items-center justify-center p-2.5 rounded-full border transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${hasLiked
              ? 'bg-rose-50 border-rose-200 text-rose-500 scale-105'
              : 'bg-white border-gray-200 text-gray-500 hover:text-rose-500 hover:bg-rose-50/50'
              }`}
            aria-label={hasLiked ? "Unlike post" : "Like post"}
          >
            <HeartIcon filled={hasLiked} />
          </button>
          <div className="text-sm font-medium text-gray-700">
            <span className="font-bold text-base text-gray-900">{likes}</span> {likes === 1 ? 'like' : 'likes'}
          </div>
        </div>
      </footer>
      <hr className="my-4" />
      <CommentSection id={blog._id}/>
    </article>
  );
};

export default BlogDetails;