
import * as Yup from "yup";

export const getLoginValidationSchema = () =>
  Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

export const getRegisterValidationSchema = () =>
  Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
    name: Yup.string().required("Name is required"),
  });
