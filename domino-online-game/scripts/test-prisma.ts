import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Testing Prisma connection...')
        const userCount = await prisma.user.count()
        console.log('User count:', userCount)
    } catch (error) {
        console.error('Prisma test failed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
