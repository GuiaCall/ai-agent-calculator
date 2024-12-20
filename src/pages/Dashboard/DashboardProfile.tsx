import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  name: string | null;
  location: string | null;
  bio: string | null;
  avatar_url: string | null;
}

export function DashboardProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch profile",
        variant: "destructive",
      });
      return;
    }

    setProfile(data);
  }

  async function updateProfile(updates: Partial<Profile>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      return;
    }

    setProfile(prev => prev ? { ...prev, ...updates } : null);
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
  }

  if (!profile) return null;

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            value={profile.name || ''}
            onChange={(e) => updateProfile({ name: e.target.value })}
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <Input
            value={profile.location || ''}
            onChange={(e) => updateProfile({ location: e.target.value })}
            placeholder="Your location"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <Input
            value={profile.bio || ''}
            onChange={(e) => updateProfile({ bio: e.target.value })}
            placeholder="A short bio about yourself"
          />
        </div>
      </div>
    </Card>
  );
}