"use client"

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import toast from "react-hot-toast";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { useSupabase } from "@/providers/SupabaseProvider";

interface LikeButtonProps {
    songId: string;
}

const LikeButton:React.FC<LikeButtonProps> = ({songId}) => {
    const router = useRouter();
    const { supabase } = useSupabase();

    const authModal = useAuthModal();
    const { user } = useUser();

    const [isLiked, setIsLiked] = useState(false);
    const songIdNum = parseInt(songId);

    useEffect(() => {
        if(!user?.id) {
            return;
        }

        const fetchData = async () => {
            const { data, error } = await supabase
                .from("liked_songs")
                .select("*")
                .eq("user_id", user.id)
                .eq("song_id", songIdNum)
                .single();

            if (!error && data) {
                setIsLiked(true);
            }
        }

        fetchData();
        
    }, [songId, supabase, user?.id, songIdNum]);

    const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

    const handleLike = async () => {
        if (!user) {
            return authModal.onOpen();
        }

        if (isLiked) {
            const { error } = await supabase
                .from("liked_songs")
                .delete()
                .eq("user_id", user.id)
                .eq("song_id", songIdNum);

            if (error) {
                toast.error(error.message)
            } else {
                setIsLiked(false);
            }
        } else {
            const { error } = await supabase
                .from("liked_songs")
                .insert({
                    song_id: songIdNum,
                    user_id: user.id
                });

            if (error) {
                toast.error(error.message)
            } else {
                setIsLiked(true);
                toast.success("Liked!");
            }
        }

        router.refresh();
    }

    return (
        <button className="hover:opacity-75 transitiono" onClick={handleLike}>
            <Icon color={isLiked ? '#22c55e' : 'white'} />
        </button>
    );
}
 
export default LikeButton;