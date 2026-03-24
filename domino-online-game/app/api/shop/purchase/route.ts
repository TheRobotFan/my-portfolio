import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { ApiResponse } from '@/lib/database-schema'

// POST /api/shop/purchase - Purchase item
export async function POST(request: NextRequest) {
  try {
    const { userId, itemId, itemType } = await request.json()

    if (!userId || !itemId || !itemType) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User ID, item ID, and item type are required'
      }, { status: 400 })
    }

    // Get user and inventory
    const [user, inventory, shopItem] = await Promise.all([
      db.getUserById(userId),
      db.getInventory(userId),
      db.getShopItem(itemId)
    ])

    if (!user || !inventory) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    if (!shopItem) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Item not found'
      }, { status: 404 })
    }

    if (shopItem.type !== itemType) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Item type mismatch'
      }, { status: 400 })
    }

    // Check if user already owns the item (for skins)
    if (itemType !== 'power_up') {
      const alreadyOwned = 
        (itemType === 'tile_skin' && inventory.tileSkins.includes(itemId)) ||
        (itemType === 'avatar_skin' && inventory.avatarSkins.includes(itemId)) ||
        (itemType === 'table_skin' && inventory.tableSkins.includes(itemId))

      if (alreadyOwned) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: 'Item already owned'
        }, { status: 400 })
      }
    }

    // Check if user has enough currency
    const userCurrency = shopItem.currency === 'gems' ? inventory.gems : inventory.coins
    if (userCurrency < shopItem.price) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: `Insufficient ${shopItem.currency}`
      }, { status: 400 })
    }

    // Process purchase
    let updatedInventory = { ...inventory }
    
    // Deduct currency
    if (shopItem.currency === 'gems') {
      updatedInventory.gems -= shopItem.price
    } else {
      updatedInventory.coins -= shopItem.price
    }

    // Add item to inventory
    if (itemType === 'tile_skin') {
      updatedInventory.tileSkins = [...updatedInventory.tileSkins, itemId]
    } else if (itemType === 'avatar_skin') {
      updatedInventory.avatarSkins = [...updatedInventory.avatarSkins, itemId]
    } else if (itemType === 'table_skin') {
      updatedInventory.tableSkins = [...updatedInventory.tableSkins, itemId]
    } else if (itemType === 'power_up') {
      updatedInventory.powerUps = {
        ...updatedInventory.powerUps,
        [itemId]: (updatedInventory.powerUps[itemId] || 0) + 1,
      }
    }

    // Update inventory
    await db.updateInventory(userId, updatedInventory)

    // Create transaction record
    await db.createTransaction({
      userId,
      type: 'purchase',
      amount: -shopItem.price,
      currency: shopItem.currency,
      itemId,
      itemType,
      description: `Purchased ${shopItem.name}`,
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        item: shopItem,
        newBalance: {
          coins: updatedInventory.coins,
          gems: updatedInventory.gems,
        },
        inventory: updatedInventory,
      },
      message: 'Purchase successful'
    })

  } catch (error) {
    console.error('Purchase error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
