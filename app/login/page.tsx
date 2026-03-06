"use client";

import AuthCard from "@/app/components/ui/AuthCard";
import FormikInput from "@/app/components/ui/forms/formik-input";
import ROUTES from "@/consts/routes";
import { getLoginFields } from "@/consts/form-fields";
import { getLoginInitialValues } from "@/consts/form-initial-values";
import { getLoginValidationSchema } from "@/consts/validations";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login } from "@/store/auth/actions";
import { encodeHashtags } from "@/utils/string";
import { Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const from = useSearchParams().get("from");

  const handleSubmit = async (values: { email: string; password: string }) => {
    const result = await dispatch(login(values));

    if (login.fulfilled.match(result)) {
      router.push(from ? encodeHashtags(from) : ROUTES.myAccount);
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

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

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
