import { Subscription, UserDetails } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { User } from "@supabase/supabase-js";

type UserContextType = {
    accessToken: string | null;
    user: User | null;
    userDetails: UserDetails | null;
    isLoading: boolean;
    subscription: Subscription | null;
}

const UserContext = createContext<UserContextType | undefined>(
    undefined
);

interface Props {
    [propName: string]: any;
};

export const MyUserContextProvider = (props: Props) => {
    const { supabase } = useSupabase();
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    const getUserDetails = () => supabase.from("users").select("*").single();
    const getSubscription = () => supabase.from("subscriptions").select("*, prices(*, products(*))").in("status", ["trialing", "active"]).single();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsLoadingUser(false);
            
            if (session) {
                setUser(session.user);
                setAccessToken(session.access_token);
            } else {
                setUser(null);
                setAccessToken(null);
            }
        };

        fetchUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                setUser(session.user);
                setAccessToken(session.access_token);
            } else {
                setUser(null);
                setAccessToken(null);
            }
            setIsLoadingUser(false);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [supabase]);

    useEffect(() => {
        if (user && !isLoadingData && !userDetails && !subscription) {
            setIsLoadingData(true);
            
            Promise.allSettled([getUserDetails(), getSubscription()]).then(
                (results) => {
                    const userDetailsPromise = results[0];
                    const subscriptionPromise = results[1];
                    
                    if (userDetailsPromise.status === "fulfilled") {
                        setUserDetails(userDetailsPromise.value.data as unknown as UserDetails);
                    }

                    if (subscriptionPromise.status === "fulfilled") {
                        setSubscription(subscriptionPromise.value.data as Subscription);
                    }

                    setIsLoadingData(false);
                }
            )
        } else if (!user && !isLoadingUser && !isLoadingData) {
            setUserDetails(null);
            setSubscription(null);
        }
    }, [user, isLoadingUser, userDetails, subscription, isLoadingData]);

    const value = {
        accessToken,
        user,
        userDetails,
        isLoading: isLoadingUser || isLoadingData,
        subscription
    }

    return <UserContext.Provider value={value} {...props} />
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserContextProvider");
    }
    return context;
};
