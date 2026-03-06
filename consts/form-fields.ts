export const getLoginFields = () => {
  return [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "email",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
    },
  ];
};

export const getRegisterFields = () => {
  return [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "email",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter your name",
    },
  ];
};
