"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Star, MapPin, Mail, TrendingUp } from "lucide-react";
import { MessageLoading } from "@/components/ui/message-loading";

type Rating = {
  id: number;
  value: number;
  userId: number;
};

type Store = {
  id: number;
  name: string;
  address: string;
  email: string;
};

export default function RateStorePage() {
  const router = useRouter();
  const params = useParams();
  const storeId = params?.id ? Number(params.id) : null;

  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [existingRatingId, setExistingRatingId] = useState<number | null>(null);
  const [avgRating, setAvgRating] = useState<number | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const userId = typeof window !== "undefined" ? Number(localStorage.getItem("userId")) : null;

  useEffect(() => {
    if (!storeId || isNaN(storeId)) return;

    const fetchStoreAndRatings = async () => {
      try {
        setLoading(true);

        const storeResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/store/getStoreDetails/${storeId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setStore(storeResponse.data.store);

        const ratingsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/store/${storeId}/ratings`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const ratings = ratingsResponse.data.ratings;

        if (ratings.length) {
          const avg = ratings.reduce((sum: number, r: Rating) => sum + r.value, 0) / ratings.length;
          setAvgRating(avg);
        }

        const userRating = ratings.find(
          (r: Rating & { user?: { id: number } }) =>
            r.userId === userId || r.user?.id === userId
        );
        if (userRating) {
          setRating(userRating.value);
          setExistingRatingId(userRating.id);
        }
      } catch (error) {
        toast.error("Failed to load store or ratings.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreAndRatings();
  }, [storeId, userId,token]);

  const handleSubmit = async () => {
    if (!token) {
      toast.error("You must be logged in to rate.");
      router.push("/auth/login");
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5.");
      return;
    }

    try {
      setSubmitting(true);

      if (existingRatingId) {
        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/rating/updateRating`,
          { ratingId: existingRatingId, value: rating },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.error) throw new Error(res.data.error);
        toast.success("Rating updated successfully!");
      } else {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/rating/createRating`,
          { storeId, value: rating },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.error) throw new Error(res.data.error);
        toast.success("Rating submitted successfully!");
      }

      router.refresh();
    } catch (error) {
      toast.error("Failed to submit rating.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <p className="text-center mt-12 text-gray-600"><MessageLoading /></p>;

  if (!store)
    return <p className="text-center mt-12 text-red-500">Store not found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-pink-500 py-10 px-6">
    <div className="max-w-2xl mx-auto mt-12 p-4 bg-white rounded-xl shadow-2xl border border-white/20">
      <Card className="bg-transparent border-none shadow-none">
        <CardHeader className="pb-0">
          <CardTitle className="text-3xl text-indigo-800 font-extrabold tracking-tight">
            ⭐ Rate &quot;{store.name}&quot;
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 mt-4">
          <div className="text-gray-700 space-y-2">
            <p className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-indigo-600" /> <strong>Address:</strong>{" "}
              {store.address}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-indigo-600" /> <strong>Email:</strong>{" "}
              {store.email}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-yellow-500" />
              <strong>Average Rating:</strong>{" "}
              {avgRating ? `${avgRating.toFixed(1)} / 5` : "No ratings yet"}
            </p>
          </div>

          <div className="mt-6">
            <p className="mb-2 font-medium text-gray-800">Your Rating:</p>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={36}
                  className={`cursor-pointer transition duration-200 ${
                    rating >= i
                      ? "fill-yellow-400 stroke-yellow-400 scale-110"
                      : "stroke-gray-400 hover:stroke-yellow-500"
                  }`}
                  onClick={() => setRating(i)}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-8 w-full py-3 text-white font-semibold bg-indigo-700 hover:bg-indigo-800 transition rounded-lg disabled:opacity-60"
          >
            {submitting
              ? "Submitting..."
              : existingRatingId
              ? "Update Rating"
              : "Submit Rating"}
          </button>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
