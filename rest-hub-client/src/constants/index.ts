export const PROFILE_IMAGE_DEFAULT = '/layout/sidebar/profile-default.svg';

export enum HttpStatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export const BAD_REQUEST_STATUS_CODE = HttpStatusCode.BAD_REQUEST;
export const UNAUTHORIZED_STATUS_CODE = HttpStatusCode.UNAUTHORIZED;

export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
};

export const AUTH_EFFECT_EXCLUDED_ROUTES = Object.values(AUTH_ROUTES);
