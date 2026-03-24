/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
    },
    async headers() {
        return [
            {
                source: '/Abdel_CV.pdf',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/pdf',
                    },
                    {
                        key: 'Content-Disposition',
                        value: 'attachment; filename="Abdel_CV.pdf"',
                    },
                ],
            },
            {
                source: '/Abdel_CV_IT.pdf',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/pdf',
                    },
                    {
                        key: 'Content-Disposition',
                        value: 'attachment; filename="Abdel_CV_IT.pdf"',
                    },
                ],
            },
        ]
    },
}

module.exports = nextConfig
