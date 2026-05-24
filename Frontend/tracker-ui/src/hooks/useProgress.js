import { useState } from 'react';

export const useProgress = () => {
    const [progress, setProgress] = useState(null);

    const fetchProgress = async () => {
        // API call to fetch progress stats
    };

    return { progress, fetchProgress };
};
