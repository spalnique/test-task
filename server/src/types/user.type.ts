export type User = {
  email: string;
  password: string;

  createdAt: Date;
  updatedAt: Date;

  comparePassword(submittedPassword: string): Promise<boolean>;
};
