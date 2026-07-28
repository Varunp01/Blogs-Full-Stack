import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { BLOG_API_END_POINT } from "../../Constants";

const CreateComment = ({ blogId=22345, onCommentAdded=true }) => {
  const [commentContent, setCommentContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Safely grab user from Redux store
  const { user } = useSelector((state) => state.user);

  const submitComment = async (e) => {
    e.preventDefault();

    if (!blogId) {
      toast.error("Blog ID missing");
      return;
    }

    if (!commentContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      setLoading(true);
    if (!user) {
      toast.error("Please log in to leave a comment");
      return;
    }
      const res = await axios.post(
        `${BLOG_API_END_POINT}/comment/create`,
        {
          blogId,
          content: commentContent.trim(),
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data?.success) {
        toast.success("Comment posted successfully!");
        setCommentContent("");
        // Optional callback to trigger a parent refetch/update
        if (onCommentAdded) onCommentAdded(res.data.comment);
      } else {
        toast.error(res.data?.message || "Failed to post comment");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong while posting"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6">
      <form
        onSubmit={submitComment}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all focus-within:shadow-md focus-within:border-slate-300"
      >
        <div className="p-4 sm:p-5">
          {/* Header section with User Info / Guest Warning */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                {user?.name ? user.name[0].toUpperCase() : "👤"}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  {user?.name || "Guest Reader"}
                </p>
                <p className="text-[11px] text-slate-400">
                  {user ? "Sharing as registered user" : "Log in to post comments"}
                </p>
              </div>
            </div>

            {commentContent.length > 0 && (
              <span className="text-xs text-slate-400">
                {commentContent.length} chars
              </span>
            )}
          </div>

          {/* Textarea */}
          <textarea
            id="comment"
            name="comment"
            rows="3"
            disabled={!user || loading}
            placeholder={
              user
                ? "Write a thoughtful comment..."
                : "Please log in to share your thoughts."
            }
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            className="w-full resize-none border-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:bg-transparent disabled:cursor-not-allowed"
          />
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-5">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Respect community guidelines when posting.
          </span>

          <div className="flex items-center gap-2 ml-auto">
            {commentContent && (
              <button
                type="button"
                onClick={() => setCommentContent("")}
                disabled={loading}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-200/60 transition"
              >
                Clear
              </button>
            )}

            <button
              type="submit"
              disabled={loading || !user || !commentContent.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Posting...
                </>
              ) : (
                "Post Comment"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateComment;