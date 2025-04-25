export const isAxiosError = (
  error: unknown,
): error is {
  response: { status?: number; data?: { error?: { code?: number } } };
  message?: string;
} => {
  return typeof error === 'object' && error !== null && 'response' in error;
};

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as { message?: string }).message ?? 'Unexpected error';
  }
  return 'Unexpected error';
};
