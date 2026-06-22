import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

type PublicPageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

export const noIndexRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
};

export function createPublicPageMetadata({
  title,
  description,
  path,
}: PublicPageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
