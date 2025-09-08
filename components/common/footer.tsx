import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-secondary/30 mt-6 py-6">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 text-center md:text-left">
            <h2 className="text-sm font-semibold italic">focality</h2>
            <p className="text-muted-foreground text-xs">
              The central point of focus.
            </p>
          </div>
          <div className="flex space-x-4 text-xs">
            <Link href="#" className="hover:underline">
              Terms
            </Link>
            <Link href="#" className="hover:underline">
              Privacy
            </Link>
            <Link href="#" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
