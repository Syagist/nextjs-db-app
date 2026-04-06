"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, Input } from "@/components/ui/Field";
import { forgotPasswordSchema, type ForgotPasswordForm } from "@/lib/schemas";
import { PrimaryButton } from "@/components/ui/Button";
import { AuthCart } from "@/components/ui/AuthCart";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(data: ForgotPasswordForm) {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      setError("root", { message: json.error ?? "Forgot Password failed" });
      return;
    }


    router.refresh();
  }

  return (
    <AuthCart title="HotelHub" subTitle="Enter to recover profile">
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

        <PrimaryButton
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </PrimaryButton>
      </form>

      <p className="mt-6 text-center text-md text-slate-400">
        <Link href="/" className="hover:underline">Back to home</Link>
      </p>
    </AuthCart>
  );
}
