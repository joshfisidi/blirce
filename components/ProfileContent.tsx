"use client";

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";
import { Song } from "@/types";
import SongItem from "@/components/SongItem";
import useOnPlay from "@/hooks/useOnPlay";
import Button from "@/components/Button";
import { FaUser } from "react-icons/fa";
import { MdModeEdit, MdFileUpload } from "react-icons/md";
import useUploadModal from "@/hooks/useUploadModal";

const ProfileContent = () => {
  const router = useRouter();
  const { user, userDetails, isLoading, subscription } = useUser();
  const supabaseClient = useSupabaseClient();
  const [userSongs, setUserSongs] = useState<Song[]>([]);
  const [isLoadingSongs, setIsLoadingSongs] = useState(true);
  const uploadModal = useUploadModal();
  
  const onPlay = useOnPlay(userSongs);

  useEffect(() => {
    if (!user) {
      router.replace("/");
      toast.error("Please log in to view your profile");
      return;
    }

    const fetchUserSongs = async () => {
      try {
        setIsLoadingSongs(true);
        
        const { data, error } = await supabaseClient
          .from("songs")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
          
        if (error) {
          toast.error("Failed to load your songs");
          return;
        }
        
        setUserSongs(data || []);
      } catch (error) {
        toast.error("Something went wrong");
      } finally {
        setIsLoadingSongs(false);
      }
    };

    fetchUserSongs();
  }, [supabaseClient, user, router]);

  const handleUpload = () => {
    uploadModal.onOpen();
  };

  if (isLoading || isLoadingSongs) {
    return (
      <div className="flex flex-col gap-y-3 px-3 text-neutral-400">
        Loading profile information...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-6">
      <div className="bg-neutral-800 rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center gap-x-6 gap-y-4">
          <div className="flex-shrink-0">
            <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden bg-neutral-700 flex items-center justify-center">
              {userDetails?.avatar_url ? (
                <img 
                  src={userDetails.avatar_url} 
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              ) : (
                <FaUser size={40} className="text-neutral-400" />
              )}
            </div>
          </div>
          
          <div className="flex flex-col flex-grow">
            <h2 className="text-white text-2xl font-semibold">
              {userDetails?.full_name || 
               `${userDetails?.first_name || ""} ${userDetails?.last_name || ""}`.trim() || 
               "Blirce User"}
            </h2>
            <p className="text-neutral-400 mt-1">{user?.email}</p>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <Button 
                onClick={handleUpload}
                className="bg-emerald-700 text-white px-4 py-2 flex items-center gap-x-2"
              >
                <MdFileUpload size={18} />
                Upload Song
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="bg-neutral-700 p-4 rounded-md">
            <h3 className="text-neutral-200 text-lg font-medium mb-2">Account Type</h3>
            <p className="text-white">
              {subscription ? "Premium subscription active" : "Free Account"}
            </p>
          </div>
          
          <div className="bg-neutral-700 p-4 rounded-md">
            <h3 className="text-neutral-200 text-lg font-medium mb-2">Songs Uploaded</h3>
            <p className="text-white">{userSongs.length}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-2xl font-semibold">Your Uploaded Songs</h2>
        </div>
        
        {userSongs.length === 0 ? (
          <div className="bg-neutral-800 rounded-lg p-6 text-center">
            <p className="text-neutral-400 mb-4">You haven&apos;t uploaded any songs yet</p>
            <Button 
              onClick={handleUpload}
              className="bg-white px-6 py-2"
            >
              Upload your first song
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4">
            {userSongs.map((song) => (
              <SongItem 
                key={song.id}
                data={song}
                onClick={(id: string) => onPlay(id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileContent; 