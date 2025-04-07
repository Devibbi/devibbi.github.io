"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { UserCheck, LogIn } from 'lucide-react';

const ClientLoginButton = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <Link 
      href={isAuthenticated ? '/client/dashboard' : '/client/login'}
      className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-lg hover:shadow-xl transform transition duration-300 hover:scale-105 focus:ring-4 focus:ring-purple-300"
    >
      {isAuthenticated ? (
        <>
          <UserCheck className="w-5 h-5 mr-2" />
          Client Dashboard
        </>
      ) : (
        <>
          <LogIn className="w-5 h-5 mr-2" />
          Become a Client
        </>
      )}
    </Link>
  );
};

export default ClientLoginButton;
