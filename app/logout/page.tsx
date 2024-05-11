'use client'

import {useEffect} from 'react';
import {signOut} from 'next-auth/react';

const LogoutPage = () => {

    useEffect(() => {
        signOut({redirect: false}).then(() => {
            window.location.href = '/login'; // Use router.push instead of router.replace for navigation
        });
    }, []);

    return (
        <div>
            Logging out...
        </div>
    );
};

export default LogoutPage;
