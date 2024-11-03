import React from 'react'
import { useAppSelector } from '@/hooks/redux-hooks'
import { selectShots, selectShotsLoading, selectShotsError } from '@/features/shots/shotsSlice'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { cn } from '@/lib/utils'

export const ShotList: React.FC = () => {
  const shots = useAppSelector(selectShots)
  const isLoading = useAppSelector(selectShotsLoading)
  const error = useAppSelector(selectShotsError)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <Icons.loading className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] gap-4">
        <Icons.warning className="w-12 h-12 text-red-500" />
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!shots.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] gap-4">
        <Icons.media className="w-12 h-12 text-gray-400" />
        <p className="text-gray-500">No shots generated yet</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {shots.map((shot) => (
        <div
          key={shot.id}
          className={cn(
            "border rounded-lg p-4 space-y-4",
            "hover:shadow-lg transition-shadow",
            "dark:bg-gray-800"
          )}
        >
          {shot.frame_url ? (
            <div className="aspect-video relative rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
              <img
                src={shot.frame_url}
                alt={shot.description}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="aspect-video flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md">
              <Icons.image className="w-8 h-8 text-gray-400" />
            </div>
          )}
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {shot.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                Shot {shot.sequence}
              </span>
              {!shot.frame_url && (
                <Button size="sm" variant="outline">
                  <Icons.submit className="w-4 h-4 mr-2" />
                  Generate Frame
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 