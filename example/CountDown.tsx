import React, { useState, useEffect, useCallback } from 'react';
import { extend } from '@react-three/fiber'
import { Canvas } from '@react-three/fiber';
import { Text } from '@react-three/drei';

// Ajout du type de prop
interface CountdownProps {
  onRestart?: () => void;
  onTimeChange?: (time: number) => void;
}

const Countdown: React.FC<CountdownProps> = ({ onRestart, onTimeChange }) => {
  const initialTime = 20;
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft === 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  useEffect(() => {
    if (onTimeChange) onTimeChange(timeLeft);
  }, [timeLeft, onTimeChange]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const resetCountdown = useCallback(() => {
    setTimeLeft(initialTime);
    if (onRestart) onRestart();
  }, [initialTime, onRestart]);

  return (
    <group position={[-6, 2, 0]} onClick={resetCountdown}>
        <Text
        scale={0.5}
        color="black"
        maxWidth={10}
        textAlign="center"
        position={[0, 1, 0]}
        rotation={[0, Math.PI/1.4, 0]}
        onClick={(e) => { e.stopPropagation(); resetCountdown(); }}
        >
        Restart
        </Text>
        <mesh receiveShadow castShadow>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color={"lightsteelblue"} />
        </mesh>
    </group>
  );
};

export default Countdown;
