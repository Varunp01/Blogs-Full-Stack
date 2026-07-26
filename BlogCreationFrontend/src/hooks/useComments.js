import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { BLOG_API_END_POINT } from "../Constants";

const useComments = (blogId, enabled = false, initialLimit = 5) => {
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const [pagination, setPagination] = useState({
    totalComments: 0,
    currentPage: 1,
    totalPages: 1,
    limit: initialLimit,
  });

  const fetchComments = useCallback(
    async (page = 1) => {
      if (!blogId) return;

      try {
        setCommentLoading(true);

        const res = await axios.get(`${BLOG_API_END_POINT}/comment/get/${blogId}`, {
          params: {
            page,
            limit: initialLimit,
          },
        });

        if (res.data?.success) {
          setComments(res.data.comments || []);
          setPagination({
            totalComments: res.data.pagination?.totalComments || 0,
            currentPage: res.data.pagination?.currentPage || page,
            totalPages: res.data.pagination?.totalPages || 1,
            limit: initialLimit,
          });
        } else {
          toast.error(res.data?.message || "Failed to fetch comments");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch comments"
        );
      } finally {
        setCommentLoading(false);
      }
    },
    [blogId, initialLimit]
  );

  const deleteComment = async (commentId) => {
    if (!commentId) return;

    try {
      setDeleteLoadingId(commentId);
      const res = await axios.delete(`${BLOG_API_END_POINT}/comment/del/${commentId}`,{
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

      if (res.data?.success) {
        toast.success("Comment deleted successfully");

        // Handle page step-back if the last item on current page was deleted
        const pageToFetch =
          comments.length === 1 && pagination.currentPage > 1
            ? pagination.currentPage - 1
            : pagination.currentPage;

        await fetchComments(pageToFetch);
      } else {
        toast.error(res.data?.message || "Failed to delete comment");
      }
    } catch (error) {
      toast.error( error.response?.data?.message || "Failed to delete comment" );
    } finally {
      setDeleteLoadingId(null);
    }
  };

  useEffect(() => {
    if (enabled && blogId) {
      fetchComments(1);
    }
  }, [enabled, blogId, fetchComments]);

  return {
    comments,
    commentLoading,
    deleteLoadingId,
    pagination,
    fetchComments,
    deleteComment,
  };
};

export default useComments;