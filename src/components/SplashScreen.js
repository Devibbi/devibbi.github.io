import React, { useEffect, useState } from "react";

const codeLines = [
  "const portfolio = () => {",
  "console.log('Welcome to Devibbi')",
];

export default function SplashScreen() {
  const [currentLine, setCurrentLine] = useState(0);
  const [typed, setTyped] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [pause, setPause] = useState(false);
  const [fadeAndSlide, setFadeAndSlide] = useState(false);
  const [removeSplash, setRemoveSplash] = useState(false);
  // Start with true by default to prevent flash
  const [shouldHide, setShouldHide] = useState(false);

  // Check if we should hide the splash screen
  useEffect(() => {
    // We want to show splash only on first visit or on refresh
    const hasVisited = sessionStorage.getItem("hasVisitedBefore");
    
    // If we're navigating within the site (not a refresh and not first visit)
    if (hasVisited && performance.navigation.type !== 1) {
      // Hide splash immediately without animation
      setShouldHide(true);
    } else {
      // Set session storage to indicate user has visited
      sessionStorage.setItem("hasVisitedBefore", "true");
      // Start the typing animation
      startAnimation();
    }
  }, []);

  // Function to start the animation sequence
  const startAnimation = () => {
    // Animation logic can be put here if needed
  };

  // Typing effect
  useEffect(() => {
    if (currentLine < codeLines.length && !pause) {
      let charIndex = 0;
      const typeNextChar = () => {
        if (charIndex < codeLines[currentLine].length) {
          setTyped(codeLines[currentLine].slice(0, charIndex + 1));
          charIndex++;
          setTimeout(typeNextChar, 25); // Slower typing speed
        } else if (currentLine === codeLines.length - 1) {
          setPause(true); // Pause after last line
        } else {
          setTimeout(() => {
            setTyped("");
            setCurrentLine((prev) => prev + 1);
          }, 200); // Slightly slower line switch
        }
      };
      typeNextChar();
    }
  }, [currentLine, pause]);

  // Pause after last line, then animate out
  useEffect(() => {
    if (pause) {
      const pauseTimeout = setTimeout(() => {
        setFadeAndSlide(true);
        setTimeout(() => setRemoveSplash(true), 2000); // 2.0s for transition
      }, 600); // 0.6s pause after finish
      return () => clearTimeout(pauseTimeout);
    }
  }, [pause]);

  // Cursor blink
  useEffect(() => {
    const cursorBlink = setInterval(() => setShowCursor((v) => !v), 500);
    return () => clearInterval(cursorBlink);
  }, []);

  // Don't render if we've determined to hide it or if animated out
  if (shouldHide || removeSplash) return null;

  return (
    <div
      id="splash-root"
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-900 text-green-400 font-mono text-[2.2rem] pointer-events-none transition-all duration-[2000ms] ease-[cubic-bezier(.4,0,.2,1)] ${fadeAndSlide ? 'opacity-0 -translate-y-[80vh]' : 'opacity-100 translate-y-0'}`}
    >
      <pre className="m-0">
        {typed + (showCursor ? "|" : " ")}
      </pre>
    </div>
  );
}