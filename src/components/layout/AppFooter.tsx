import Link from 'next/link';

export default function AppFooter() {
  return (
    <footer className="bg-background border-t border-border py-6 text-center text-sm text-muted-foreground">
      <div className="container mx-auto flex flex-col sm:flex-row justify-center items-center gap-4">
        <p>&copy; {new Date().getFullYear()} SpeakBridge. All rights reserved.</p>
        <nav className="flex gap-4">
          <Link href="/privacy-policy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  );
}
