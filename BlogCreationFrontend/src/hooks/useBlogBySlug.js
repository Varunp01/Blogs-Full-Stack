import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";

const useBlogBySlug = (slug) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBlogBySlug = useCallback(async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/blog/${slug}`);
      setBlog(res.data.blog || null);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch blog");
      setBlog(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchBlogBySlug();
  }, [fetchBlogBySlug]);

  return { blog, loading, error, refetch: fetchBlogBySlug };
};

export default useBlogBySlug;
