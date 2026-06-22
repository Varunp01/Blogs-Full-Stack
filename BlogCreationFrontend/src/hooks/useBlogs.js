import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";

const useBlogs = ({
  page = 1,
  limit = 10,
  category = "",
  tag = "",
  search = "",
  sort = "latest",
} = {}) => {
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/blog/published", {
        params: {
          page,
          limit,
          category: category || undefined,
          tag: tag || undefined,
          search: search || undefined,
          sort,
        },
      });

      setBlogs(res.data.blogs || []);
      setPagination(res.data.pagination || null);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch blogs");
      setBlogs([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit, category, tag, search, sort]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return { blogs, pagination, loading, error, refetch: fetchBlogs };
};

export default useBlogs;
