import bcrypt from 'bcryptjs';

async function testBcrypt() {
    const password = 'password';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log('Hash:', hash);
    const isMatch = await bcrypt.compare(password, hash);
    console.log('Match:', isMatch);
}

testBcrypt().catch(console.error);
