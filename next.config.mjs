/** @type {import('next').NextConfig} */
const urlPrefix = '/vts-control'

const nextConfig = {
    assetPrefix: urlPrefix,
    basePath: urlPrefix,
    trailingSlash: true
};

export default nextConfig;
