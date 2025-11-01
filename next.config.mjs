function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "books.google.com",
      },
    ],
  },
});
