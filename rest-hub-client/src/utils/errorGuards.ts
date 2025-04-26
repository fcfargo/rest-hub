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

export interface ExtractedErrorInfo {
  status: number;
  code: string;
}

export const extractErrorInfo = (error: unknown): ExtractedErrorInfo => {
  const defaultStatus = 500;
  const defaultCode = 'INTERNAL_SERVER_ERROR';

  if (typeof error === 'object' && error !== null && 'response' in error) {
    const responseError = error as {
      response: {
        status?: number;
        data?: {
          error?: {
            code?: string;
          };
        };
      };
    };

    return {
      status: responseError.response.status ?? defaultStatus,
      code: responseError.response.data?.error?.code ?? defaultCode,
    };
  }

  return {
    status: defaultStatus,
    code: defaultCode,
  };
};
