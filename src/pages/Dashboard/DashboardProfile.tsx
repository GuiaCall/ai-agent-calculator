import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function DashboardProfile() {
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
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("No user");

      const { data, error } = await supabase
        .from('profiles')
        .select('name, location')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setName(data.name);
      setLocation(data.location);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("No user");

      const updates = {
        name,
        location,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error updating the profile",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <Input
            type="text"
            value={name || ''}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <Input
            type="text"
            value={location || ''}
            onChange={(e) => setLocation(e.target.value)}
            disabled={loading}
          />
        </div>
        <Button onClick={updateProfile} disabled={loading}>
          {loading ? 'Loading...' : 'Update Profile'}
        </Button>
      </div>
    </Card>
  );
}