"use client";

import AuthCard from "@/app/components/ui/AuthCard";
import FormikInput from "@/app/components/ui/forms/formik-input";
import ROUTES from "@/consts/routes";
import { getRegisterFields } from "@/consts/form-fields";
import { getRegisterInitialValues } from "@/consts/form-initial-values";
import { getRegisterValidationSchema } from "@/consts/validations";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { register } from "@/store/auth/actions";
import { Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const from = useSearchParams().get("from");

  const handleSubmit = async (values: { email: string; password: string }) => {
    const result = await dispatch(register(values));

    if (register.fulfilled.match(result)) {
      router.push(from ? `/login?from=${from}` : ROUTES.login);
    }
  };

  return (
    <AuthCard title="Register">
      <Formik
        initialValues={getRegisterInitialValues()}
        validationSchema={getRegisterValidationSchema()}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {getRegisterFields().map((field) => (
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
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </Form>
        )}
      </Formik>
    </AuthCard>
  );
}
