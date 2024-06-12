import React, { useState, useEffect, useCallback } from 'react';
import { extend } from '@react-three/fiber'
import { Canvas } from '@react-three/fiber';
import { Text } from '@react-three/drei';

const Countdown = () => {
  const initialTime = 90;
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft === 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const resetCountdown = useCallback(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  return (
    <group position={[-6, 1, -10]} onClick={resetCountdown}>
        <Text
        position={[10, 0, 0]}
        rotation={[0, Math.PI, 0]}
        fontSize={1}
        color="orange"
        anchorX="center"
        anchorY="middle"
        >
        {formatTime(timeLeft)}
        </Text>
        <Text
        scale={0.5}
        color="black"
        maxWidth={10}
        textAlign="center"
        position={[0, 1, 0]}
        rotation={[0, Math.PI/1.4, 0]}
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
