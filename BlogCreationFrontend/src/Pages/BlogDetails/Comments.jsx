import { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import useComments from "../../hooks/useComments.js";
import axios from "axios";
import { BLOG_API_END_POINT } from "../../Constants.js";

const CommentSection = ({ id }) => {
  const [showComments, setShowComments] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redux safe selector fallback
  const user = useSelector(
    (state) => state.auth?.user || state.user?.user || state.user
  );

  const {
    comments,
    commentLoading,
    deleteLoadingId,
    pagination,
    fetchComments,
    deleteComment,
  } = useComments(id, showComments);

  const handleToggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const submitComment = async (e) => {
    e?.preventDefault();

    if (!user) {
      toast.error("Please log in to leave a comment");
      return;
    }

    if (!commentContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      setSubmitting(true);

      const res = await axios.post(
        `${BLOG_API_END_POINT}/comment/create`,
        {
          blogId: id,
          content: commentContent.trim(),
        },
        { withCredentials: true }
      );

      if (res.data?.success) {
        toast.success("Comment posted!");
        setCommentContent("");

        if (!showComments) {
          setShowComments(true);
        } else {
          fetchComments(1);
        }
      } else {
        toast.error(res.data?.message || "Failed to post comment");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong while posting"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isMyComment = (commentUserId) => {
    const loggedInUserId = user?._id || user?.id;
    return Boolean(loggedInUserId && loggedInUserId === commentUserId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <section className="w-full max-w-3xl mx-auto my-12 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between border-b border-slate-200/80 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Discussion
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Share your thoughts and join the conversation
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggleComments}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:scale-95 transition-all shadow-xs"
        >
          <span>{showComments ? "Hide Discussion" : "Show Discussion"}</span>
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-slate-200/80 px-1.5 text-[11px] font-bold text-slate-800">
            {pagination?.totalComments ?? 0}
          </span>
        </button>
      </div>

      {/* Write Comment Form */}
      <form
        onSubmit={submitComment}
        className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 hover:border-slate-300"
      >
        <div className="flex items-center gap-3 mb-4">
          {user?.avatar || user?.profilePic ? (
            <img
              src={user.avatar || user.profilePic}
              alt={user.name || "User"}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white shadow-xs">
              {user?.name ? user.name[0].toUpperCase() : "👤"}
            </div>
          )}

          <div className="text-xs">
            <span className="font-semibold text-slate-900 block sm:inline">
              {user?.name || "Guest Reader"}
            </span>
            <span className="text-slate-400 block sm:inline sm:ml-2 text-[11px]">
              {user ? "• Posting publicly" : "• Log in to participate"}
            </span>
          </div>
        </div>

        <textarea
          id="comment"
          name="comment"
          rows="3"
          disabled={!user || submitting}
          placeholder={
            user
              ? "What are your thoughts on this article?"
              : "Please log in to leave a comment..."
          }
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          className="w-full resize-none border-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed leading-relaxed"
        />

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-[11px] text-slate-400 font-medium">
            {commentContent.length > 0 ? `${commentContent.length} characters` : ""}
          </span>

          <button
            type="submit"
            disabled={submitting || !user || !commentContent.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            {submitting ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Posting...
              </>
            ) : (
              "Post Comment"
            )}
          </button>
        </div>
      </form>

      {/* Comments Container */}
      {showComments && (
        <div className="space-y-4">
          {commentLoading ? (
            <div className="space-y-4 py-2">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="animate-pulse rounded-2xl border border-slate-100 bg-slate-50/50 p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-full bg-slate-200" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3.5 w-28 rounded bg-slate-200" />
                      <div className="h-2.5 w-20 rounded bg-slate-100" />
                    </div>
                  </div>
                  <div className="h-3 w-3/4 rounded bg-slate-200 pl-12" />
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200/80 bg-slate-50/40 p-10 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                💬
              </div>
              <p className="text-sm font-semibold text-slate-700">
                No comments yet
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Be the first person to share your thoughts and start the discussion!
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {comments.map((comment) => {
                const commentUserId =
                  comment.user?._id || comment.user?.id || comment.user;
                const isOwner = isMyComment(commentUserId);
                const isDeleting = deleteLoadingId === comment._id;

                return (
                  <div
                    key={comment._id}
                    className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {comment.user?.avatar || comment.user?.profilePic ? (
                          <img
                            src={comment.user.avatar || comment.user.profilePic}
                            alt={comment.user.name || "User"}
                            className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                            {comment.user?.name
                              ? comment.user.name[0].toUpperCase()
                              : "U"}
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                              {comment.user?.name || "Anonymous User"}
                            </h4>
                            {isOwner && (
                              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 border border-indigo-100">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                      </div>

                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => deleteComment(comment._id)}
                          disabled={isDeleting}
                          className="rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-400 hover:bg-rose-50 hover:text-rose-600 active:bg-rose-100 disabled:opacity-50 transition-colors"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      )}
                    </div>

                    <p className="mt-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap pl-12">
                      {comment.content}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination?.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-8">
              <button
                type="button"
                disabled={pagination.currentPage <= 1 || commentLoading}
                onClick={() => fetchComments(pagination.currentPage - 1)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                ← Previous
              </button>

              <span className="text-xs font-medium text-slate-500">
                Page <span className="font-semibold text-slate-900">{pagination.currentPage}</span> of{" "}
                <span className="font-semibold text-slate-900">{pagination.totalPages}</span>
              </span>

              <button
                type="button"
                disabled={
                  pagination.currentPage >= pagination.totalPages ||
                  commentLoading
                }
                onClick={() => fetchComments(pagination.currentPage + 1)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default CommentSection;