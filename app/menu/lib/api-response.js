export function apiError(status, code, message, fieldErrors) {
  return Response.json(
    {
      error: {
        code,
        message,
        ...(fieldErrors ? { fieldErrors } : {}),
      },
    },
    { status },
  );
}