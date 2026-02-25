"use client";

import { localFetch } from "@/app/api/local-fetch";
import AuthCard from "@/app/components/ui/AuthCard";
import FormikInput from "@/app/components/ui/forms/formik-input";
import ROUTES from "@/app/consts/routes";
import { encodeHashtags } from "@/app/utils/string";
import { Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { getLoginFields } from "../consts/form-fields";
import { getLoginInitialValues } from "../consts/form-initial-values";
import { getLoginValidationSchema } from "../consts/validations";

export default function LoginPage() {
  const router = useRouter();
  const from = useSearchParams().get("from");

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const res = await localFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (!res.accessToken) {
      } else {
        router.push(from ? encodeHashtags(from) : ROUTES.myAccount);
      }
    } catch (err) {
      console.log("Something went wrong");
    }
  };

  return (
    <AuthCard title="Login">
      <Formik
        initialValues={getLoginInitialValues()}
        validationSchema={getLoginValidationSchema()}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {getLoginFields().map((field) => (
              <div key={field.name}>
                <FormikInput {...field} />
              </div>
            ))}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-black text-white py-2.5 text-sm font-medium transition hover:opacity-90 dark:bg-white dark:text-black"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>
    </AuthCard>
  );
}
