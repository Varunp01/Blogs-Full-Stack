export const emptyBlogForm = {
  title: "",
  excerpt: "",
  featuredImage: "",
  content: "",
  category: "General",
  tags: "",
  status: "draft",
};

export const blogToForm = (blog = {}) => ({
  title: blog.title || "",
  excerpt: blog.excerpt || "",
  featuredImage: blog.featuredImage || "",
  content: blog.content || "",
  category: blog.category || "General",
  tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
  status: blog.status || "draft",
});

export const formToBlogPayload = (formData, statusOverride) => ({
  title: formData.title.trim(),
  excerpt: formData.excerpt.trim(),
  featuredImage: formData.featuredImage.trim(),
  content: formData.content.trim(),
  category: formData.category.trim() || "General",
  tags: formData.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean),
  status: statusOverride || formData.status || "draft",
});
