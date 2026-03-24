import { NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET() {
    try {
        const events = await db.getActiveEvents()
        return NextResponse.json({ success: true, data: events })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch active events' },
            { status: 500 }
        )
    }
}
