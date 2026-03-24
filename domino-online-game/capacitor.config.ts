
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.dominion.elite.domino',
    appName: 'Dominion: Elite Domino',
    webDir: 'public', // We use 'public' or 'out' depending on build strategy. For wrapper, we might not use this much if bundled with URL.
    server: {
        // REPLACE THIS WITH YOUR DEPLOYED NEXT.JS APP URL (e.g. https://your-project.vercel.app)
        // For local development on Android Emulator, use 'http://10.0.2.2:3000'
        url: 'http://10.0.2.2:3000',
        cleartext: true
    },
    android: {
        buildOptions: {
            keystorePassword: 'android',
            keystoreAlias: 'androiddebugkey',
        }
    }
};

export default config;
