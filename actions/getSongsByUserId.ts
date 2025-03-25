import { Song } from "@/types";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

const getSongsByUserId = async (): Promise<Song[]> => {
    const supabase = createServerSupabaseClient();

    const {
        data: sessionData,
        error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError) {
        console.log(sessionError.message);
        return [];
    }

    if (!sessionData.session?.user.id) {
        return [];
    }

    const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('user_id', sessionData.session.user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.log(error.message);
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

export default getSongsByUserId;
