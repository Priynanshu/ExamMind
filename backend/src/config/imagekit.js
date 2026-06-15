import ImageKit from "imagekit";

// Initialize ImageKit for cloud image storage
let imagekitInstance = null;

const initImageKit = () => {
  if (!process.env.IMAGEKIT_PUBLIC_KEY) {
    console.warn("⚠️ ImageKit credentials not set");
    return;
  }

  imagekitInstance = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });

};

const getImageKit = () => imagekitInstance;

export { initImageKit, getImageKit };
