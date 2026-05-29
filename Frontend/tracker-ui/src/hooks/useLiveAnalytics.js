import { useEffect, useState } from 'react';
import { getEcho } from '../lib/echo';

/**
 * useLiveAnalytics
 * Listens on the public `fitness-live` WebSocket channel
 * for real-time `WORKOUT_UPDATED` events to update dashboard stats.
 */
export default function useLiveAnalytics() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const echo = getEcho();
        if (!echo) return;

        const channel = echo.channel('fitness-live')
            .listen('.WORKOUT_UPDATED', (event) => {
                console.log('Live analytics update received:', event.payload);
                setStats(event.payload);
            });

        return () => {
            try {
                channel.stopListening('.WORKOUT_UPDATED');
            } catch (err) {
                // noop
            }
        };
    }, []);

    return stats;
}
