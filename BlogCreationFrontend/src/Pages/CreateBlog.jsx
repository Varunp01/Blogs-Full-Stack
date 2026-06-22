import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import BlogForm from "./Components/BlogForm";
import { emptyBlogForm, formToBlogPayload } from "../Utils/blogMapper";

const CreateBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(emptyBlogForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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

  const saveBlog = async (status) => {
    if (!validateForm(status)) return;

    try {
      setSubmitting(true);
      const payload = formToBlogPayload(formData, status);
      const res = await api.post("/blog/create", payload);

      if (res.data.success) {
        toast.success(status === "published" ? "Blog published successfully" : "Draft saved successfully");
        navigate("/profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save blog");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">Create New Blog</h1>
          <p className="mt-2 text-gray-600">Write, save as draft, or publish your blog post.</p>
        </div>

        <BlogForm
          formData={formData}
          errors={errors}
          submitting={submitting}
          submitLabel="Publish"
          draftLabel="Save Draft"
          onChange={handleChange}
          onPublish={(e) => {
            e.preventDefault();
            saveBlog("published");
          }}
          onSaveDraft={() => saveBlog("draft")}
          onCancel={() => navigate("/profile")}
        />
      </div>
    </main>
  );
};

export default CreateBlog;
