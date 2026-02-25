"use client";

import { useField } from "formik";
import Input from "./Input";

interface Props {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
}

const FormikInput = ({ label, ...props }: Props) => {
  const [field, meta] = useField(props.name);

  return (
    <Input
      {...field}
      {...props}
      label={label}
      error={meta.touched && meta.error ? meta.error : undefined}
    />
  );
};

export default FormikInput;
