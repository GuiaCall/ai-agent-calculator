import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  
  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .maybeSingle();
        
      if (error) throw error;
      return data;
    }
  });

  const updateProfile = async (updatedProfile: any) => {
    const { error } = await supabase
      .from('profiles')
      .update(updatedProfile)
      .eq('id', profile?.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
    setIsEditing(false);
    refetch();
  };

  if (isLoading) {
    return (
      <Card className="p-6 space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Profile</h2>
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={profile?.name || ''}
              onChange={(e) => profile && updateProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={profile?.location || ''}
              onChange={(e) => profile && updateProfile({ ...profile, location: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              value={profile?.bio || ''}
              onChange={(e) => profile && updateProfile({ ...profile, bio: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => updateProfile(profile)}>Save</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p><span className="font-semibold">Name:</span> {profile?.name || 'Not set'}</p>
          <p><span className="font-semibold">Location:</span> {profile?.location || 'Not set'}</p>
          <p><span className="font-semibold">Bio:</span> {profile?.bio || 'Not set'}</p>
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        </div>
      )}
    </Card>
  );
}