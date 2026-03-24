import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'dominion_secret_key_change_in_production'
)

export interface AuthPayload {
    userId: string
    username: string
    isGuest: boolean
}

export async function signToken(payload: AuthPayload): Promise<string> {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(secret)
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
    try {
        const { payload } = await jwtVerify(token, secret)
        return payload as unknown as AuthPayload
    } catch (error) {
        return null
    }
}
