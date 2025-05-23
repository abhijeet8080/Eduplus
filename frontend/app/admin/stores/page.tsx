"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { MessageLoading } from "@/components/ui/message-loading";

type Store = {
  id: number;
  name: string;
  email: string;
  address: string;
  owner: {
    id: number;
    name: string;
    email: string;
  };
};

export default function AdminStoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/store/getAllStores`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStores(res.data.stores || []);
      } catch (err: any) {
        toast.error("Failed to fetch stores.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-pink-500 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-white/90 backdrop-blur-md shadow-xl border-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-indigo-900">
              All Registered Stores
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage store details and track ownership
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center text-indigo-700 py-8"><MessageLoading /></div>
            ) : stores.length === 0 ? (
              <div className="text-center text-gray-600 py-8">No stores found.</div>
            ) : (
              <div className="overflow-x-auto rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Owner Name</TableHead>
                      <TableHead>Owner Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stores.map((store) => (
                      <TableRow key={store.id}>
                        <TableCell className="text-muted-foreground text-sm">{store.id}</TableCell>
                        <TableCell className="font-medium text-indigo-800">{store.name}</TableCell>
                        <TableCell>{store.email}</TableCell>
                        <TableCell className="text-gray-600">{store.address}</TableCell>
                        <TableCell className="text-gray-800">{store.owner?.name || "N/A"}</TableCell>
                        <TableCell className="text-gray-600">{store.owner?.email || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
