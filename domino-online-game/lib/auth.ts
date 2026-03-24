import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { signToken, verifyToken, AuthPayload } from './auth-jwt'

export async function getAuth(req?: NextRequest): Promise<AuthPayload | null> {
    let token: string | undefined

    if (req) {
        token = req.cookies.get('token')?.value
        if (!token) {
            const authHeader = req.headers.get('Authorization')
            if (authHeader?.startsWith('Bearer ')) {
                token = authHeader.substring(7)
            }
        }
    } else {
        const cookieStore = await cookies()
        token = cookieStore.get('token')?.value
    }

    if (!token) return null
    return verifyToken(token)
}

export async function setAuthCookie(payload: AuthPayload) {
    const token = await signToken(payload)
    const cookieStore = await cookies()

    cookieStore.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
    })

    return token
}

export async function removeAuthCookie() {
    const cookieStore = await cookies()
    cookieStore.delete('token')
}
