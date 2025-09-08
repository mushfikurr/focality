"use client";
import { useTheme } from "next-themes";
import Image from "next/image";

function ProductDemoImage() {
  const theme = useTheme();
  const dark = theme.theme === "dark";

  return (
    <Image
      src={dark ? "/focality-screenshot.png" : "/focality-screenshot-light.png"}
      alt="Screenshot of the dashboard page in focality"
      className="object-cover object-top"
      fill
    />
  );
}

export default ProductDemoImage;
