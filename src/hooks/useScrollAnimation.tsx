
import { useState, useEffect, useRef } from 'react';

export const useScrollAnimation = () => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const element = ref.current;

        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(element);
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, []);

    return [ref, isVisible] as const;
};
