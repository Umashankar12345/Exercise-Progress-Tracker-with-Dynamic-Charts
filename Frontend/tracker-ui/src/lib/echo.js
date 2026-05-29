import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { getBackendHost } from '../api/axios';

window.Pusher = Pusher;

const key = import.meta.env.VITE_REVERB_APP_KEY;
const host = import.meta.env.VITE_REVERB_HOST;

let echoInstance = null;

if (key && host) {
    const token = localStorage.getItem('auth_token');
    const wsHost = (host === '127.0.0.1' || host === 'localhost') && typeof window !== 'undefined'
        ? window.location.hostname 
        : host;

    echoInstance = new Echo({
        broadcaster: 'reverb',
        key: key,
        wsHost: wsHost,
        wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
        wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
        authEndpoint: `${getBackendHost()}/api/broadcasting/auth`,
        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            }
        }
    });
    window.Echo = echoInstance;
} else {
    // Mock instance to prevent Pusher/Echo errors on build/Vercel
    echoInstance = {
        private: () => ({
            listen: function() { return this; },
            stopListening: function() { return this; }
        }),
        channel: () => ({
            listen: function() { return this; },
            stopListening: function() { return this; }
        }),
        leave: () => {},
        disconnect: () => {}
    };
    window.Echo = echoInstance;
}

/**
 * getEcho
 * Returns the global Echo instance or the safe mock object.
 * Automatically synchronizes the latest JWT token in headers.
 */
export const getEcho = () => {
    if (key && host && echoInstance) {
        const token = localStorage.getItem('auth_token');
        if (echoInstance.connector && echoInstance.connector.options) {
            echoInstance.connector.options.auth.headers.Authorization = `Bearer ${token}`;
        }
    }
    return echoInstance;
};
