"use client";

import { useState } from "react";
import { Star, ShieldCheck, ThumbsUp, MessageSquare, AlertCircle } from "lucide-react";
import { submitReviewAction, deleteReviewAction } from "@/app/actions/reviews";

interface ReviewItem {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string | Date;
  user: {
    name: string | null;
    email: string;
  };
}

interface ProductReviewSectionProps {
  productId: string;
  reviews: ReviewItem[];
  userSession: { id: string; name: string | null; email: string } | null;
  isEligibleToReview: boolean;
  reviewsEnabled: boolean;
}

export default function ProductReviewSection({
  productId,
  reviews,
  userSession,
  isEligibleToReview,
  reviewsEnabled,
}: ProductReviewSectionProps) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  if (!reviewsEnabled) return null;

  // Calculate statistics
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) : "0.0";

  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { stars, count, percentage };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("rating", rating.toString());
    formData.append("title", title);
    formData.append("comment", comment);

    const res = await submitReviewAction(formData);
    setIsSubmitting(false);

    if (res.success) {
      setFeedback({ success: true, message: res.message });
      setTitle("");
      setComment("");
    } else {
      setFeedback({ success: false, message: res.error });
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete your review?")) return;
    const res = await deleteReviewAction(reviewId);
    if (!res.success) {
      alert(res.error);
    }
  };

  return (
    <section id="reviews" className="mt-16 bg-white border border-[#E7E5E4] rounded-xl p-6 sm:p-10 shadow-xs space-y-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-b border-[#E7E5E4] pb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-[#111827]">
            Customer Reviews
          </h2>
          <p className="text-xs text-[#6B7280] mt-1 font-medium">
            Authentic feedback from verified purchasers of NEXT.IN garments.
          </p>
        </div>

        {/* Rating Breakdown Summary */}
        <div className="flex items-center gap-6 bg-[#FAFAF8] border border-[#E7E5E4] p-4 rounded-xl">
          <div className="text-center">
            <span className="text-3xl font-black text-[#111827]">{avgRating}</span>
            <div className="flex items-center justify-center gap-0.5 mt-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= Math.round(Number(avgRating)) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-[10px] uppercase font-bold text-[#6B7280] mt-1 block">
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </span>
          </div>

          <div className="w-48 space-y-1.5 border-l border-[#E7E5E4] pl-6 text-xs">
            {distribution.map(({ stars, percentage }) => (
              <div key={stars} className="flex items-center gap-2">
                <span className="w-6 text-[11px] font-bold text-[#6B7280] inline-flex items-center gap-0.5">{stars}<Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" /></span>
                <div className="flex-1 h-2 bg-[#E7E5E4] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#111827] rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-[10px] font-semibold text-[#6B7280]">{percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Submission Form */}
      {userSession ? (
        isEligibleToReview ? (
          <div className="bg-[#FAFAF8] border border-[#E7E5E4] rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111827]">
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              <span>Write a Verified Customer Review</span>
            </div>

            {feedback && (
              <div
                className={`p-3.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${feedback.success ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block mb-1.5">
                  Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block mb-1.5">
                  Review Headline (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Exceptional fabric quality and relaxed fit"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E7E5E4] rounded-lg text-xs font-medium focus:outline-none focus:border-[#111827]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block mb-1.5">
                  Detailed Comment
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about fit, comfort, craftsmanship, or styling..."
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E7E5E4] rounded-lg text-xs font-medium focus:outline-none focus:border-[#111827]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#111827] hover:bg-[#27272A] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Submitting..." : "Submit Review for Verification"}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-[#FAFAF8] border border-[#E7E5E4] p-4 rounded-lg text-xs text-[#6B7280] flex items-center justify-between">
            <span>Verified Purchase Badge required to submit a review for this product.</span>
          </div>
        )
      ) : (
        <div className="bg-[#FAFAF8] border border-[#E7E5E4] p-4 rounded-lg text-xs text-[#6B7280] flex items-center justify-between">
          <span>Please sign in to write a product review.</span>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#9CA3AF] uppercase tracking-wider">
            No public reviews yet. Be the first verified buyer to share feedback.
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="border-b border-[#E7E5E4] pb-6 last:border-0 last:pb-0 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>



                  {rev.status !== "PENDING" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-700" />
                      Verified Purchase
                    </span>
                  )}
                </div>

                <span className="text-[11px] font-medium text-[#9CA3AF]">
                  {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {rev.title && <h4 className="text-xs font-bold text-[#111827]">{rev.title}</h4>}
              <p className="text-xs text-[#6B7280] leading-relaxed">{rev.comment}</p>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-bold text-[#111827]">
                  {rev.user.name || rev.user.email}
                </span>

                {userSession && rev.user.email === userSession.email && (
                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="text-[10px] text-rose-600 hover:underline font-bold uppercase tracking-wider"
                  >
                    Delete My Review
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
