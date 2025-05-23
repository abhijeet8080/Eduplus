"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
      <section className="w-full py-24 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          Rate. Discover. Manage.
        </h1>
        <p className="max-w-xl mx-auto text-lg md:text-xl text-white/80 mb-8">
          A unified platform for customers to review stores, owners to manage their business, and admins to maintain control.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            className="bg-white text-indigo-700 hover:bg-white/90 font-semibold"
            onClick={() => router.push("/store")}
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white text-white bg-transparent hover:bg-gray-300"
            onClick={() => router.push("/auth/login")}
          >
            Login
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white text-gray-900 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            {
              title: "For Users",
              desc: "Discover top-rated stores and leave your own ratings. Help others choose better.",
            },
            {
              title: "For Store Owners",
              desc: "Manage store ratings, view customer feedback, and grow your business with data.",
            },
            {
              title: "For Admins",
              desc: "Control the ecosystem: manage users, monitor stores, and maintain platform integrity.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-indigo-50 p-6 rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center bg-white/10 backdrop-blur-md">
        <h2 className="text-4xl font-bold mb-4">Join the Rating Revolution</h2>
        <p className="text-lg text-white/80 mb-6">
          Sign up today and start engaging with stores in your city.
        </p>
        <Button
          size="lg"
          className="bg-white text-indigo-700 hover:bg-white/90 font-semibold"
          onClick={() => router.push("/auth/register")}
        >
          Create an Account
        </Button>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm py-6 bg-black/20 text-white/60">
        &copy; {new Date().getFullYear()} RateMyStore — All rights reserved.
      </footer>
    </div>
  );
}
