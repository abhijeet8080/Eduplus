"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { Lock } from "lucide-react";
import { MessageLoading } from "@/components/ui/message-loading";

export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/auth/login");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(newPassword)) {
      toast.warning("Password must be 8–16 characters with one uppercase and one special character.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/update-password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Password updated successfully.");
      router.push("/");
    } catch (err: any) {
      const message = err?.response?.data?.error || "Failed to update password.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-pink-500 p-4">
      <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/95 backdrop-blur-xl rounded-2xl">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center space-y-2">
            <Lock size={32} className="text-indigo-700" />
            <CardTitle className="text-2xl font-bold text-indigo-900">
              Change Your Password
            </CardTitle>
            <p className="text-sm text-gray-500 max-w-sm">
              For your security, choose a strong password that you haven’t used before.
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-gray-700">Old Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-gray-700">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters, incl. uppercase & symbol"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-700 hover:bg-indigo-800 transition-colors"
              disabled={loading}
            >
              {loading ? <MessageLoading /> : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
