// src/components/UserContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:3000/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(res => res.json())
                .then(data => {
                    if (data.user) {
                        console.log("User data fetched:", data.user); // Agregar log
                        setUser(data.user);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching user:', err);
                    localStorage.removeItem('token');
                    setLoading(false);
                    navigate('/login');
                });
        } else {
            setLoading(false);
        }
    }, [navigate]);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};





// export const UserProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     const fetchUserData = async (token) => {
//         const res = await fetch('http://localhost:3000/api/auth/me', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//             },
//         });

//         if (res.ok) {
//             const data = await res.json();
//             setUser(data.user);
//         } else {
//             throw new Error(`Error fetching user: ${res.status}`);
//         }
//     };

//     const fetchUser = async () => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             try {
//                 await fetchUserData(token);
//             } catch (err) {
//                 console.error('Error fetching user:', err);
//                 localStorage.removeItem('token');
//                 navigate('/login');
//             } finally {
//                 setLoading(false);
//             }
//         } else {
//             setLoading(false);
//             navigate('/login');
//         }
//     };

//     useEffect(() => {
//         fetchUser();

//         const renewInterval = setInterval(async () => {
//             try {
//                 await renewAuthToken();
//             } catch (err) {
//                 console.error('Error renewing token:', err);
//                 localStorage.removeItem('token');
//                 navigate('/login');
//             }
//         }, 14 * 60 * 1000); // 14 minutos

//         return () => clearInterval(renewInterval);
//     }, [navigate]);

//     return (
//         <UserContext.Provider value={{ user, setUser, loading }}>
//             {children}
//         </UserContext.Provider>
//     );
// };













// export const UserProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     const fetchUser = async (retry = true) => {
//         const token = localStorage.getItem('token');
//         const refreshToken = localStorage.getItem('refreshToken');
//         if (token) {
//             try {
//                 const response = await fetch('http://localhost:3000/api/auth/me', {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${token}`,
//                     },
//                 });

//                 if (response.status === 401 && retry && refreshToken) {
//                     console.log('Token expired, attempting to refresh token...');
//                     const refreshResponse = await fetch('http://localhost:3000/api/auth/refresh-token', {
//                         method: 'POST',
//                         headers: { 'Content-Type': 'application/json' },
//                         body: JSON.stringify({ refreshToken })
//                     });

//                     if (refreshResponse.ok) {
//                         const refreshData = await refreshResponse.json();
//                         localStorage.setItem('token', refreshData.accessToken);
//                         await fetchUser(false);
//                     } else {
//                         throw new Error('Unable to refresh token');
//                     }
//                 } else if (response.ok) {
//                     const data = await response.json();
//                     setUser(data.user);
//                 } else {
//                     throw new Error('Error fetching user');
//                 }
//             } catch (err) {
//                 console.error('Error fetching user:', err);
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('refreshToken');
//                 navigate('/login');
//             } finally {
//                 setLoading(false);
//             }
//         } else {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchUser();
//     }, [navigate]);

//     return (
//         <UserContext.Provider value={{ user, setUser, loading }}>
//             {children}
//         </UserContext.Provider>
//     );
// };










    // const fetchUserData = async (token) => {
    //     const res = await fetch('http://localhost:3000/api/auth/me', {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //         },
    //     });

    //     if (res.ok) {
    //         const data = await res.json();
    //         setUser(data.user);
    //     } else {
    //         throw new Error(`Error fetching user: ${res.status}`);
    //     }
    // };


    // const fetchUser = async () => {
    //     const token = localStorage.getItem('token');
    //     if (token) {
    //         try {
    //             await fetchUserData(token);
    //         } catch (err) {
    //             console.error('Error fetching user:', err);
    //             if (err.message.includes('401')) {
    //                 console.log('Token expired, attempting to refresh token...');

    //                 console.error('Error refreshing token');
    //                 localStorage.removeItem('token');
    //                 navigate('/login');
                    
    //             } else {
    //                 localStorage.removeItem('token');
    //                 navigate('/login');
    //             }
    //         } finally {
    //             setLoading(false);
    //         }
    //     } else {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     fetchUser();
    // }, [navigate]);



// export const UserProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     const fetchUser = async (retry = true) => {
//         const token = localStorage.getItem('token');
//         const refreshToken = localStorage.getItem('refreshToken');
//         if (token) {
//             try {
//                 const res = await fetch('http://localhost:3000/api/auth/me', {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${token}`,
//                     },
//                 });

//                 if (res.status === 401 && retry && refreshToken) {
//                     console.log('Token expired, attempting to refresh token...');
//                     const refreshResponse = await fetch('http://localhost:3000/auth/refresh-token', {
//                         method: 'POST',
//                         headers: { 'Content-Type': 'application/json' },
//                         body: JSON.stringify({ refreshToken })
//                     });

//                     if (refreshResponse.ok) {
//                         const refreshData = await refreshResponse.json();
//                         localStorage.setItem('token', refreshData.accessToken);
//                         await fetchUser(false);
//                     } else {
//                         throw new Error('Unable to refresh token');
//                     }
//                 } else if (res.ok) {
//                     const data = await res.json();
//                     setUser(data.user);
//                 } else {
//                     throw new Error('Error fetching user');
//                 }
//             } catch (err) {
//                 console.error('Error fetching user:', err);
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('refreshToken');
//                 navigate('/login');
//             } finally {
//                 setLoading(false);
//             }
//         } else {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchUser();
//     }, [navigate]);

//     return (
//         <UserContext.Provider value={{ user, setUser, loading }}>
//             {children}
//         </UserContext.Provider>
//     );
// };


