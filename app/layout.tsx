import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Rubik_Scribble } from 'next/font/google';
import './globals.css';

const PLUS_JAKARTA_SANS = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal'],
  variable: '--jakarta-text',
});

const RUBICK = Rubik_Scribble({
  weight: '400',
  style: 'normal',
  subsets: ['latin'],
  variable: '--rubik-text',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Carrot Market',
    default: 'Carrot Market',
  },
  description: 'Sell and buy all the things!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${PLUS_JAKARTA_SANS.variable} ${RUBICK.variable} mx-auto max-w-screen-sm bg-neutral-900 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
