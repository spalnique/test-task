export type UserAuthBody = { email: string; password: string };

export type SignInFormState = UserAuthBody & {
  error?: string | null;
  response: {
    user: { email: string } | null;
    errors?: string[];
  };
};

export type SignUpFormState = UserAuthBody & {
  confirm: string;
  error?: string | null;
  response: {
    user: { email: string } | null;
    errors?: string[];
  };
};
