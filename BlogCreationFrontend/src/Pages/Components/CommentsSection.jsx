import { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../../api/axios";
import useComments from "../../hooks/useComments"; // adjust path if needed

const CommentSection = ({ id }) => {
  const [commentBtn, setCommentBtn] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((store) => store.user);

  const {
    comments,
    commentLoading,
    deleteLoadingId,
    pagination,
    fetchComments,
    deleteComment,
  } = useComments(id, commentBtn);

  const handleCommentToggle = () => {
    setCommentBtn((prev) => !prev);
  };

  const submitComment = async () => {
    if (!user) {
      toast.error("Please login to comment");
      return;
    }

    if (!commentContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/comment/create", {
        blogId: id,
        content: commentContent.trim(),
      });

      if (res.data.success) {
        toast.success("Commented successfully");
        setCommentContent("");

        if (commentBtn) {
          fetchComments(1);
        }
      } else {
        toast.error(res.data.message || "Some error occurred");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to comment");
    } finally {
      setLoading(false);
    }
  };

  const isMyComment = (commentUserId) => {
    const loggedInUserId = user?._id || user?.id;
    return loggedInUserId === commentUserId;
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Share Your Views
        </h1>
        <p className="mt-2 text-gray-500">
          Write a comment and share your thoughts.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
        <div className="space-y-5">
          <div>
            <label
              htmlFor="comment"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Your Comment
            </label>

            <textarea
              id="comment"
              name="comment"
              placeholder="Enter your comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              rows="4"
              className="w-full resize-none px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          <button
            type="button"
            onClick={submitComment}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 active:bg-blue-800 transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Commenting..." : "Comment"}
          </button>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleCommentToggle}
          className="font-semibold cursor-pointer text-blue-600 hover:text-blue-700 transition"
        >
          {commentBtn ? "Hide Comments" : "Show Comments"}
        </button>
      </div>

      {commentBtn && (
        <div className="mt-5 bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Comments
            </h2>

            <span className="text-sm text-gray-500">
              {pagination.totalComments} total
            </span>
          </div>

          {commentLoading ? (
            <p className="text-gray-500 text-sm">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No comments yet. Be the first to comment.
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => {
                const commentUserId =
                  comment.user?._id || comment.user?.id || comment.user;

                return (
                  <div
                    key={comment._id}
                    className="border border-gray-100 rounded-xl p-4 bg-gray-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {comment.user?.name || "Unknown User"}
                        </h3>

                        <p className="text-xs text-gray-500">
                          {comment.user?.email}
                        </p>
                      </div>

                      {isMyComment(commentUserId) && (
                        <button
                          type="button"
                          onClick={() => deleteComment(comment._id)}
                          disabled={deleteLoadingId === comment._id}
                          className="text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {deleteLoadingId === comment._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      )}
                    </div>

                    <p className="mt-3 text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </p>

                    {comment.createdAt && (
                      <p className="mt-3 text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <button
                type="button"
                disabled={pagination.currentPage <= 1 || commentLoading}
                onClick={() => fetchComments(pagination.currentPage - 1)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="text-sm text-gray-500">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <button
                type="button"
                disabled={
                  pagination.currentPage >= pagination.totalPages ||
                  commentLoading
                }
                onClick={() => fetchComments(pagination.currentPage + 1)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;