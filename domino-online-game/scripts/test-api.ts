async function testApi() {
    const url = 'http://localhost:3005/api/auth/login';
    console.log(`Testing POST ${url}...`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'test', password: 'password' }),
        });

        console.log(`Status: ${response.status} ${response.statusText}`);
        const text = await response.text();
        console.log(`\n--- Response Body Start ---\n`);
        console.log(text.substring(0, 5000));
        console.log(`\n--- Response Body End ---\n`);

        try {
            const json = JSON.parse(text);
            console.log('JSON parsed successfully:', json);
        } catch (e) {
            console.log('Failed to parse JSON. Response is not JSON.');
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testApi();
