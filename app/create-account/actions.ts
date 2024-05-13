'use server'; // server API로 변함
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from '@/lib/constants';
import db from '@/lib/db';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import getSesstion from '@/lib/session';
interface checkPasswordsProps {
  password: string;
  confirm_password: string;
}

const checkUsername = (username: string) => !username.includes('potato');

const checkPasswords = ({ password, confirm_password }: checkPasswordsProps) =>
  password === confirm_password;

// DB에 있는 데이터와 중복되는지 확인(username)
const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
};

// DB에 있는 데이터와 중복되는지 확인(email)
const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user) === false;
};

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
      .refine(checkUsername, 'No potatoes allowed!!!')
      .refine(checkUniqueUsername, 'This username is already taken'),
    email: z
      .string()
      .email()
      .toLowerCase()
      .refine(checkUniqueEmail, 'There is an account already registered with that email'),
    password: z.string().min(PASSWORD_MIN_LENGTH),
    // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
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

  const result = await fromSchema.safeParseAsync(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    // hash password
    const hashedPassword = await bcrypt.hash(result.data.password, 12); //해싱 알고리즘 12번 실행
    // save the user to DB
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
    const session = await getSesstion();
    session.id = user.id;
    await session.save();
    redirect('/profile');
  }
}
