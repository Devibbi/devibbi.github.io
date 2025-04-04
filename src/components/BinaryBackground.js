'use client';
import React, { useEffect, useRef } from 'react';

const BinaryBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        // Only run in dark mode and client-side
        if (typeof window === 'undefined') return;

        // Check if dark mode is enabled
        const isDarkMode = document.documentElement.classList.contains('dark');
        if (!isDarkMode) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId;
        let isActive = true;

        // Set canvas dimensions
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Binary matrix effect - increased density
        const fontSize = 16;
        const columns = Math.ceil(canvas.width / fontSize); // More columns

        // Array to track the y position of each column
        const drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }

        // Function to draw the matrix effect
        const draw = () => {
            if (!isActive) return;

            // Semi-transparent background for fade effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // More visible in dark mode
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw binary characters
            for (let i = 0; i < drops.length; i++) {
                // Only update some columns each frame for performance
                if (Math.random() > 0.7) continue;

                // Random binary character
                const text = Math.random() > 0.5 ? '1' : '0';

                // Calculate coordinates
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                // Draw with varying opacity for depth effect
                const opacity = Math.random() * 0.6 + 0.3;

                // Change color to white for dark mode
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.font = `${fontSize}px monospace`;
                ctx.fillText(text, x, y);

                // Increment y position
                drops[i] += 0.5;

                // Reset when off-screen with randomization
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.99) {
                    drops[i] = 0;
                }
            }

            // Schedule next frame
            animationFrameId = requestAnimationFrame(draw);
        };

        // Start animation
        draw();

        // Visibility change handling
        const handleVisibilityChange = () => {
            isActive = document.visibilityState === 'visible';

            if (isActive && !animationFrameId) {
                draw();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup
        return () => {
            isActive = false;
            window.removeEventListener('resize', resizeCanvas);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none hidden dark:block"
            aria-hidden="true"
        />
    );
};

export default BinaryBackground; 