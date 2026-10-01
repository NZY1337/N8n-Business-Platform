import { createContext, useState, useContext, useEffect } from 'react'
import type React from 'react'
import type { Context } from 'react'
import type { Session, Provider, AuthError, User } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'

export type AppContextType = {
    session: Session | null
    sessionLoaded: boolean
    logout: () => Promise<void>
    login: (provider: Provider) => Promise<void>
    loginWithPassword: (email: string, password: string) => Promise<{ error: string | null }>
    signUpWithPassword: (email: string, password: string, fullName: string) => Promise<{ error: string | null; needsConfirmation: boolean }>
    forgotPasswordEmail: (email: string) => Promise<{ data: object | null, error: AuthError | null }>
    resetPassword: (password: string) => Promise<{ data: { user: User | null }, error: AuthError | null }>
}

const AppContext: Context<AppContextType | undefined> = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null)
    const [sessionLoaded, setSessionLoaded] = useState(false);

    console.log('AppContext session:', session?.access_token)

    const login = async (provider: Provider) => {
        const options: Record<string, Record<string, string>> = {
            google: { prompt: 'select_account' },
        }

        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
                queryParams: options[provider] ?? {},
            },
        })
    }

    const loginWithPassword = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        return { error: error?.message ?? null }
    }

    // full_name is what SupabaseAuthGuard reads into request.user.name
    const signUpWithPassword = async (email: string, password: string, fullName: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName },
                emailRedirectTo: `${window.location.origin}/dashboard`,
            },
        })

        return { error: error?.message ?? null, needsConfirmation: !error && !data.session }
    }

    const forgotPasswordEmail = async (email: string) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        });
        return { data, error }
    }

    const resetPassword = async (password: string) => {
        const { data, error } = await supabase.auth.updateUser({ password });
        return { data, error }
    }

    const logout = async () => {
        await supabase.auth.signOut()
    }

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setSessionLoaded(true);
        })

        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])

    return (
        <AppContext.Provider value={{
            session,
            sessionLoaded,
            login,
            loginWithPassword,
            signUpWithPassword,
            forgotPasswordEmail,
            resetPassword,
            logout,

        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext)
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider')
    }
    return context
}
