interface SeoOptions {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export function buildSeoMeta({
  title,
  description,
  url,
  image,
  ogTitle,
  ogDescription,
}: SeoOptions) {
  const resolvedOgTitle = ogTitle ?? title;
  const resolvedOgDescription = ogDescription ?? description;
  const meta: React.DetailedHTMLProps<
    React.MetaHTMLAttributes<HTMLMetaElement>,
    HTMLMetaElement
  >[] = [
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];

  if (title) {
    meta.push({ title }, { name: "title", content: title });
  }
  if (description) {
    meta.push({ name: "description", content: description });
  }

  if (resolvedOgTitle) {
    meta.push(
      { property: "og:title", content: resolvedOgTitle },
      { name: "twitter:title", content: resolvedOgTitle },
    );
  }
  if (resolvedOgDescription) {
    meta.push(
      { property: "og:description", content: resolvedOgDescription },
      { name: "twitter:description", content: resolvedOgDescription },
    );
  }

  if (url) {
    meta.push({ property: "og:url", content: url }, { name: "twitter:url", content: url });
  }

  if (image) {
    meta.push({ property: "og:image", content: image }, { name: "twitter:image", content: image });
  }

  return meta;
}

export function buildCanonicalLink(url: string) {
  return { rel: "canonical", href: url };
}
