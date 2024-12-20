import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function DashboardProfile() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      setLoading(true);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('No user');

      let { data, error } = await supabase
        .from('profiles')
        .select('name, location')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setName(data.name);
        setLocation(data.location);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error loading profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('No user');

      const { error } = await supabase
        .from('profiles')
        .update({
          name,
          location,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error updating profile',
        variant: 'destructive',
      });
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Name
          </label>
          <Input
            id="name"
            type="text"
            value={name || ''}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="location">
            Location
          </label>
          <Input
            id="location"
            type="text"
            value={location || ''}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={updateProfile} disabled={loading}>
            {loading ? 'Loading...' : 'Update Profile'}
          </Button>
        </div>
      </div>
    </Card>
  );
}