import { cn } from "@/lib/utils";
import Image from "next/image";

function ProductDemoImage() {
  const baseStyle = "w-full rounded-lg border shadow-lg mask-b-from-80%";

  return (
    <>
      <Image
        src="/focality-screenshot-light.png"
        alt="Screenshot of the dashboard page in focality"
        className={cn(
          baseStyle,
          "object-cover object-left sm:object-top dark:hidden",
        )}
        fill
      />
      <Image
        src="/focality-screenshot.png"
        alt="Screenshot of the dashboard page in focality"
        className={cn(
          baseStyle,
          "hidden object-cover object-left sm:object-top dark:block",
        )}
        fill
      />
    </>
  );
}

export default ProductDemoImage;
