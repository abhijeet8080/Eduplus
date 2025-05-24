"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { MessageLoading } from "@/components/ui/message-loading";

type Rating = {
  id: number;
  value: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

type Store = {
  id: number;
  name: string;
  email: string;
  address: string;
  avgRating: number;
};

export default function StoreDashboardPage() {
  const [store, setStore] = useState<Store | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

 useEffect(() => {
  const fetchDashboard = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (!user) return;

    try {
      if (user.role !== "OWNER") {
        toast.error("Access denied. Only store owners can view this dashboard.");
        router.push("/");
        return;
      }

      const storesRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/store/getStoreDetailsFromUserId`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const storeData: Store = storesRes.data.stores[0];
      setStore(storeData);

      const ratingsRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/store/${storeData.id}/ratings`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRatings(ratingsRes.data.ratings || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, [router, user]); 


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-pink-500 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl text-center font-bold text-white">Store Dashboard</h1>

        {loading ? (
          <MessageLoading />
        ) : !store ? (
          <p className="text-center text-white">No store found for this account.</p>
        ) : (
          <Card className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-indigo-900">{store.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                <strong>Address:</strong> {store.address} <br />
                <strong>Email:</strong> {store.email}
              </p>
              <p className="text-indigo-700 text-lg mt-2 font-medium">
                ⭐ Average Rating: {store.avgRating?.toFixed(1) ?? "N/A"}
              </p>
            </CardHeader>
            <CardContent>
              {ratings.length === 0 ? (
                <p className="text-gray-600">No ratings yet for this store.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ratings.map((rating) => (
                      <TableRow key={rating.id}>
                        <TableCell>{rating.user.name}</TableCell>
                        <TableCell>{rating.user.email}</TableCell>
                        <TableCell className="text-yellow-500 font-bold">⭐ {rating.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
