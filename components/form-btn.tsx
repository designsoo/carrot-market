interface FormButtonProps {
  text: string;
  loading: boolean;
}

export default function FormButton({ text, loading }: FormButtonProps) {
  return (
    <button
      disabled={loading}
      className='primary-btn h-10 disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:text-neutral-300'
    >
      {loading ? '로딩중' : text}
    </button>
  );
}
