"use client";

import React from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const LoginPage = () => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const handleLogin = (provider) => {
    signIn(provider, { callbackUrl: '/client/dashboard' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 p-4">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
        
        <div className="text-center mb-8 mt-6">
          <h1 className="text-3xl font-bold mb-2">Become a Client</h1>
          <p className="text-white/70">Sign in to send me messages and discuss your project</p>
        </div>
        
        {error && (
          <div className="error-message mb-4">
            Login failed: {error}
          </div>
        )}
        
        <div className="space-y-4">
          <button
            onClick={() => handleLogin('github')}
            className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Continue with GitHub
          </button>
          
          <button
            onClick={() => handleLogin('google')}
            className="w-full py-3 px-4 bg-white text-gray-800 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="#FFC107" />
              <path d="M2.543,7.151l3.254,2.394c0.723-2.303,2.839-3.968,5.337-3.968c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C8.086,2,4.283,4.135,2.543,7.151z" fill="#FF3D00" />
              <path d="M12.545,22c2.525,0,4.839-0.921,6.627-2.493l-3.099-2.616c-0.911,0.66-2.091,1.045-3.527,1.045c-2.719,0-5.023-1.554-6.13-3.777l-3.291,2.53C4.9,19.566,8.415,22,12.545,22z" fill="#4CAF50" />
              <path d="M21.979,10.261l-0.016-0.008l-9.418-0.014l-0.001,3.823l5.445,0.001c-0.366,1.045-1.092,1.945-2.037,2.542l3.099,2.616c-0.217,0.194,3.312-2.445,3.312-7.581C22.363,11.128,22.203,10.676,21.979,10.261z" fill="#1976D2" />
            </svg>
            Continue with Google
          </button>
          
          <button
            onClick={() => handleLogin('reddit')}
            className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 rounded-lg flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 11.779c0-1.459-1.192-2.645-2.657-2.645-.715 0-1.363.286-1.84.746-1.81-1.191-4.259-1.949-6.971-2.046l1.483-4.669 4.016.941-.006.058c0 1.193.975 2.163 2.174 2.163 1.198 0 2.172-.97 2.172-2.163s-.975-2.164-2.172-2.164c-.92 0-1.704.574-2.021 1.379l-4.329-1.015c-.189-.046-.381.063-.44.249l-1.654 5.207c-2.838.034-5.409.798-7.3 2.025-.474-.438-1.103-.712-1.799-.712-1.465 0-2.656 1.187-2.656 2.646 0 .97.533 1.811 1.317 2.271-.052.282-.086.567-.086.857 0 3.911 4.808 7.093 10.719 7.093s10.72-3.182 10.72-7.093c0-.274-.029-.544-.075-.81.832-.447 1.405-1.312 1.405-2.318zm-17.224 1.816c0-.868.71-1.575 1.582-1.575.872 0 1.581.707 1.581 1.575s-.709 1.574-1.581 1.574-1.582-.706-1.582-1.574zm9.061 4.669c-.797.793-2.048 1.179-3.824 1.179l-.013-.003-.013.003c-1.777 0-3.028-.386-3.824-1.179-.145-.144-.145-.379 0-.523.145-.145.381-.145.526 0 .65.647 1.729.961 3.298.961l.013.003.013-.003c1.569 0 2.648-.315 3.298-.962.145-.145.381-.144.526 0 .145.145.145.379 0 .524zm-.189-3.095c-.872 0-1.581-.706-1.581-1.574 0-.868.709-1.575 1.581-1.575s1.581.707 1.581 1.575-.709 1.574-1.581 1.574z"/>
            </svg>
            Continue with Reddit
          </button>
        </div>
        
        <div className="mt-8 text-center text-white/60 text-sm">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
