import { Hospital } from 'lucide-react';
import Link from 'next/link';

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 text-primary ${className}`}>
      <Hospital className="h-8 w-8" />
      <span className="text-2xl font-bold font-headline">SpeakBridge</span>
    </Link>
  );
}
