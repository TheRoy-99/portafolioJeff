import { useState, useEffect } from 'react';

export const useTypewriter = (words: string[], speed = 100, delay = 1000) => {
    const [text, setText] = useState('');
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentWord = words[wordIndex];

        const timer = setTimeout(() => {
            if (!isDeleting) {
                // Escribiendo
                setText(currentWord.substring(0, text.length + 1));
            } else {
                // Borrando
                setText(currentWord.substring(0, text.length - 1));
            }

            // Cuando termina de escribir la palabra completa
            if (!isDeleting && text === currentWord) {
                setTimeout(() => setIsDeleting(true), delay);
            } 
            // Cuando termina de borrar completamente
            else if (isDeleting && text === '') {
                setIsDeleting(false);
                setWordIndex((current) => (current + 1) % words.length);
            }
        }, isDeleting ? speed / 2 : speed);

        return () => clearTimeout(timer);
    }, [text, isDeleting, wordIndex, words, speed, delay]);

    return text;
};
