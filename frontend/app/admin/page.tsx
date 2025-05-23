"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Users, UserPlus, Store, PlusSquare, Info } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const adminRoutes = [
  {
    title: "Dashboard",
    description: "View overall stats (users, stores, ratings)",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    description: "Manage all registered users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Add User",
    description: "Create a new user (Admin or Normal)",
    href: "/admin/users/create",
    icon: UserPlus,
  },
  {
    title: "User Detail (Demo)",
    description: "View detail of a single user",
    href: "/admin/users/1", 
    icon: Info,
  },
  {
    title: "Stores",
    description: "View and manage all stores",
    href: "/admin/stores",
    icon: Store,
  },
  {
    title: "Add Store",
    description: "Register a new store",
    href: "/admin/stores/create",
    icon: PlusSquare,
  },
];
export default function AdminPanel() {
    const router = useRouter();
    
  const user = useSelector((state: RootState) => state.auth.user);
    useEffect(() => {
        if (!user||user.role !== "ADMIN") {
            router.push("/auth/login");
        }
    }, [user,router]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-pink-500 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">Admin Control Panel</h1>
        <p className="text-lg text-white/80 text-center mb-10">Manage users, stores, and platform data efficiently</p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {adminRoutes.map((route) => (
            <Link key={route.title} href={route.href}>
              <Card className="hover:shadow-2xl transition-shadow duration-300 bg-white/90 backdrop-blur-sm rounded-2xl border-0">
                <CardHeader className="flex items-center gap-4">
                  <route.icon className="text-indigo-700 w-8 h-8" />
                  <CardTitle className="text-xl font-semibold text-indigo-900">{route.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{route.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
