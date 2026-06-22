import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";

const useMyBlogs = ({ page = 1, limit = 10, status = "", search = "" } = {}) => {
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/blog/my-blogs", {
        params: {
          page,
          limit,
          status: status || undefined,
          search: search || undefined,
        },
      });

      setBlogs(res.data.blogs || []);
      setPagination(res.data.pagination || null);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch your blogs");
      setBlogs([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit, status, search]);

  useEffect(() => {
    fetchMyBlogs();
  }, [fetchMyBlogs]);

  return { blogs, pagination, loading, error, refetch: fetchMyBlogs };
};

export default useMyBlogs;
