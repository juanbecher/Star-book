function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
  reactStrictMode: true,
  images: {
    domains: ["books.google.com"],
  },
});
