"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MessageLoading } from "@/components/ui/message-loading";

type User = {
  id: string;
  name: string;
  email: string;
  address: string;
  role: string;
};

export default function AdminUserDetailPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  const userId = params?.id as string;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data.user);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to fetch user.");
        router.push("/admin/users");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-pink-500 py-10 px-4 flex justify-center items-center">
      <Card className="w-full max-w-xl bg-white/90 backdrop-blur-lg shadow-2xl border-0 rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-indigo-900">User Details</CardTitle>
          <p className="text-sm text-muted-foreground">Full information about the selected user</p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10 text-indigo-700"><MessageLoading /></div>
          ) : user ? (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                <p className="text-lg text-gray-800">{user.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="text-lg text-indigo-800 font-semibold">{user.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p className="text-lg">{user.address}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Role</h3>
                <Badge
                  variant={
                    user.role === "ADMIN" ? "destructive" : user.role === "OWNER" ? "outline" : "default"
                  }
                >
                  {user.role}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600 py-10">User not found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
