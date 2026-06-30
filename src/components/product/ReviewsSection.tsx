"use client";

import { useState } from "react";
import { Star, ThumbsUp, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { addProductReview } from "@/lib/actions/product.actions";
import { useSession } from "next-auth/react";

interface Review {
  id: string;
  rating: number;
  title?: string;
  body?: string;
  createdAt: Date;
  user: {
    name?: string;
    image?: string;
  };
}

interface ReviewsSectionProps {
  productId: string;
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

export function ReviewsSection({ productId, reviews, averageRating, reviewCount }: ReviewsSectionProps) {
  const { data: session } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user) {
      toast.error("Please login to leave a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      await addProductReview(productId, rating, title || undefined, body || undefined);
      toast.success("Review submitted successfully!");
      setShowForm(false);
      setRating(0);
      setTitle("");
      setBody("");
      // Refresh the page to show the new review
      window.location.reload();
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={interactive ? 24 : 16}
        className={`${
          star <= (interactive ? (hoveredRating || rating) : rating)
            ? "text-amber-400 fill-amber-400"
            : "text-muted-foreground/20 fill-transparent"
        } ${interactive ? "cursor-pointer transition-all hover:scale-110" : ""}`}
        {...(interactive && {
          onMouseEnter: () => setHoveredRating(star),
          onMouseLeave: () => setHoveredRating(0),
          onClick: () => setRating(star),
        })}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Customer Reviews</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              {renderStars(Math.round(averageRating))}
            </div>
            <span className="text-sm text-muted-foreground">
              {averageRating.toFixed(1)} · {reviewCount} review{reviewCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        {session?.user && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-xl bg-foreground text-background hover:opacity-85 transition-all text-sm font-semibold shadow-sm"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-foreground">Write Your Review</h3>
          
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Rating</label>
            <div className="flex items-center gap-1">
              {renderStars(rating, true)}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Review Title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Your Review (optional)</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share your thoughts about this product"
              rows={4}
              className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-foreground text-background hover:opacity-85 transition-all text-sm font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted transition-all text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-card border border-border rounded-2xl p-5 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    {review.user.image ? (
                      <img src={review.user.image} alt={review.user.name || "User"} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-foreground">
                        {(review.user.name || "U").charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {review.user.name || "Anonymous User"}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Content */}
              {review.title && (
                <h4 className="text-sm font-semibold text-foreground">{review.title}</h4>
              )}
              {review.body && (
                <p className="text-sm text-muted-foreground leading-relaxed">{review.body}</p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 pt-2">
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <ThumbsUp size={12} />
                  Helpful
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}