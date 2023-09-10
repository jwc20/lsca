/** @type {import('next').NextConfig} */


// ignore linting and typechecking during build
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
}



module.exports = nextConfig
