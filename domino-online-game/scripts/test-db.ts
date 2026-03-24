import 'dotenv/config';
import { db } from '../lib/database';

async function testDb() {
    console.log('Testing db.getUserByUsername...');
    try {
        const user = await db.getUserByUsername('test');
        console.log('User result (should be null if not found, but not throw):', user);
    } catch (error: any) {
        console.error('DB Error:', error.message || error);
        if (error.stack) console.error(error.stack);
    }
}

testDb().catch(console.error);
