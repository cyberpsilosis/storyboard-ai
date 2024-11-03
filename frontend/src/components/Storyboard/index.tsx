import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useToast } from "@/hooks/use-toast"

interface StoryboardProps {
  images: string[];
  onClose: () => void;
  open: boolean;
}

export const Storyboard: React.FC<StoryboardProps> = ({ images, onClose, open }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!open) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          setCurrentIndex(i => Math.max(0, i - 1));
          break;
        case 'ArrowRight':
          setCurrentIndex(i => Math.min(images.length - 1, i + 1));
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [open, images.length, onClose]);

  const handleDownload = async () => {
    try {
      const response = await fetch(images[currentIndex]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scene-${currentIndex + 1}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download Complete",
        description: `Scene ${currentIndex + 1} has been downloaded.`
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download image",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
        <div className="relative h-full flex flex-col">
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <Button size="icon" variant="outline" onClick={handleDownload}>
              <Icons.download className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" onClick={onClose}>
              <Icons.close className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 relative bg-black">
            <img 
              src={images[currentIndex]} 
              alt={`Scene ${currentIndex + 1}`}
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-4 left-4 right-4 text-white text-sm font-mono">
              Scene {currentIndex + 1} of {images.length}
            </div>
          </div>
          
          <div className="p-4 bg-background border-t">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
              >
                <Icons.chevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <div className="flex gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentIndex 
                        ? 'bg-primary' 
                        : 'bg-muted hover:bg-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentIndex(i => Math.min(images.length - 1, i + 1))}
                disabled={currentIndex === images.length - 1}
              >
                Next
                <Icons.chevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 