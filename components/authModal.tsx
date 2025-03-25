"use client";

import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";

import useAuthModal from "@/hooks/useAuthModal";
import Modal from "./Modal";
import { useSupabase } from "@/providers/SupabaseProvider";

const AuthModal = () => {
    const { supabase } = useSupabase();
    const router = useRouter();
    const { onClose, isOpen } = useAuthModal();
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
        };
        
        checkSession();
        
        const { data: authListener } = supabase.auth.onAuthStateChange((event, currentSession) => {
            setSession(currentSession);
        });
        
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [supabase]);

    useEffect(() => {
        if (session) {
            router.refresh();
            onClose();
        }
    }, [session, router, onClose]);

    const onChange = (open: boolean) => {
        if (!open) onClose();
    };

    return (
        <Modal title="Welcome to my project" description="Dont want to enter your info? dont worry, use krinsproject@gmail.com and aaaaaaaa" isOpen={isOpen} onChange={onChange}>
            <Auth theme="dark" magicLink providers={["github"]} supabaseClient={supabase} appearance={{
                theme: ThemeSupa,
                variables: {
                    default: {
                        colors: {
                            brand: "#404040",
                            brandAccent: "#22c55e"
                        }
                    }
                }
            }}/> 
        </Modal>
    );
}

export default AuthModal;