import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient | null }
if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = null
}

export const getPrisma = () => {
    if (globalForPrisma.prisma) return globalForPrisma.prisma

    const dbUrl = "postgresql://neondb_owner:npg_4N1eXPtCSTOA@ep-delicate-dream-ag5rgw5s-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

    // Force set it in env cast to any to be sure
    process.env.DATABASE_URL = dbUrl

    console.log('PRISMA_INIT: Forcing DATABASE_URL and creating client')

    try {
        const client = new PrismaClient({
            log: ['query', 'error', 'warn'],
        })

        if (process.env.NODE_ENV !== 'production') {
            globalForPrisma.prisma = client
        }
        return client
    } catch (err: any) {
        console.error('CRITICAL: PrismaClient instantiation failed even with forced ENV!', err.message)
        throw err
    }
}
