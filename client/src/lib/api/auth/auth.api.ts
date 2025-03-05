'use server';

import { UserAuthBody } from '@/types/auth.type';
import axios from 'axios';

type SignUpResponse = {
  message: string;
  user: { email: string };
};

const authAPI = axios.create({
  baseURL: 'http://localhost:4001/api/auth',
  headers: { 'Content-Type': 'application/json' },
});

export const signUpUser = async (payload: UserAuthBody) => {
  const { data } = await authAPI.post<SignUpResponse>('/signup', payload);
  return data;
};

export const signInUser = async (payload: UserAuthBody) => {
  const { data } = await authAPI.post<SignUpResponse>('/signin', payload);
  return data;
};

export const signOutUser = async () => authAPI.post('/signout');
