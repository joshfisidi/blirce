import { Song } from "@/types";
import { cookies } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

const getLikedSongs = async (): Promise<Song[]> => {
    const cookieStore = cookies();
    const supabase = createServerSupabaseClient();
    
    // Try to get the session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user?.id) {
        return [];
    }

    const { data, error } = await supabase
        .from("liked_songs")
        .select("*, songs(*)")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.log(error);
        return [];
    }

    if (!data) {
        return [];
    }

    // Convert data to proper Song type
    return data.map((item) => ({
        id: item.songs.id.toString(),
        user_id: item.songs.user_id || "",
        author: item.songs.author || "",
        title: item.songs.title || "",
        song_path: item.songs.song_path || "",
        image_path: item.songs.image_path || ""
    }));
}

export default getLikedSongs;
