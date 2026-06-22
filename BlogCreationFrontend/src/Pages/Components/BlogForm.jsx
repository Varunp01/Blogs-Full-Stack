import React from "react";
import { BLOG_CATEGORIES } from "../../Utils/Constants";

const BlogForm = ({
  formData,
  errors,
  submitting,
  submitLabel = "Publish",
  draftLabel = "Save Draft",
  onChange,
  onPublish,
  onSaveDraft,
  onCancel,
  showDelete = false,
  onDelete,
}) => {
  return (
    <form onSubmit={onPublish} className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Blog Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter blog title"
            value={formData.title}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {BLOG_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Featured Image URL</label>
          <input
            type="url"
            name="featuredImage"
            placeholder="Paste featured image URL"
            value={formData.featuredImage}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {formData.featuredImage ? (
            <img
              src={formData.featuredImage}
              alt="Featured preview"
              className="mt-4 w-full h-64 object-cover rounded-2xl border border-gray-100"
            />
          ) : (
            <div className="mt-4 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-3">🖼️</div>
              <p className="text-gray-700 font-medium">Add an image URL above</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Excerpt</label>
          <textarea
            name="excerpt"
            placeholder="Write a short summary of your blog"
            value={formData.excerpt}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl min-h-28 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.excerpt && <p className="text-sm text-red-500 mt-1">{errors.excerpt}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
          <input
            type="text"
            name="tags"
            placeholder="react, javascript, design"
            value={formData.tags}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <p className="mt-1 text-sm text-gray-500">Separate tags with commas.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Blog Content</label>
          <textarea
            name="content"
            placeholder="Write your complete blog content here..."
            value={formData.content}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl min-h-80 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.content && <p className="text-sm text-red-500 mt-1">{errors.content}</p>}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving..." : submitLabel}
          </button>

          <button
            type="button"
            onClick={onSaveDraft}
            disabled={submitting}
            className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {draftLabel}
          </button>

          {showDelete && (
            <button
              type="button"
              onClick={onDelete}
              disabled={submitting}
              className="px-6 py-3 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          )}

          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-full text-gray-500 hover:text-gray-900 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default BlogForm;
