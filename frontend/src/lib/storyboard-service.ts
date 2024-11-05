import { supabase } from '@/lib/supabase'

interface Scene {
  description: string;
  imageUrl: string;
}

interface Storyboard {
  id?: string;
  title: string;
  script: string;
  scenes: Scene[];
  created_at?: string;
  updated_at?: string;
}

export const storyboardService = {
  async save(storyboard: Storyboard) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    // First, save images to Supabase storage
    const scenes = await Promise.all(
      storyboard.scenes.map(async (scene: Scene) => {
        if (scene.imageUrl.startsWith('data:image')) {
          // Convert base64 to blob
          const base64Data = scene.imageUrl.split(',')[1];
          const blob = await fetch(`data:image/png;base64,${base64Data}`).then(r => r.blob());
          
          // Generate unique filename
          const filename = `${user.user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
          
          // Upload to Supabase storage
          const { error: uploadError } = await supabase.storage
            .from('storyboards')
            .upload(filename, blob, {
              contentType: 'image/png',
              cacheControl: '3600'
            });

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: urlData } = supabase.storage
            .from('storyboards')
            .getPublicUrl(filename);

          return {
            ...scene,
            imageUrl: urlData.publicUrl
          };
        }
        return scene;
      })
    );

    // Then save storyboard data
    const { data, error } = await supabase
      .from('storyboards')
      .upsert({
        ...storyboard,
        user_id: user.user.id,
        scenes,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('storyboards')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async get(id: string) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('storyboards')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.user.id)
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    // First get the storyboard to find associated images
    const { data: storyboard } = await supabase
      .from('storyboards')
      .select('scenes')
      .eq('id', id)
      .eq('user_id', user.user.id)
      .single();

    if (storyboard) {
      // Delete associated images from storage
      const imageFilenames = storyboard.scenes
        .map((scene: Scene) => {
          const url = new URL(scene.imageUrl);
          return url.pathname.split('/').pop();
        })
        .filter((filename: string | undefined): filename is string => !!filename);

      await Promise.all(
        imageFilenames.map((filename: string) =>
          supabase.storage
            .from('storyboards')
            .remove([`${user.user.id}/${filename}`])
        )
      );
    }

    // Then delete the storyboard data
    const { error } = await supabase
      .from('storyboards')
      .delete()
      .eq('id', id)
      .eq('user_id', user.user.id);

    if (error) throw error;
  }
}; 