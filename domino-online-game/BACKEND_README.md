# Dominion: Elite Domino - Backend Documentation

## Overview

This backend provides a complete API and real-time multiplayer system for **Dominion: Elite Domino**. It includes user management, game sessions, matchmaking, ranking system, shop functionality, and WebSocket-based real-time communication.

## Architecture

### Database Schema (`lib/database-schema.ts`)

Complete TypeScript interfaces defining all data structures:
- **User Management**: User, UserStats, RankedData, Inventory
- **Game System**: GameSession, GamePlayer, DominoTile, PlayedTile
- **Multiplayer**: Room, MatchmakingQueue, RoomPlayer
- **Economy**: ShopItem, Transaction, PowerUpUsage
- **Social**: Achievement, LeaderboardEntry, GameHistory

### In-Memory Database (`lib/database.ts`)

For development purposes, uses an in-memory database implementation. In production, replace with PostgreSQL/MySQL/MongoDB.

**Features:**
- Full CRUD operations for all entities
- Automatic data initialization for new users
- Shop items with pricing and rarity
- Cleanup of expired data
- Relationship management between entities

## API Routes

### Authentication (`/api/auth/`)

#### POST `/api/auth/register`
Register a new user account.
```json
{
  "username": "Player123",
  "email": "player@example.com",
  "password": "securepassword"
}
```

#### POST `/api/auth/login`
Login with username and password.
```json
{
  "username": "Player123",
  "password": "securepassword"
}
```

#### POST `/api/auth/guest`
Create a guest account (no password required).
```json
{
  "username": "GuestPlayer"
}
```

### User Management (`/api/user/`)

#### GET `/api/user/profile?userId={id}`
Get complete user profile including stats, ranked data, and inventory.

#### PUT `/api/user/profile`
Update user profile.
```json
{
  "userId": "user123",
  "username": "NewName",
  "avatar": "ninja"
}
```

#### GET `/api/user/stats?userId={id}`
Get user statistics and performance metrics.

#### POST `/api/user/stats`
Update user statistics after a game.
```json
{
  "userId": "user123",
  "gameResult": "win",
  "mode": "ranked",
  "opponentElo": 1050,
  "pointsEarned": 50,
  "duration": 300,
  "gameId": "game456"
}
```

### Game Sessions (`/api/game/session`)

#### POST `/api/game/session`
Create a new game session.
```json
{
  "mode": "multiplayer",
  "players": [
    {
      "userId": "user123",
      "username": "Player1",
      "avatar": "default"
    }
  ],
  "settings": {
    "turnTimer": 30,
    "allowPowerUps": true
  }
}
```

#### GET `/api/game/session?gameId={id}`
Get game session details.

#### PUT `/api/game/session`
Update game session (play tile, draw tile, etc.).
```json
{
  "gameId": "game456",
  "action": "play_tile",
  "data": {
    "tileId": "tile789",
    "end": "left",
    "userId": "user123"
  }
}
```

**Available Actions:**
- `start` - Start the game
- `play_tile` - Play a domino tile
- `draw_tile` - Draw a tile from deck
- `next_turn` - Pass turn to next player
- `pause` - Pause the game
- `resume` - Resume the game

### Shop (`/api/shop/`)

#### GET `/api/shop/items`
Get available shop items.
- Query params: `type` (item type), `rarity` (item rarity)

#### POST `/api/shop/purchase`
Purchase an item.
```json
{
  "userId": "user123",
  "itemId": "midnight",
  "itemType": "tile_skin"
}
```

### Matchmaking (`/api/matchmaking`)

#### POST `/api/matchmaking`
Join matchmaking queue.
```json
{
  "userId": "user123",
  "mode": "ranked",
  "preferences": {
    "turnTimer": 30,
    "allowPowerUps": false
  }
}
```

#### GET `/api/matchmaking?userId={id}`
Get matchmaking status.

#### DELETE `/api/matchmaking?userId={id}`
Cancel matchmaking.

### Rooms (`/api/rooms/`)

#### GET `/api/rooms`
Get available rooms.
- Query params: `limit`, `includePrivate`

#### POST `/api/rooms`
Create a new room.
```json
{
  "userId": "user123",
  "name": "My Room",
  "isPrivate": false,
  "settings": {
    "turnTimer": 30,
    "allowPowerUps": true
  }
}
```

