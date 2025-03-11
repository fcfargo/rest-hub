export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    RESET_PASSWORD: '/auth/reset-password',
  },
  SETTINGS: {
    HOME: '/settings',
    SECURITY: '/settings/security',
  },
};

export const PROFILE_IMAGE_DEFAULT = '/layout/sidebar/profile-default.svg';

export const HTTP_STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const AUTH_ROUTES = {
  LOGIN: ROUTES.AUTH.LOGIN,
  SIGNUP: ROUTES.AUTH.SIGNUP,
  REST_PASSWORD: ROUTES.AUTH.RESET_PASSWORD,
};

export const AUTH_EFFECT_EXCLUDED_ROUTES = Object.values(AUTH_ROUTES);

export const SESSION_STATUS = {
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
} as const;

export const MODAL_TYPES = {
  PASSWORD_CHANGE: 'passwordChange',
  POST_CREATE: 'postCreate',
} as const;

export const ERROR_CODES = {
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  USER_NOD_FOUND: 'USER_NOT_FOUND',
  INVALID__PASSWORD: 'INVALID__PASSWORD',
} as const;

export const POST_CREATE_STEPS = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
} as const;

export const MEDIA_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
};

export const INPUT_TYPES = {
  EMAIL: 'email',
  PASSWORD: 'password',
  TEXT: 'text',
  FILE: 'file',
} as const;
