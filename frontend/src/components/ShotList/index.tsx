import React from 'react'
import { Shot } from '@/types'

interface ShotListProps {
  shots: Shot[];
}

export const ShotList: React.FC<ShotListProps> = ({ shots }) => {
  return (
    <div>
      {shots.map((shot: Shot) => (
        <div key={shot.id}>
          {/* Shot content */}
        </div>
      ))}
    </div>
  );
}; 