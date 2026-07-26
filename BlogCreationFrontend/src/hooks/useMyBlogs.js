import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BLOG_API_END_POINT } from "../Constants";

export const useMyBlogs = ({
    page,
    limit,
    status,
    search,
} = {}) => {
    const [blogs, setBlogs] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchMyBlogs = useCallback(async () => {
        setLoading(true);
        const toastId = toast.loading("Fetching Blogs...");

        try {
            const res = await axios.get(`${BLOG_API_END_POINT}/blog/my-blogs`, {
                params: {
                    page,
                    limit,
                    status,
                    search,
                },
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            if (res.data?.success) {
                setBlogs(res.data.blogs || []);
                setPagination(res.data.pagination || null);
                toast.success(res.data.message || "Blogs fetched successfully", { id: toastId });
            } else {
                toast.dismiss(toastId);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
            toast.error(errorMessage, { id: toastId });
        } finally {
            setLoading(false);
        }
    }, [page, limit, status, search]);

    useEffect(() => {
        fetchMyBlogs();
    }, [fetchMyBlogs]);

    return { blogs, pagination, loading, refetch: fetchMyBlogs };
};