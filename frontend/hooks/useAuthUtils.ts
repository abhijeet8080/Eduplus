import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser, logout } from "@/store/authSlice";
import { toast } from "sonner";

const useAuthUtils = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const getUserDetails = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user-details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { user } = res.data;

      if (!user) {
        throw new Error("User not found");
      }

      dispatch(setUser({ ...user, token }));
    } catch (err) {
      console.error("Failed to fetch user details:", err);
      toast.error("Session expired. Please log in again.");
      dispatch(logout());
      localStorage.removeItem("token");
      router.push("/auth/login");
    }
  };

  return { getUserDetails };
};

export default useAuthUtils;
