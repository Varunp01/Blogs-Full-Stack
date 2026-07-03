

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const useComments = (blogId, enabled = false) => {
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const [pagination, setPagination] = useState({
    totalComments: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 5,
  });

  const fetchComments = useCallback(
    async (page = 1) => {
      if (!blogId) return;

      try {
        setCommentLoading(true);

        const res = await api.get(`/comment/get/${blogId}`, {
          params: {
            page,
            limit: pagination.limit,
          },
        });

        if (res.data.success) {
          setComments(res.data.comments || []);
          setPagination(res.data.pagination);
        } else {
          toast.error(res.data.message || "Failed to fetch comments");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch comments");
      } finally {
        setCommentLoading(false);
      }
    },
    [blogId, pagination.limit]
  );

  const deleteComment = async (commentId) => {
    if (!commentId) return;

    try {
      setDeleteLoadingId(commentId);

      const res = await api.delete(`/comment/del/${commentId}`);

      if (res.data.success) {
        toast.success("Comment deleted successfully");

        const pageToFetch =
          comments.length === 1 && pagination.currentPage > 1
            ? pagination.currentPage - 1
            : pagination.currentPage;

        await fetchComments(pageToFetch);
      } else {
        toast.error(res.data.message || "Failed to delete comment");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchComments(1);
    }
  }, [enabled, fetchComments]);

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