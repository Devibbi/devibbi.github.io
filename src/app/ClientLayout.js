"use client";
import React from "react";
import SplashScreen from "../components/SplashScreen";
import { Providers } from "./providers";
import BinaryBackground from "../components/BinaryBackground";
import AskBbiWidget from '../components/AskBbiWidget';

export default function ClientLayout({ children }) {
  return (
    <>
      <SplashScreen />
      <Providers>
        <BinaryBackground />
        <AskBbiWidget />
        {children}
      </Providers>
    </>
  );
}