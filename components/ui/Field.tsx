// Shared form field primitives

import { useState } from "react";

export const inputCls =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500";

export const inputErrCls =
  "w-full rounded-lg border border-red-400 px-3 py-2 text-sm outline-none focus:border-red-500";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  htmlFor?: string;
  error?: string;
}

export function FormField({ label, htmlFor, children, error }: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Input({
  error,
  type,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  const isPassword = type === "password";
  const [show, setShow] = useState(false);

  const finalType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div className="relative">
      <input
        {...props}
        type={finalType}
        className={`${error ? inputErrCls : inputCls} ${isPassword ? "pr-10" : ""
          }`}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute inset-y-0 right-2 flex items-center text-xs text-slate-500"
        >
          {show ? "Hide" : "Show"}
        </button>
      )}
    </div>
  );
}

export function Select({
  error,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return <select {...props} className={error ? inputErrCls : inputCls} />;
}
