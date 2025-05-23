"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageLoading } from "@/components/ui/message-loading";

type Owner = {
  id: number;
  name: string;
  email: string;
};

export default function CreateStorePage() {
  const router = useRouter();

  const [store, setStore] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });

  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const allUsers = res.data.users;
        setOwners(allUsers);
      } catch (err) {
        toast.error("Failed to load store owners. Error: ",err!);
      }
    };

    fetchOwners();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStore((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOwnerChange = (value: string) => {
    setStore((prev) => ({ ...prev, ownerId: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!store.ownerId) {
      toast.warning("Please select a store owner.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/store/createStore`,
        {
          name: store.name,
          email: store.email,
          address: store.address,
          ownerId: parseInt(store.ownerId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Store created successfully!");
      router.push("/admin/stores");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to create store.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-pink-500 py-12 px-4 flex justify-center items-center">
      <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-lg border-none rounded-3xl shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-indigo-900">Register New Store</CardTitle>
          <p className="text-sm text-gray-500">Fill in the details below to add a new store.</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="name" className="text-sm text-gray-700">Store Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex: Biryani House"
                  value={store.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm text-gray-700">Store Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="store@email.com"
                  value={store.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address" className="text-sm text-gray-700">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Ex: 123, Street, City"
                  value={store.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm text-gray-700">Store Owner</Label>
                <Select onValueChange={handleOwnerChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {owners.map((owner) => (
                      <SelectItem key={owner.id} value={owner.id.toString()}>
                        {owner.name} ({owner.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-700 hover:bg-indigo-800 rounded-xl text-white font-medium py-2.5"
              disabled={loading}
            >
              {loading ? <MessageLoading /> : "Create Store"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
