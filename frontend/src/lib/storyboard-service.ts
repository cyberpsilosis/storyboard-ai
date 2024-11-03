import { supabase } from '@/lib/supabase'

interface Storyboard {
  id?: string;
  title: string;
  script: string;
  scenes: {
    description: string;
    imageUrl: string;
  }[];
  created_at?: string;
  updated_at?: string;
}

export const storyboardService = {
  async save(storyboard: Storyboard) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('storyboards')
      .upsert({
        ...storyboard,
        user_id: user.user.id,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('storyboards')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async get(id: string) {
    const { data, error } = await supabase
      .from('storyboards')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('storyboards')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
} 