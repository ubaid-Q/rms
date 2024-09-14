/** @type {import('next').NextConfig} */
module.exports = {
  pageExtensions: ["jsx", "js", "tsx"],
  trailingSlash: true,
  output: "standalone",
  outputFileTracing: true,
  images: { remotePatterns: [{ hostname: "*" }], unoptimized: true },
  webpack: (config, { dev, isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};
