"use client";

import React, {useState, useEffect, useRef} from "react";

interface TimeoutClockProps {
    initialTime?: number;
    onTimeout: () => void;
}

const TimeoutClock: React.FC<TimeoutClockProps> = ({initialTime = 300, onTimeout}) => {
    const [timeLeft, setTimeLeft] = useState<number>(initialTime);
    const onTimeoutRef = useRef(onTimeout);

    //Mettre à jour la ref en cas de changement de la callback
    useEffect(() => {
        onTimeoutRef.current = onTimeout;
    }, [onTimeout]);

    //Réagir aux changements de initialTime
    useEffect(() => {
        setTimeLeft(initialTime);
    }, [initialTime]);

    // Installer un seul intervalle au montage
    useEffect(() => {
        const tick = () => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    onTimeoutRef.current();
                    return 0;
                }
                return prev - 1;
            });
        };

        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    return <div className="mr-4">{formatTime(timeLeft)}</div>;
};

export default TimeoutClock;
