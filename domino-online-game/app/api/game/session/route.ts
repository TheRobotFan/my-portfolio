import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { ApiResponse, GameSession, DominoTile } from '@/lib/database-schema'

// Helper function to generate domino deck
function generateDeck(): DominoTile[] {
  const tiles: DominoTile[] = []
  let id = 0
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      tiles.push({
        id: `tile-${id++}`,
        left: i,
        right: j,
        isDouble: i === j,
      })
    }
  }
  return tiles
}

// Helper function to shuffle deck
function shuffleDeck(deck: DominoTile[]): DominoTile[] {
  const shuffled = [...deck]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// POST /api/game/session - Create new game session
export async function POST(request: NextRequest) {
  try {
    const { 
      mode, 
      players, 
      settings = {
        turnTimer: 30,
        rounds: 1,
        allowPowerUps: false,
        isPrivate: false,
        maxPlayers: 2,
      }
    } = await request.json()

    if (!mode || !players || players.length === 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Mode and players are required'
      }, { status: 400 })
    }

    // Generate and shuffle deck
    const deck = shuffleDeck(generateDeck())

    // Deal tiles to players
    const gamePlayers = players.map((player: any, index: number) => ({
      ...player,
      hand: deck.splice(0, 7), // Deal 7 tiles to each player
      isReady: true,
      connectedAt: new Date().toISOString(),
      lastActionAt: new Date().toISOString(),
    }))

    // Create game session
    const gameSession = await db.createGameSession({
      mode,
      status: 'waiting',
      players: gamePlayers,
      currentPlayerIndex: 0,
      board: [],
      boardEnds: { left: -1, right: -1 },
      deck,
      winner: null,
      turnTimer: settings.turnTimer || null,
      roundNumber: 1,
      scores: {},
      settings,
    })

    return NextResponse.json<ApiResponse<{ game: GameSession }>>({
      success: true,
      data: { game: gameSession },
      message: 'Game session created successfully'
    })

  } catch (error) {
    console.error('Create game session error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// GET /api/game/session - Get game session
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get('gameId')

    if (!gameId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Game ID is required'
      }, { status: 400 })
    }

    const gameSession = await db.getGameSession(gameId)
    if (!gameSession) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Game session not found'
      }, { status: 404 })
    }

    return NextResponse.json<ApiResponse<{ game: GameSession }>>({
      success: true,
      data: { game: gameSession }
    })

  } catch (error) {
    console.error('Get game session error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// PUT /api/game/session - Update game session
export async function PUT(request: NextRequest) {
  try {
    const { gameId, action, data } = await request.json()

    if (!gameId || !action) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Game ID and action are required'
      }, { status: 400 })
    }

    const gameSession = await db.getGameSession(gameId)
    if (!gameSession) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Game session not found'
      }, { status: 404 })
    }

    let updatedSession = gameSession

    switch (action) {
      case 'start':
        if (gameSession.status === 'waiting') {
          const startResult = await db.updateGameSession(gameId, {
            status: 'playing',
            startedAt: new Date().toISOString(),
          })
          if (startResult) updatedSession = startResult
        }
        break

      case 'play_tile':
        const { tileId, end, userId } = data
        if (!tileId || !end || !userId) {
          return NextResponse.json<ApiResponse>({
            success: false,
            error: 'Tile ID, end, and user ID are required'
          }, { status: 400 })
        }

        // Find current player and tile
        const currentPlayerIndex = gameSession.players.findIndex(p => p.userId === userId)
        if (currentPlayerIndex !== gameSession.currentPlayerIndex) {
          return NextResponse.json<ApiResponse>({
            success: false,
            error: 'Not your turn'
          }, { status: 400 })
        }

        const currentPlayer = gameSession.players[currentPlayerIndex]
        const tileIndex = currentPlayer.hand.findIndex((t: DominoTile) => t.id === tileId)
        
        if (tileIndex === -1) {
          return NextResponse.json<ApiResponse>({
            success: false,
            error: 'Tile not in hand'
          }, { status: 400 })
        }

        const tile = currentPlayer.hand[tileIndex]
        const newBoard = [...gameSession.board]
        let newBoardEnds = { ...gameSession.boardEnds }
        let newPlayers = [...gameSession.players]

        // Remove tile from player's hand
        newPlayers[currentPlayerIndex] = {
          ...currentPlayer,
          hand: currentPlayer.hand.filter((_, index) => index !== tileIndex),
          lastActionAt: new Date().toISOString(),
        }

        // Add tile to board
        if (gameSession.board.length === 0) {
          newBoard.push({
            tileId,
            tile,
            position: 0,
            rotation: 0,
            playedBy: userId,
            playedAt: new Date().toISOString(),
          })
          newBoardEnds = { left: tile.left, right: tile.right }
        } else {
          const targetEnd = end === 'left' ? newBoardEnds.left : newBoardEnds.right
          const playedTile = { ...tile }
          
          if (end === 'left') {
            if (tile.right === targetEnd) {
              newBoardEnds.left = tile.left
            } else if (tile.left === targetEnd) {
              newBoardEnds.left = tile.right
            }
            newBoard.unshift({
              tileId,
              tile: playedTile,
              position: -newBoard.length,
              rotation: 0,
              playedBy: userId,
              playedAt: new Date().toISOString(),
            })
          } else {
            if (tile.left === targetEnd) {
              newBoardEnds.right = tile.right
            } else if (tile.right === targetEnd) {
              newBoardEnds.right = tile.left
            }
            newBoard.push({
              tileId,
              tile: playedTile,
              position: newBoard.length,
              rotation: 0,
              playedBy: userId,
              playedAt: new Date().toISOString(),
            })
          }
        }

        // Check for winner
        const winner = newPlayers[currentPlayerIndex].hand.length === 0 ? userId : null
        const nextPlayerIndex = (currentPlayerIndex + 1) % gameSession.players.length

        const playResult = await db.updateGameSession(gameId, {
          board: newBoard,
          boardEnds: newBoardEnds,
          players: newPlayers,
          currentPlayerIndex: nextPlayerIndex,
          winner,
          status: winner ? 'finished' : 'playing',
          finishedAt: winner ? new Date().toISOString() : undefined,
        })
        if (playResult) updatedSession = playResult
        break

      case 'draw_tile':
        const { userId: drawUserId } = data
        if (!drawUserId) {
          return NextResponse.json<ApiResponse>({
            success: false,
            error: 'User ID is required'
          }, { status: 400 })
        }

        if (gameSession.deck.length === 0) {
          return NextResponse.json<ApiResponse>({
            success: false,
            error: 'Deck is empty'
          }, { status: 400 })
        }

        const drawPlayerIndex = gameSession.players.findIndex(p => p.userId === drawUserId)
        if (drawPlayerIndex !== gameSession.currentPlayerIndex) {
          return NextResponse.json<ApiResponse>({
            success: false,
            error: 'Not your turn'
          }, { status: 400 })
        }

        const drawnTile = gameSession.deck[0]
        const newDeck = gameSession.deck.slice(1)
        const drawPlayer = gameSession.players[drawPlayerIndex]

        const drawResult = await db.updateGameSession(gameId, {
          deck: newDeck,
          players: gameSession.players.map((p, index) =>
            index === drawPlayerIndex
              ? { ...p, hand: [...p.hand, drawnTile], lastActionAt: new Date().toISOString() }
              : p
          ),
        })
        if (drawResult) updatedSession = drawResult
        break

      case 'next_turn':
        const nextIndex = (gameSession.currentPlayerIndex + 1) % gameSession.players.length
        const nextTurnResult = await db.updateGameSession(gameId, {
          currentPlayerIndex: nextIndex,
          turnTimer: gameSession.settings.turnTimer || null,
        })
        if (nextTurnResult) updatedSession = nextTurnResult
        break

      case 'pause':
        const pauseResult = await db.updateGameSession(gameId, {
          status: 'paused',
        })
        if (pauseResult) updatedSession = pauseResult
        break

      case 'resume':
        const resumeResult = await db.updateGameSession(gameId, {
          status: 'playing',
        })
        if (resumeResult) updatedSession = resumeResult
        break

      default:
        return NextResponse.json<ApiResponse>({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }

    return NextResponse.json<ApiResponse<{ game: GameSession }>>({
      success: true,
      data: { game: updatedSession },
      message: 'Game session updated successfully'
    })

  } catch (error) {
    console.error('Update game session error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// DELETE /api/game/session - Delete game session
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get('gameId')

    if (!gameId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Game ID is required'
      }, { status: 400 })
    }

    const deleted = await db.deleteGameSession(gameId)
    if (!deleted) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Game session not found'
      }, { status: 404 })
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Game session deleted successfully'
    })

  } catch (error) {
    console.error('Delete game session error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
