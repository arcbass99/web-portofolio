type ErrorWithMessage = {
  message: string;
};

const hasMessage = (error: unknown): error is ErrorWithMessage => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  );
};

export const getErrorMessage = (
  error: unknown,
  fallback = "Terjadi kesalahan yang tidak diketahui.",
) => {
  if (hasMessage(error)) {
    return error.message;
  }

  return fallback;
};
