export const shareToFacebook = (id: string) => {
  const url = `https://qhs-website.vercel.app/blog/${id}`;
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    "_blank"
  );
};
