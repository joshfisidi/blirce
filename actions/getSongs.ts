import { Song } from "@/types";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

const getSongs = async (): Promise<Song[]> => {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
        .from("songs")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.log(error);
        return [];
    }

    // Convert to Song type
    return data.map(item => ({
        id: item.id.toString(),
        user_id: item.user_id || "",
        author: item.author || "",
        title: item.title || "",
        song_path: item.song_path || "",
        image_path: item.image_path || ""
    })) || [];
}

export default getSongs;
