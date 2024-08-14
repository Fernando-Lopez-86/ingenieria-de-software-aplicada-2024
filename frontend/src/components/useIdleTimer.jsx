import { useEffect } from 'react';

const useIdleTimer = (onIdle, timeout) => {
    useEffect(() => {
        const handleActivity = () => {
            clearTimeout(idleTimer);
            idleTimer = setTimeout(onIdle, timeout);
        };

        let idleTimer = setTimeout(onIdle, timeout);

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);

        return () => {
            clearTimeout(idleTimer);
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
        };
    }, [onIdle, timeout]);
};

export default useIdleTimer;