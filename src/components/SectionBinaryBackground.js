'use client';
import React, { useEffect, useRef } from 'react';

const SectionBinaryBackground = ({ color = 'blue', density = 1, speed = 1, opacity = 0.4 }) => {
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
            const canvasParent = canvas.parentElement;
            if (canvasParent) {
                canvas.width = canvasParent.offsetWidth;
                canvas.height = canvasParent.offsetHeight;
            }
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Binary matrix effect with custom density
        const fontSize = 14;
        const columns = Math.ceil(canvas.width / fontSize / (2 - density));

        // Array to track the y position of each column
        const drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }

        // Function to draw the matrix effect
        const draw = () => {
            if (!isActive) return;

            // Semi-transparent background for fade effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw binary characters
            for (let i = 0; i < drops.length; i++) {
                // Only update some columns each frame for performance
                if (Math.random() > 0.75) continue;

                // Random binary character
                const text = Math.random() > 0.5 ? '1' : '0';

                // Calculate coordinates
                const x = i * fontSize * (2 - density);
                const y = drops[i] * fontSize;

                // Draw with varying opacity for depth effect
                const variableOpacity = Math.random() * 0.5 + opacity;
                ctx.fillStyle = `rgba(255, 255, 255, ${variableOpacity})`; // White for dark mode
                ctx.font = `${fontSize}px monospace`;
                ctx.fillText(text, x, y);

                // Increment y position with custom speed
                drops[i] += 0.3 * speed;

                // Reset when off-screen with randomization
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
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
    }, [color, density, speed, opacity]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none hidden dark:block"
            aria-hidden="true"
        />
    );
};

export default SectionBinaryBackground; 