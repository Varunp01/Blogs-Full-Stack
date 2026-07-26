import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { AUTH_API_END_POINT, BLOG_API_END_POINT } from "../Constants.js";

export const useBlogs = ({
    page = 1,
    limit = 5,
    category = "",
    tag = "",
    search = "",
    sort = "latest",
} = {}) => {
    const [blogs, setBlogs] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. IMPROVEMENT: Accept an optional AbortSignal to prevent race conditions
    const fetchBlogs = useCallback(async (signal) => {
        try {
            setLoading(true);
            setError(null);

            const res = await axios.get(`${BLOG_API_END_POINT}/blog/published`, {
                signal, // Attaches the abort manager here
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
        } catch (err) {
            // 3. IMPROVEMENT: Ignore errors thrown explicitly by intentional aborts
            if (err.name === "CanceledError" || err.message === "canceled") return;

            console.error("Fetch blogs error:", err);
            setPagination(null);
            setBlogs([]);

            const errMsg = err.response?.data?.message || err.message || "Something went wrong";
            setError(errMsg);
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    }, [page, limit, category, tag, search, sort]);

    // 4. IMPROVEMENT: Implemented AbortController to cleanup stale requests
    useEffect(() => {
        const controller = new AbortController();

        fetchBlogs(controller.signal);

        // Cleanup function runs when dependencies change or component unmounts
        return () => {
            controller.abort();
        };
    }, [fetchBlogs]);

    // 5. BONUS IMPROVEMENT: Provide a refetch function that bypasses abortion
    const refetch = useCallback(() => fetchBlogs(), [fetchBlogs]);

    return { blogs, pagination, loading, error, refetch };
};