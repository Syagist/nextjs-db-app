"use client";
import { localFetch } from "@/app/api/local-fetch";
import AuthCard from "@/app/components/ui/AuthCard";
import FormikInput from "@/app/components/ui/forms/formik-input";
import ROUTES from "@/consts/routes";
import { encodeHashtags } from "@/utils/string";
import { Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { getRegisterFields } from "../../consts/form-fields";
import { getRegisterInitialValues } from "../../consts/form-initial-values";
import { getRegisterValidationSchema } from "../../consts/validations";
import { useTranslations } from "next-intl";
export default function RegisterPage() {
  const router = useRouter();
  const from = useSearchParams().get("from");
const t = useTranslations();
  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const res = await localFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (!res.accessToken) {
      } else {
        router.push(from ? encodeHashtags(from) : ROUTES.myAccount);
      }
    } catch (err) {
      console.log(err);
      t(err)
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-black text-white py-2.5 text-sm font-medium transition hover:opacity-90 dark:bg-white dark:text-black"
            >
              {isSubmitting ? "Logging in..." : "Register"}
            </button>
          </Form>
        )}
      </Formik>
    </AuthCard>
  );
}
