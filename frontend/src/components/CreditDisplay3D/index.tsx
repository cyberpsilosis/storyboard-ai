import { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Text } from '@react-three/drei'
import * as THREE from 'three'

interface UsageResponse {
  total_credits: number;
  used_credits: number;
}

function TamagotchiModel({ mousePosition, textCredits, imageCredits }: {
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
  textCredits: number | null;
  imageCredits: number | null;
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current && mousePosition.current) {
      const targetRotationY = (mousePosition.current.x - 0.5) * Math.PI * 0.2
      const targetRotationX = (mousePosition.current.y - 0.5) * Math.PI * 0.2

      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.1
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2, 3, 0.5]} />
        <meshStandardMaterial 
          color="#303030"
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>
      
      {/* Screen */}
      <mesh position={[0, 0.2, 0.26]}>
        <planeGeometry args={[1.6, 2]} />
        <meshBasicMaterial 
          color="#131313"
          opacity={0.9}
          transparent
        />
        
        <Text
          position={[0, 0.5, 0.01]}
          fontSize={0.2}
          color="#00ff00"
          anchorX="center"
          anchorY="middle"
        >
          {`TXT: $${textCredits !== null ? (textCredits / 100).toFixed(2) : '-.--'}`}
        </Text>
        
        <Text
          position={[0, -0.5, 0.01]}
          fontSize={0.2}
          color="#00ff00"
          anchorX="center"
          anchorY="middle"
        >
          {`IMG: $${imageCredits !== null ? (imageCredits / 100).toFixed(2) : '-.--'}`}
        </Text>
      </mesh>
      
      {/* Buttons */}
      <mesh position={[0.5, -1.7, 0.3]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
        <meshStandardMaterial 
          color="#202020"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      <mesh position={[-0.5, -1.7, 0.3]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
        <meshStandardMaterial 
          color="#202020"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
    </group>
  )
}

export const CreditDisplay3D: React.FC = () => {
  const [textCredits, setTextCredits] = useState<number | null>(null)
  const [imageCredits, setImageCredits] = useState<number | null>(null)
  const mousePosition = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const fetchCredits = async () => {
    try {
      const [textResponse, imageResponse] = await Promise.all([
        fetch('https://api.together.xyz/v1/usage', {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_TOGETHER_API_KEY}`
          }
        }),
        fetch('https://api.together.xyz/v1/usage', {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_TOGETHER_API_KEY}`
          }
        })
      ]);

      if (!textResponse.ok || !imageResponse.ok) {
        throw new Error('Failed to fetch credits')
      }

      const textData: UsageResponse = await textResponse.json()
      const imageData: UsageResponse = await imageResponse.json()

      setTextCredits(textData.total_credits - textData.used_credits)
      setImageCredits(imageData.total_credits - imageData.used_credits)
    } catch (error) {
      console.error('Error fetching credits:', error)
    }
  }

  useEffect(() => {
    fetchCredits()
    const interval = setInterval(fetchCredits, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-32 h-48">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5} castShadow />
        <TamagotchiModel
          mousePosition={mousePosition}
          textCredits={textCredits}
          imageCredits={imageCredits}
        />
      </Canvas>
    </div>
  )
} 