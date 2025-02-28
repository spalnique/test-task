import { UserAuthBody } from '@/types/auth.type';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

type SignUpResponse = {
  message: string;
  user: { email: string };
};

const authAPI = axios.create({
  baseURL: 'http://localhost:4001/api/auth',
  headers: { 'Content-Type': 'application/json' },
});

let timeoutID: NodeJS.Timeout; // added for demo purposes

export const signUpUser = async (payload: UserAuthBody) => {
  if (timeoutID) clearTimeout(timeoutID);

  toast.dismiss();
  toast.loading('Creating your account...', { id: 'signup' });

  timeoutID = setTimeout(async () => {
    try {
      const { data } = await authAPI.post<SignUpResponse>('/signup', payload);

      toast.success(`Account created for ${data.user.email}`, { id: 'signup' });
    } catch (error) {
      toast.dismiss();

      if (error instanceof AxiosError) {
        const messages = error.response?.data.message.split('\n') as string[];
        messages.forEach((message) => toast.error(message));
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(error as string);
      }
    }

    clearTimeout(timeoutID);
  }, 1000);
};
