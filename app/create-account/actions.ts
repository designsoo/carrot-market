'use server'; // server API로 변함
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from '@/lib/constants';
import { z } from 'zod';

interface checkPasswordsProps {
  password: string;
  confirm_password: string;
}

const checkUsername = (username: string) => !username.includes('potato');

const checkPasswords = ({ password, confirm_password }: checkPasswordsProps) =>
  password === confirm_password;

const fromSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: 'Username must be a string!!',
        required_error: 'Where is my username?',
      })
      .min(3, 'Way too short!!')
      .max(10, 'That is too loooog!!')
      .toLowerCase()
      .trim()
      .refine(checkUsername, '포테이토를 제외하고 사용하세요'),
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .refine(checkPasswords, {
    message: 'Both passwords should be the same!',
    path: ['confirm_password'],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirm_password: formData.get('confirm_password'),
  };

  const result = fromSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log('login');
  }
}
