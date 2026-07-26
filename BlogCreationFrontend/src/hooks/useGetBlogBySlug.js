import { useCallback, useState, useEffect } from "react";
import axios from "axios"; // Ensure axios is imported
import { toast } from "react-hot-toast"; // Or your preferred toast library
import { BLOG_API_END_POINT } from "../Constants";

export const useGetBlogBySlug = (slug) => {
    // If fetching by a single slug, singular 'blog' (null) makes more semantic sense
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBlogBySlug = useCallback(async (signal) => {
        try {
            setLoading(true);
            setError(null);

            // Pass the controller signal to cancel stale requests if the slug changes
            const res = await axios.get(`${BLOG_API_END_POINT}/blog/${slug}`, { signal });
            // Expecting a single blog back from a slug query
            setBlog(res.data.blog || null);
        } catch (err) {
            // Safely catch intentional aborts when slug updates
            if (axios.isCancel(err) || err.name === "CanceledError" || err.message === "canceled") {
                return;
            }

            console.error("Fetch blog error:", err);
            setBlog(null);

            const errMsg = err.response?.data?.message || err.message || "Something went wrong";
            setError(errMsg);
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        const controller = new AbortController();
        
        if (slug) {
            fetchBlogBySlug(controller.signal);
        }

        // Cleanup: Aborts the request if the component unmounts or slug shifts mid-flight
        return () => {
            controller.abort();
        };
    }, [slug, fetchBlogBySlug]);

    // Simplified refetch mapping directly to the primary memoized fetch function
    const refetch = useCallback(() => fetchBlogBySlug(), [fetchBlogBySlug]);

    return { blog, loading, error, refetch };
};