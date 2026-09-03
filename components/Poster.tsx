"use client";

import { useState } from "react";
import Image from "next/image";
import { PlaceholderImage } from "@/components/PlaceholderImage";

// Renders artwork fetched from fanart.tv, degrading to the dashed placeholder
// whenever there is no URL (no artwork, no API key, lookup failed) or the image
// itself fails to load in the browser. The parent supplies the sized, positioned
// box; this fills it.
export function Poster({
  src,
  label,
  sizes = "330px",
  priority = false,
}: {
  src: string | null;
  label: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) return <PlaceholderImage label={label} />;

  return (
    <Image
      src={src}
      alt={`${label} poster`}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setBroken(true)}
      style={{ objectFit: "cover", borderRadius: 3 }}
    />
  );
}
