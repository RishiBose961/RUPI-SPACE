import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, Navigate, useNavigate } from "react-router";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store";
import { loginUserAction } from "@/slice/authSlice";

const LoginPage = () => {

   const { base_url } = CheckEnvironment();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

    const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const { isAuthenticated } = useSelector(
    (state: { auth: { isAuthenticated: boolean; isLoading: boolean } }) =>
      state.auth
  );
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.type === "email" ? "email" : "password"]: e.target.value });
  };

  // 🔥 Login Mutation
  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `${base_url}/api/users/login`,
        {
          email: form.email,
          password: form.password,
        }
      );
      return res.data;
    },  
    onSuccess: (data) => {
        if (!data?.token) {
        alert("Login failed")
        return
      }

      dispatch(loginUserAction(data))

      navigate("/"); 
    },
    onError: (err: {
      response: {
        data: {
          message: string;
        };
      };
    }) => {
      setError(err?.response?.data?.message || "Login failed. Try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      return setError("All fields are required");
    }

    loginMutation.mutate();
  };

  if (isAuthenticated) {
    return isAuthenticated ? (
      <Navigate to={`/`} replace />
    ) : (
      <Navigate to="/" replace />
    );
  }

  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card shadow-md rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-primary rounded-lg focus:outline-none focus:ring-2"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-primary rounded-lg focus:outline-none focus:ring-2"
            />
          </div>

          {/* Error */}
          {(error || loginMutation.isError) && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full text-white py-2 rounded-lg transition"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-sm text-center mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="font-medium cursor-pointer hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
