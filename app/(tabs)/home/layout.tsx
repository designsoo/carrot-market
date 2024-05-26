import { ReactNode } from 'react';

interface HomeLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

export default function HomeLayout({ children, modal }: HomeLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
