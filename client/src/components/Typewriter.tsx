import React, { useState, useEffect } from 'react';

interface TypewriterProps {
    text: string;
    wordIntervalMs?: number;
    delay?: number;
}

const Typewriter: React.FC<TypewriterProps> = ({ text, wordIntervalMs = 80, delay = 0 }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let interval: any;
        const words = text.split(' ');
        let currentWordIndex = 0;

        setDisplayedText('');

        const timeout = setTimeout(() => {
            interval = setInterval(() => {
                if (currentWordIndex < words.length) {
                    const word = words[currentWordIndex];
                    setDisplayedText((prev) => prev + (prev ? ' ' : '') + word);
                    currentWordIndex++;
                } else {
                    clearInterval(interval);
                }
            }, wordIntervalMs);
        }, delay);

        return () => {
            clearTimeout(timeout);
            if (interval) clearInterval(interval);
        };
    }, [text, wordIntervalMs, delay]);

    return <span>{displayedText}</span>;
};

export default Typewriter;
