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


// import { useEffect, useRef } from 'react';

// const useIdleTimer = (onIdle, timeout) => {
//     const timerRef = useRef(null);

//     useEffect(() => {
//         const resetTimer = () => {
//             if (timerRef.current) {
//                 clearTimeout(timerRef.current);
//             }
//             timerRef.current = setTimeout(onIdle, timeout);
//         };

//         const handleActivity = () => {
//             resetTimer();
//         };

//         window.addEventListener('mousemove', handleActivity);
//         window.addEventListener('keypress', handleActivity);
//         window.addEventListener('scroll', handleActivity);
//         window.addEventListener('click', handleActivity);

//         resetTimer();

//         return () => {
//             clearTimeout(timerRef.current);
//             window.removeEventListener('mousemove', handleActivity);
//             window.removeEventListener('keypress', handleActivity);
//             window.removeEventListener('scroll', handleActivity);
//             window.removeEventListener('click', handleActivity);
//         };
//     }, [onIdle, timeout]);

//     return null;
// };

// export default useIdleTimer;