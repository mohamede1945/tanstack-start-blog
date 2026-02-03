import { Still } from "remotion";
import { BlogOgImage, type BlogOgImageProps } from "./post-og-image";
import { SocialImage } from "./social-image";

export const RemotionRoot = () => {
  const defaultBlogProps: BlogOgImageProps = {
    title: "Ship a TanStack Start blog in hours, not weeks.",
  };

  return (
    <>
      <Still id="social-image" component={SocialImage} width={1200} height={630} />
      <Still
        id="blog-og"
        component={BlogOgImage}
        width={1200}
        height={630}
        defaultProps={defaultBlogProps}
      />
    </>
  );
};
