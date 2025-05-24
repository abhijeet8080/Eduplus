"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/authSlice";
import { RootState } from "@/store/store";
import { MessageLoading } from "@/components/ui/message-loading";
export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  useEffect(() => {
  if (user) {
    router.push("/");
  }
}, [user]);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
    { email, password },
    { headers: { "Content-Type": "application/json" } }
  );

  const data = res.data;
  console.log("Data",data)
  dispatch(
    setUser({
      id: res.data.user.id,
      name: res.data.user.name,
      email: res.data.user.email,
      role: res.data.user.role,
      token: res.data.token,
    })
  );
  localStorage.setItem("token", data.token);
toast.message('Login Successful', {
  description: 'Welcome back!',
})


  router.push("/");
} catch (err) {
  console.log("Error", err);
  if (process.env.NODE_ENV === "development") {
    console.warn("Handled login error:"); 
  }
} finally {
  setLoading(false);
}

  }

  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 to-indigo-700")}>
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-indigo-900">Welcome Back</CardTitle>
          <p className="text-center text-gray-500">Sign in to your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full bg-indigo-700 hover:bg-indigo-800" disabled={loading}>
              {loading ? <MessageLoading /> : "Sign In"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <a href="/auth/register" className="text-indigo-700 hover:underline font-medium">
              Register
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
