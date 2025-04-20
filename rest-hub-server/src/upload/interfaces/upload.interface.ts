export const UPLOAD_OBJECT_TYPES = {
  POST: 'users/posts',
  PROFILE: 'users/profile',
} as const;

export type UploadObjectType = (typeof UPLOAD_OBJECT_TYPES)[keyof typeof UPLOAD_OBJECT_TYPES];
