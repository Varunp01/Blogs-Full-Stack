import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import BlogForm from "./Components/BlogForm";
import { blogToForm, emptyBlogForm, formToBlogPayload } from "../Utils/blogMapper";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(emptyBlogForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/blog/edit/${id}`);
        setFormData(blogToForm(res.data.blog));
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load blog");
        navigate("/profile");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (status) => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Blog title is required";
    if (status === "published" && !formData.content.trim()) {
      newErrors.content = "Full blog content is required before publishing";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateBlog = async (status) => {
    if (!validateForm(status)) return;

    try {
      setSubmitting(true);
      const payload = formToBlogPayload(formData, status);
      const res = await api.put(`/blog/update/${id}`, payload);

      if (res.data.success) {
        toast.success(status === "published" ? "Blog published successfully" : "Draft updated successfully");
        navigate("/profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update blog");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteBlog = async () => {
    try {
      setSubmitting(true);
      const res = await api.delete(`/blog/delete/${id}`);

      if (res.data.success) {
        toast.success(res.data.message || "Blog deleted successfully");
        navigate("/profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete blog");
    } finally {
      setSubmitting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-10 w-48 bg-gray-200 rounded-lg" />
          <div className="mt-3 h-5 w-80 bg-gray-200 rounded-lg" />
          <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-8 space-y-6">
            <div className="h-12 bg-gray-200 rounded-xl" />
            <div className="h-12 bg-gray-200 rounded-xl" />
            <div className="h-64 bg-gray-200 rounded-xl" />
            <div className="h-72 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">Edit Blog</h1>
          <p className="mt-2 text-gray-600">Update your blog details, content, status, and image.</p>
        </div>

        <BlogForm
          formData={formData}
          errors={errors}
          submitting={submitting}
          submitLabel="Publish / Update"
          draftLabel="Save as Draft"
          onChange={handleChange}
          onPublish={(e) => {
            e.preventDefault();
            updateBlog("published");
          }}
          onSaveDraft={() => updateBlog("draft")}
          onCancel={() => navigate("/profile")}
          showDelete
          onDelete={() => setShowDeleteModal(true)}
        />
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900">Delete Blog?</h2>
            <p className="mt-3 text-gray-600">This action cannot be undone.</p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={submitting}
                className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={deleteBlog}
                disabled={submitting}
                className="px-5 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-60"
              >
                {submitting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default EditBlog;