#### GET `/api/rooms/{roomId}`
Get specific room details.

#### PUT `/api/rooms/{roomId}`
Update room (join, leave, ready, start game).
```json
{
  "userId": "user123",
  "action": "join",
  "data": {
    "password": "secret123"
  }
}
```

#### DELETE `/api/rooms/{roomId}`
Delete room (host only).

### Leaderboard (`/api/leaderboard`)

#### GET `/api/leaderboard`
Get leaderboard rankings.
- Query params: `mode` (elo/wins/win_rate), `limit`, `offset`, `userId`

## Real-time Multiplayer (WebSocket)

### WebSocket Server (`lib/websocket-server.ts`)

Complete Socket.IO implementation for real-time gameplay.

**Events:**
- `authenticate` - User authentication
- `join_room` / `leave_room` - Room management
- `toggle_ready` - Toggle ready status
- `game_action` - In-game actions
- `start_matchmaking` / `cancel_matchmaking` - Matchmaking

**Game Actions:**
- `play_tile` - Play a domino
- `draw_tile` - Draw from deck
- `pass_turn` - Pass turn
- `use_power_up` - Use power-up

### WebSocket Client (`lib/websocket-client.ts`)

TypeScript client for frontend integration.

**Usage:**
```typescript
import wsClient from '@/lib/websocket-client'

// Connect
wsClient.connect()

// Authenticate
wsClient.authenticate('user123')

// Join room
wsClient.joinRoom('room456', 'password')

// Play tile
wsClient.playTile('game789', 'tile123', 'left')

// Listen for events
wsClient.onGameUpdate((data) => {
  console.log('Game updated:', data)
})
```

## HTTP API Client (`lib/api-client.ts`)

Convenient TypeScript client for all API endpoints.

**Usage:**
```typescript
import apiClient from '@/lib/api-client'

// Register user
const result = await apiClient.register('Player123', 'email@example.com', 'password')

// Get user profile
const profile = await apiClient.getUserProfile('user123')

// Start matchmaking
const match = await apiClient.startMatchmaking('user123', 'ranked')
```

## Game Logic

### Domino Rules Implementation

1. **Deck Generation**: Standard 28-tile domino set (0-0 to 6-6)
2. **Tile Validation**: Ensures played tiles match board ends
3. **Turn Management**: Handles turn order and timers
4. **Win Conditions**: First player to empty hand wins
5. **Drawing**: Players can draw from deck when no valid moves

### ELO Rating System

- **K-factor**: 32 (standard for competitive games)
- **Expected Score**: `1 / (1 + 10^((opponentElo - playerElo) / 400))`
- **Rank Tiers**: Bronze → Silver → Gold → Platinum → Diamond → Master → Grandmaster
- **Tier Division**: Each rank has 3 tiers (1, 2, 3)

### Matchmaking Algorithm

1. **ELO-based Matching**: Matches players within 200 ELO points
2. **Mode Separation**: Ranked and casual queues are separate
3. **Wait Time Estimation**: Based on current queue size
4. **Immediate Matching**: If suitable opponent found instantly

## Shop System

### Item Types

- **Tile Skins**: Visual customization for domino tiles
- **Avatar Skins**: Player avatar customization
- **Table Skins**: Game table backgrounds
- **Power-ups**: Temporary gameplay advantages

### Rarity System

- **Common**: Basic items, low price
- **Rare**: Better items, moderate price
- **Epic**: Premium items, high price
- **Legendary**: Best items, very high price

### Economy

- **Coins**: Primary currency from gameplay
- **Gems**: Premium currency for special items
- **Daily Rewards**: Login bonuses and achievements
- **Transaction History**: Complete purchase records

## Production Deployment

### Database Migration

Replace in-memory database with persistent storage:

```typescript
// Example PostgreSQL implementation
import { Pool } from 'pg'

export class PostgreSQLDatabase {
  private pool: Pool

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL
    })
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'lastLoginAt'>): Promise<User> {
    const query = `
      INSERT INTO users (username, email, password_hash, avatar, level, xp, xp_to_next_level, is_online, is_guest)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `
    // ... implementation
  }
}
```

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/domino

# API
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_WS_URL=https://your-domain.com

