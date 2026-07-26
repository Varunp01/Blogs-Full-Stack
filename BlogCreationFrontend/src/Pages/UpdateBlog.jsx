import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { BLOG_API_END_POINT } from "../Constants";
import { useGetBlogBySlug } from "../hooks/useGetBlogBySlug";

const UpdateBlog = () => {
  // Route params
  const { blogId, blogSlug } = useParams();
  const navigate = useNavigate();

  // State variables
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [imgError, setImgError] = useState(false);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("draft");
  const [tags, setTags] = useState("");

  const { user } = useSelector((state) => state.user);

  // Authentication check
  useEffect(() => {
    if (!user) {
      toast.error("Login to edit Blog");
      navigate("/auth");
    }
  }, [user, navigate]);

  // Fetch blog data
  const { blog, loading, error } = useGetBlogBySlug(blogSlug);

  // Populate state variables when fetched blog data changes
  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "");
      setExcerpt(blog.excerpt || "");
      setImgUrl(blog.featuredImage || blog.imgUrl || "");
      setContent(blog.content || "");
      setCategory(blog.category || "");
      setStatus(blog.status || "draft");
      setTags(Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "");
    }
  }, [blog]);

  const resetAndMove = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    const toastId = toast.loading("Uploading image...");

    try {
      const sigResponse = await axios.get(`${BLOG_API_END_POINT}/blog/sign-upload`, {
        withCredentials: true,
      });

      if (sigResponse.status !== 200) {
        toast.error("Failed to get upload signature", { id: toastId });
        return;
      }

      const { signature, timestamp, folder, apiKey, cloudName } = sigResponse.data;

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const uploadResponse = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      });

      const data = await uploadResponse.json();

      if (uploadResponse.ok) {
        setImgUrl(data.secure_url);
        setImgError(false);
        toast.success("Image uploaded successfully!", { id: toastId });
      } else {
        toast.error(data.error?.message || "Cloudinary upload failed", { id: toastId });
      }
    } catch (err) {
      console.error("Upload Error:", err);
      toast.error("Upload failed. Please try again.", { id: toastId });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const parsedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const submitToastId = toast.loading("Updating blog...");

    try {
      const res = await axios.put(
        `${BLOG_API_END_POINT}/blog/update/${blogId}`,
        {
          title,
          excerpt,
          featuredImage: imgUrl,
          content,
          category,
          tags: parsedTags,
          status,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Blog updated successfully!", { id: submitToastId });
        navigate("/");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Something went wrong",
        { id: submitToastId }
      );
      console.error(err);
    }
  };

  const inputStyles =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-600">Loading blog details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-red-500">Failed to load blog details.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10 pt-40 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Blog updator
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Update Your Post
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Edit your blog details and prepare your article for publishing.
          </p>
        </div>

        <form onSubmit={submitHandler} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          <div className="space-y-8 p-5 sm:p-8">
            {/* Post Information */}
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Post information
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Enter the main details of your blog post.
              </p>

              <div className="mt-6 space-y-6">
                <div>
                  <label htmlFor="title" className="mb-2 block text-sm font-semibold text-slate-700">
                    Post title
                  </label>
                  <input
                    id="title"
                    type="text"
                    onChange={(event) => setTitle(event.target.value)}
                    value={title}
                    placeholder="Enter a clear and engaging title"
                    className={inputStyles}
                  />
                </div>

                <div>
                  <label htmlFor="excerpt" className="mb-2 block text-sm font-semibold text-slate-700">
                    Excerpt
                  </label>
                  <textarea
                    id="excerpt"
                    onChange={(event) => setExcerpt(event.target.value)}
                    value={excerpt}
                    rows="3"
                    placeholder="Write a short summary of the article"
                    className={`${inputStyles} resize-none`}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* Featured Image */}
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Featured image
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Upload a cover photo or paste an image URL directly.
              </p>

              <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Upload from Device
                    </label>
                    <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 transition hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-2">
                        📁
                      </div>
                      <span className="text-xs font-semibold text-slate-700">
                        Click to choose a file
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1">
                        PNG, JPG, WEBP up to 10MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs font-medium uppercase text-slate-400">OR</span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>

                  <div>
                    <label htmlFor="featuredImage" className="mb-2 block text-sm font-semibold text-slate-700">
                      Image URL
                    </label>
                    <input
                      id="featuredImage"
                      type="url"
                      value={imgUrl}
                      onChange={(event) => {
                        setImgUrl(event.target.value);
                        setImgError(false);
                      }}
                      placeholder="https://example.com/image.jpg"
                      className={inputStyles}
                    />
                    {imgError && (
                      <p className="mt-2 text-xs font-medium text-red-500">
                        Unable to load the image. Please check the URL.
                      </p>
                    )}
                  </div>
                </div>

                {/* Preview Box */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Preview
                  </label>
                  <div className="relative h-52 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                    {imgUrl && !imgError ? (
                      <img
                        src={imgUrl}
                        alt="Featured image preview"
                        onError={() => setImgError(true)}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-center p-4">
                        <div>
                          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-lg">
                            🖼️
                          </div>
                          <p className="text-xs font-medium text-slate-600">
                            {imgError ? "Failed to load image" : "No image selected"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* Content */}
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Article content
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Write the main content of your article.
              </p>

              <div className="mt-6">
                <label htmlFor="content" className="mb-2 block text-sm font-semibold text-slate-700">
                  Content
                </label>
                <textarea
                  id="content"
                  onChange={(event) => setContent(event.target.value)}
                  value={content}
                  rows="12"
                  placeholder="Start writing your article..."
                  className={`${inputStyles} min-h-72 resize-y leading-7`}
                />
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* Organization */}
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Organization and publishing
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Organize your article and select its status.
              </p>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="category" className="mb-2 block text-sm font-semibold text-slate-700">
                    Category
                  </label>
                  <input
                    id="category"
                    type="text"
                    onChange={(event) => setCategory(event.target.value)}
                    value={category}
                    placeholder="For example, Technology"
                    className={inputStyles}
                  />
                </div>

                <div>
                  <p className="mb-2 block text-sm font-semibold text-slate-700">
                    Status
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                        status === "draft"
                          ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value="draft"
                        checked={status === "draft"}
                        onChange={(event) => setStatus(event.target.value)}
                        className="mt-1 h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="block text-sm font-semibold text-slate-800">
                          Save as draft
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                          Keep the post private and edit it later.
                        </span>
                      </div>
                    </label>

                    <label
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                        status === "published"
                          ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value="published"
                        checked={status === "published"}
                        onChange={(event) => setStatus(event.target.value)}
                        className="mt-1 h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="block text-sm font-semibold text-slate-800">
                          Publish immediately
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                          Make the post visible to readers right away.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="tags" className="mb-2 block text-sm font-semibold text-slate-700">
                    Tags
                  </label>
                  <input
                    id="tags"
                    type="text"
                    onChange={(event) => setTags(event.target.value)}
                    value={tags}
                    placeholder="React, JavaScript, Web Development"
                    className={inputStyles}
                  />
                  <p className="mt-2 text-xs text-slate-400">
                    Separate multiple tags using commas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p className="text-center text-xs text-slate-500 sm:text-left">
              Complete the details before saving your post.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={resetAndMove}
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Update Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBlog;