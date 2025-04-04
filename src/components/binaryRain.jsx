import { useEffect, useState } from 'react';

const BinaryRain = () => {
    const [drops, setDrops] = useState([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // Set to true after the component mounts on the client side
        setIsClient(true);

        const generated = Array.from({ length: 80 }, (_, i) => {
            return {
                id: i,
                left: `${Math.random() * 100}%`,
                duration: `${10 + Math.random() * 10}s`,
                delay: `${Math.random() * 10}s`,
                fontSize: `${12 + Math.random() * 20}px`,
                opacity: 0.2 + Math.random() * 0.5,
                char: Math.random() > 0.5 ? '0' : '1',
            };
        });

        setDrops(generated); // Set drops data after mounting
    }, []);

    if (!isClient) return null; // Render nothing before mount to avoid mismatch

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 hidden dark:block">
            {drops.map(drop => (
                <span
                    key={drop.id}
                    style={{
                        position: 'absolute',
                        top: '-50px',
                        left: drop.left,
                        fontSize: drop.fontSize,
                        opacity: drop.opacity,
                        color: 'lime',
                        animation: `fall ${drop.duration} linear ${drop.delay} infinite`,
                        fontFamily: 'monospace',
                    }}
                >
                    {drop.char}
                </span>
            ))}
            <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(120vh);
          }
        }
      `}</style>
        </div>
    );
};

export default BinaryRain;
