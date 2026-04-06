"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, Input } from "@/components/ui/Field";
import { Role } from "@/lib/constants";
import { loginSchema, type LoginForm } from "@/lib/schemas";
import { PrimaryButton } from "@/components/ui/Button";
import { AuthCart } from "@/components/ui/AuthCart";

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginForm) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      setError("root", { message: json.error ?? "Login failed" });
      return;
    }

    const { user } = json;
    if (user.role === Role.SUPER_ADMIN) {
      router.push("/admin");
    } else if (user.hotelId) {
      router.push(`/hotel/${user.hotelId}/dashboard`);
    } else {
      router.push("/pending");
    }
    router.refresh();
  }

  return (
    <AuthCart title="HotelHub" subTitle="Sign in to your account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {errors.root && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
            {errors.root.message}
          </div>
        )}

        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            placeholder="you@hotel.com"
            error={!!errors.email}
            {...register("email")}
          />
        </FormField>

        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            placeholder="Min. 6 characters"
            error={!!errors.password}
            {...register("password")}
          />
        </FormField>

        <PrimaryButton
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </PrimaryButton>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        New hotel?{" "}
        <Link href="/auth/register" className="font-medium text-blue-600 hover:underline">
          Register your property
        </Link>
      </p>
      <p className="mt-6 text-center text-md text-slate-400">
        <Link href="/" className="hover:underline">Back to home</Link>
      </p>
      <p className="mt-6 text-end text-xs text-red-400">
        <Link href="forgot-password" className="hover:underline">Forgot password?</Link>
      </p>
    </AuthCart>
  );
}
