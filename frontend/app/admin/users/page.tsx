"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MessageLoading } from "@/components/ui/message-loading";

type User = {
  id: string;
  name: string;
  email: string;
  address: string;
  role: "ADMIN" | "NORMAL" | "OWNER";
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data.users || []);
      } catch (err) {
        toast.error("Failed to fetch users.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-pink-500 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-white/90 backdrop-blur-md border-none shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-900 font-bold">All Users</CardTitle>
            <p className="text-sm text-muted-foreground">Manage and view details of registered users</p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-10 text-indigo-700 font-medium items-center justify-center"><MessageLoading width={24} height={24} /> </div>
            ) : users.length === 0 ? (
              <div className="text-center text-gray-600 py-10">No users found.</div>
            ) : (
              <div className="overflow-x-auto rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="text-sm text-muted-foreground">{user.id}</TableCell>
                        <TableCell className="font-medium text-indigo-800">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="text-gray-600">{user.address}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "ADMIN" ? "destructive" : "default"}>
                            {user.role}
                          </Badge>
                        </TableCell>
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
