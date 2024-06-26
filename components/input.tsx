import { ForwardedRef, InputHTMLAttributes, forwardRef } from 'react';

interface InputProps {
  name: string;
  errors?: string[];
}

const _Input = (
  { name, errors = [], ...rest }: InputProps & InputHTMLAttributes<HTMLInputElement>,
  ref: ForwardedRef<HTMLInputElement>,
) => {
  return (
    <div className='flex flex-col gap-2'>
      <input
        ref={ref}
        name={name}
        className='autofill-input h-10 w-full rounded-md border-none bg-transparent ring-1 ring-neutral-200 transition placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-orange-500'
        {...rest}
      />
      {errors.map((error, index) => (
        <span key={index} className='font-medium text-red-500'>
          {error}
        </span>
      ))}
    </div>
  );
};

export default forwardRef(_Input);
