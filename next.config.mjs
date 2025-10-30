import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
  reactStrictMode: true,
  images: {
    domains: ["books.google.com"],
  },
});
