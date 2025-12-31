export const shareToFacebook = (blogId: string) => {
  const blogUrl = `${window.location.origin}/blog/${blogId}`;

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${blogUrl}`;

  window.open(facebookShareUrl, "_blank", "noopener,noreferrer");
};
