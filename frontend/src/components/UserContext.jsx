// src/components/UserContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Estado de carga

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false); // Estado de carga completado
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};



// import React, { createContext, useState } from 'react';

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//     const [user, setUser] = useState(null);

//     return (
//         <UserContext.Provider value={{ user, setUser }}>
//             {children}
//         </UserContext.Provider>
//     );
// };