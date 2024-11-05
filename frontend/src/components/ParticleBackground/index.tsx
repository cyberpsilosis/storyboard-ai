import { useEffect, useRef } from 'react';

export const ParticleBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create particles
    const particles = Array.from({ length: 50 }).map(() => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particle.style.animationDuration = `${10 + Math.random() * 10}s`;
      return particle;
    });

    // Add particles to container
    particles.forEach(particle => container.appendChild(particle));

    // Cleanup
    return () => {
      particles.forEach(particle => particle.remove());
    };
  }, []);

  return <div ref={containerRef} className="particle-container" />;
}; 