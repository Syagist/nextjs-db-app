import { getCookie } from "cookies-next";

import { COOKIES } from "@/types/enums";
import { CustomError } from "@/utils/errors";

export const localFetch = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = getCookie(COOKIES.accessToken);

  const headers = {
    ...options?.headers,
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  if (!options?.method) options.method = "GET";

  const res = await fetch(`/api` + url, {
    ...options,
    headers,
  });
  if (res.ok) {
    return await res.json();
  } else {
    try {
      const { errors, message } = await res.json();
      const status = res.status;

      throw new CustomError(message, status, errors);
    } catch (e) {
      throw e;
    }
  }
};
