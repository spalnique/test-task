export type UserAuthBody = { email: string; password: string };

export type SignInFormState = UserAuthBody & {
  validationError: string | null;
  user: { email: string } | null;
  apiErrors: string[] | null;
};

export type SignUpFormState = UserAuthBody & {
  confirm: string;
  validationError: string | null;
  user: { email: string } | null;
  apiErrors: string[] | null;
};
