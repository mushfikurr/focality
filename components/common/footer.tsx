import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t py-6 mt-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h2 className="text-sm font-semibold italic">focality</h2>
            <p className="text-xs text-muted-foreground">
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
        <div className="mt-6 text-left text-xs italic">
          &copy; {new Date().getFullYear()} focality
        </div>
      </div>
    </footer>
  );
}
