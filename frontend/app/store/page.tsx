"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MapPin, Mail, Star } from "lucide-react";
import { MessageLoading } from "@/components/ui/message-loading";

type Store = {
  id: number;
  name: string;
  address: string;
  email: string;
  avgRating?: number;
  myRating?: number;
};

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/store/getAllStores`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setStores(res.data.stores || []);
      } catch (err) {
        toast.error("Failed to fetch stores.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [token]);

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-pink-500 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Explore & Rate Stores</h1>
          <p className="text-sm text-white/80 mt-2">
            Browse nearby businesses, check their ratings, and leave your own feedback.
          </p>
        </div>

        <div className="flex justify-center">
          <Input
            placeholder="Search stores by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md bg-white/90 backdrop-blur-md border-none shadow-lg text-gray-800 placeholder:text-gray-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {true ? (
            <MessageLoading />
          ) : filteredStores.length === 0 ? (
            <p className="text-white text-center col-span-full">No stores found.</p>
          ) : (
            filteredStores.map((store) => (
              <Card
                key={store.id}
                className="bg-white/80 backdrop-blur-lg shadow-xl rounded-xl transition-transform hover:scale-[1.02] hover:shadow-2xl"
              >
                <CardHeader>
                  <CardTitle className="text-indigo-800 text-xl font-semibold">
                    {store.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-700">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    {store.address}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    {store.email}
                  </p>
                  <p className="flex items-center gap-2 text-yellow-600 font-medium">
                    <Star className="w-4 h-4" />
                    {store.avgRating ? `${store.avgRating.toFixed(1)} / 5` : "No ratings yet"}
                  </p>

                  <button
                    onClick={() => router.push(`/store/${store.id}/rate`)}
                    className="mt-2 w-full px-4 py-2 bg-indigo-700 text-white font-medium rounded hover:bg-indigo-800 transition-colors"
                  >
                    ⭐ Rate this store
                  </button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
