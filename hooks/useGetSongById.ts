import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useSupabase } from '@/providers/SupabaseProvider';

import { Song } from '../types';

const useGetSongsById = (id?: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [song, setSong] = useState<Song | undefined>(undefined);
    const { supabase } = useSupabase();

    useEffect(() => {
        if (!id) return;

        setIsLoading(true);

        const fetchSong = async () => {
            const idNum = parseInt(id);
            const { data, error } = await supabase
                .from('songs')
                .select('*')
                .eq('id', idNum)
                .single();

            if (error) {
                setIsLoading(false);
                return toast.error(error.message);
            }

            // Convert to Song type
            const songData: Song = {
                id: data.id.toString(),
                user_id: data.user_id || "",
                author: data.author || "",
                title: data.title || "",
                song_path: data.song_path || "",
                image_path: data.image_path || ""
            };

            setSong(songData);
            setIsLoading(false);
        }

        fetchSong();
    }, [id, supabase]);

    return useMemo(() => ({
        isLoading,
        song
    }), [isLoading, song]);
}

export default useGetSongsById;