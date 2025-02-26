type SignInValues = {
  email: string;
  password: string;
};

type SignUpValues = {
  email: string;
  password: string;
  confirm: string;
  error: string | null;
};

export type { SignInValues, SignUpValues };
