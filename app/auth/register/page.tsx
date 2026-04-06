"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, Input, inputCls } from "@/components/ui/Field";
import { registerSchema, type RegisterForm } from "@/lib/schemas";
import { SecondaryButton } from "@/components/ui/Button";
import { AuthCart } from "@/components/ui/AuthCart";

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterForm) {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setError("root", { message: json.error ?? "Registration failed" });
        return;
      }

      router.push("/pending");
      router.refresh();
    } catch {
      setError("root", { message: "Something went wrong. Please try again." });
    }
  }

  return (
    <AuthCart title="HotelHub" subTitle="Register your hotel property">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {errors.root && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
            {errors.root.message}
          </div>
        )}

        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Your Account
        </p>

        <FormField label="Full Name" htmlFor="name" error={errors.name?.message}>
          <Input
            id="name"
            placeholder="John Smith"
            error={!!errors.name}
            {...register("name")}
          />
        </FormField>

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

        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Hotel Details
        </p>

        <FormField label="Hotel Name" htmlFor="hotelName" error={errors.hotelName?.message}>
          <Input
            id="hotelName"
            placeholder="The Grand Hotel"
            error={!!errors.hotelName}
            {...register("hotelName")}
          />
        </FormField>

        <FormField label="Location" htmlFor="hotelLocation" error={errors.hotelLocation?.message}>
          <Input
            id="hotelLocation"
            placeholder="New York, USA"
            error={!!errors.hotelLocation}
            {...register("hotelLocation")}
          />
        </FormField>

        <FormField
          label="Description (optional)"
          htmlFor="hotelDescription"
          error={errors.hotelDescription?.message}
        >
          <textarea
            id="hotelDescription"
            rows={3}
            className={inputCls}
            placeholder="Tell guests about your property..."
            {...register("hotelDescription")}
          />
        </FormField>

        <SecondaryButton
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Submitting" : "Register Hotel"}
        </SecondaryButton>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-blue-600 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthCart>
  );
}
