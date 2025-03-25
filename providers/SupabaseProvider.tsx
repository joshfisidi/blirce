"use client"

import { Database } from "@/types_db"
import { createBrowserClient } from "@supabase/ssr";
import { createContext, useState, useContext } from "react";

interface SupaBaseProviderProps {
    children: React.ReactNode;
}

type SupabaseContext = {
    supabase: ReturnType<typeof createBrowserClient<Database>>;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export const useSupabase = () => {
    const context = useContext(Context);
    if (context === undefined) {
        throw new Error('useSupabase must be used inside SupabaseProvider');
    }
    return context;
};

const SupabaseProvider: React.FC<SupaBaseProviderProps> = ({ children }) => {
    const [supabase] = useState(() => 
        createBrowserClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
    );

    return (
        <Context.Provider value={{ supabase }}>
            {children}
        </Context.Provider>
    );
}

export default SupabaseProvider;