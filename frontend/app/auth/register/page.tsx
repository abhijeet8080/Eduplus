"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { MessageLoading } from "@/components/ui/message-loading";

export default function RegisterPage() {
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
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const address = formData.get("address") as string;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

  if (name.length < 20 || name.length > 60) {
    toast.warning("Invalid Name", {
      description: "Name must be between 20 and 60 characters.",
    });
    setLoading(false);
    return;
  }

  if (!emailRegex.test(email)) {
    toast.warning("Invalid Email", {
      description: "Please enter a valid email address.",
    });
    setLoading(false);
    return;
  }

  if (address.length > 400) {
    toast.warning("Invalid Address", {
      description: "Address must not exceed 400 characters.",
    });
    setLoading(false);
    return;
  }

  if (!passwordRegex.test(password)) {
    toast.warning("Weak Password", {
      description: "Password must be 8–16 characters and include an uppercase letter and special character.",
    });
    setLoading(false);
    return;
  }

  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
      { name, email, password, address },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log(res.data);
    localStorage.setItem("token", res.data.token);

    toast.success("Registration Successful", {
      description: "Welcome aboard!",
    });
    dispatch(
  setUser({
    id: res.data.user.id,
    name: res.data.user.name,
    email: res.data.user.email,
    role: res.data.user.role,
    token: res.data.token,
  })
);


    router.push("/");
  } catch (err: any) {
    const message =
      err?.response?.data?.error || "Registration failed. Please try again.";

    toast.error("Registration Failed", {
      description: message,
    });
  } finally {
    setLoading(false);
  }
}


  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 to-indigo-700")}>
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-indigo-900">Create Account</CardTitle>
          <p className="text-center text-gray-500">Join us and start your journey</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" type="text" placeholder="Your Name" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" type="text" placeholder="Your Address" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full bg-indigo-700 hover:bg-indigo-800" disabled={loading}>
              {loading ? <MessageLoading /> : "Register"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/auth/login" className="text-indigo-700 hover:underline font-medium">
              Login
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
