import { useState, useEffect } from 'react'
import { storyboardService } from '@/lib/storyboard-service'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { useToast } from '@/hooks/use-toast'

interface Storyboard {
  id: string;
  title: string;
  script: string;
  scenes: {
    description: string;
    imageUrl: string;
  }[];
  created_at: string;
}

export const StoryboardGallery: React.FC = () => {
  const [storyboards, setStoryboards] = useState<Storyboard[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadStoryboards();
  }, []);

  const loadStoryboards = async () => {
    try {
      const data = await storyboardService.getAll();
      setStoryboards(data);
    } catch (error) {
      console.error('Failed to load storyboards:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load storyboards",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this storyboard?')) return;

    try {
      await storyboardService.delete(id);
      setStoryboards(prev => prev.filter(sb => sb.id !== id));
      toast({
        title: "Deleted",
        description: "Storyboard deleted successfully"
      });
    } catch (error) {
      console.error('Failed to delete storyboard:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete storyboard",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Icons.loading className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (storyboards.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No Storyboards Yet</h3>
        <p className="text-muted-foreground">
          Generate your first storyboard to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {storyboards.map((storyboard) => (
        <div
          key={storyboard.id}
          className="group relative bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="aspect-video relative">
            <img
              src={storyboard.scenes[0]?.imageUrl || '/placeholder.png'}
              alt={storyboard.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => {}}>
                <Icons.edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(storyboard.id)}>
                <Icons.trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-medium truncate">{storyboard.title}</h3>
            <p className="text-sm text-muted-foreground">
              {storyboard.scenes.length} scenes
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}; 