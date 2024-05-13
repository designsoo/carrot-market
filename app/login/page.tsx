'use client';

import Input from '@/components/input';
import Button from '@/components/button';
import SocialLogin from '@/components/social-login';
import { useFormState } from 'react-dom';
import { Login } from './actions';
import { PASSWORD_MIN_LENGTH } from '@/lib/constants';

export default function LogIn() {
  const [state, dispatch] = useFormState(Login, null);
  return (
    <div className='flex flex-col gap-10 px-6 py-8'>
      <div className='flex flex-col gap-2 *:font-medium'>
        <h1 className='text-2xl'>안녕하세요!</h1>
        <h2 className='text-xl'>Log in with email and password.</h2>
      </div>
      <form action={dispatch} className='flex flex-col gap-3'>
        <Input
          name='email'
          type='email'
          placeholder='Email'
          required
          errors={state?.fieldErrors.email}
        />
        <Input
          name='password'
          type='Password'
          placeholder='Password'
          required
          errors={state?.fieldErrors.password}
          minLength={PASSWORD_MIN_LENGTH}
        />
        <Button text='Log in' />
      </form>
      <SocialLogin />
    </div>
  );
}
