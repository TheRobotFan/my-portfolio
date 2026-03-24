import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { ApiResponse, ShopItem } from '@/lib/database-schema'

// GET /api/shop/items - Get shop items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'tile_skin' | 'avatar_skin' | 'table_skin' | 'power_up'
    const rarity = searchParams.get('rarity') // 'common' | 'rare' | 'epic' | 'legendary'

    let items = await db.getShopItems(type || undefined)

    // Filter by rarity if specified
    if (rarity) {
      items = items.filter(item => item.rarity === rarity)
    }

    // Group items by type
    const groupedItems = items.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = []
      }
      acc[item.type].push(item)
      return acc
    }, {} as Record<string, ShopItem[]>)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        items: groupedItems,
        totalItems: items.length,
      }
    })

  } catch (error) {
    console.error('Get shop items error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
