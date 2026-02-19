"use client";

import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthCard from "@/app/components/ui/AuthCard";
import Input from "@/app/components/ui/Input";
import { useState } from "react";
import { localFetch } from "@/app/api/localFetch";
import { encodeHashtags } from "@/app/utils/string";
import ROUTES from "@/app/consts/routes";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [serverError, setServerError] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const router = useRouter();
  const from = useSearchParams().get("from");
  // Yup validation schema
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    setServerError("");
    setServerMessage("");
    try {
      const res = await localFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (!res.accessToken) {
        setServerError(res.message);
      } else {
        setServerMessage("Login successful");
        router.push(from ? encodeHashtags(from) : ROUTES.myAccount);
      }
    } catch (err) {
      setServerError("Something went wrong");
    }
  };

  return (
    <AuthCard title="Login">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, handleChange, values }) => (
          <Form className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              name="email"
              value={values.email}
              onChange={handleChange}
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-sm text-red-500"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              name="password"
              value={values.password}
              onChange={handleChange}
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-sm text-red-500"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-black text-white py-2.5 text-sm font-medium transition hover:opacity-90 dark:bg-white dark:text-black"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>

            {serverError && (
              <p className="text-sm text-red-500 text-center">{serverError}</p>
            )}
            {serverMessage && (
              <p className="text-sm text-green-500 text-center">
                {serverMessage}
              </p>
            )}
          </Form>
        )}
      </Formik>
    </AuthCard>
  );
}