# Security
JWT_SECRET=your-secret-key
BCRYPT_ROUNDS=12

# Redis (for session storage)
REDIS_URL=redis://localhost:6379
```

### Security Considerations

1. **Authentication**: Replace simple hash with bcrypt/JWT
2. **Rate Limiting**: Implement API rate limiting
3. **Input Validation**: Sanitize all user inputs
4. **CORS**: Configure proper CORS policies
5. **HTTPS**: Use SSL/TLS in production

## Testing

### API Testing

Use the provided API client or tools like Postman:

```bash
# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'

# Test game session creation
curl -X POST http://localhost:3000/api/game/session \
  -H "Content-Type: application/json" \
  -d '{"mode":"single","players":[{"userId":"user123","username":"Test","avatar":"default"}]}'
```

### WebSocket Testing

Use Socket.IO client or browser dev tools:

```javascript
const socket = io('http://localhost:3000')
socket.emit('authenticate', { userId: 'user123' })
socket.on('authenticated', (data) => console.log(data))
```

## Performance Optimization

### Database Indexing

```sql
-- Essential indexes for performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_game_sessions_status ON game_sessions(status);
CREATE INDEX idx_matchmaking_queue_mode ON matchmaking_queue(mode, elo);
CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);
```

### Caching Strategy

- **Redis**: Session storage and real-time data
- **CDN**: Static assets and shop images
- **Application Cache**: Leaderboard and shop items

### Scaling

- **Horizontal Scaling**: Multiple game server instances
- **Load Balancer**: Distribute WebSocket connections
- **Database Replication**: Read replicas for leaderboards
- **Message Queue**: Handle matchmaking queue processing

## Monitoring

### Key Metrics

- **Active Users**: Concurrent players
- **Game Duration**: Average game length
- **Matchmaking Time**: Queue wait times
- **API Response Times**: Endpoint performance
- **Error Rates**: Failed requests and disconnections

### Logging

```typescript
// Structured logging example
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'game.log' })
  ]
})

logger.info('Game session created', { gameId, mode, players: playerCount })
```

## 🚀 Strategic AAA Mobile Roadmap

To transform this foundation into the **Dominion: Elite Domino** AAA competitive platform, the following strategic pillars will be implemented:

### 1. ⚖️ Legal & Compliance Framework
- **Geo-Fencing API**: Service to enable/disable skill-based wagering (Coins entry) based on IP location.
- **AML Monitoring**: Backend audit logs for suspicious currency transfers and chip-dumping detection.
- **GDPR/COPPA Data Service**: Automated data deletion and minor-protection toggles.

### 2. 🛡️ Professional Integrity (Anti-Cheat)
- **100% Server-Side Authority**: Transitioning all game logic (deck shuffle, move validation) to the server.
- **Anti-Teaming Engine**: Statistical analysis of player moves to detect collusion in FFA rooms.
- **Input Cadence Analysis**: Biometric-based bot detection to identify count-assist software.

### 3. 📈 Professional Live Ops
- **Dynamic Event Scheduler**: Backend service for Flash Events (Double XP, Happy Hours).
- **Seasonal Battle Pass Engine**: Tier-based reward unlocking with XP scaling and premium tracks.
- **Limited Time Mode (LTM) Manager**: System to toggle varied game rules (Speed Domino, Ghost Tiles) without app updates.

### 4. 🤝 Community & Social Ecosystem
- **Moderated Global Chat**: Real-time channel management with automated toxicity filtering.
- **Club/Clan War Infrastructure**: Dedicated clan leaderboards, shared banks, and weekly logic for Clan vs Clan matches.
- **Spectator "Park" Mode**: Allowing high-concurrency spectators with low-latency state sync.

### 📱 Technical Optimization
- **Graceful Reconnection (GR)**: State synchronization that allows players to resume a match in <1s after a network drop.
- **Regional Sharding**: Multi-region server clusters to ensure <50ms latency for global competitive play.
- **Asset Deep-Linking**: Implementation of branch.io or similar for seamless clan/room invites.

## Support

For issues or questions:
1. Check the API documentation above
2. Review the code comments
3. Test with the provided examples
4. Check browser console for WebSocket errors
5. Verify API responses in network tab

This backend provides a complete foundation for a scalable multiplayer domino game with all modern gaming features.
