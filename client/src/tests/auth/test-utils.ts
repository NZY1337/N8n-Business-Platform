import { vi } from "vitest";
import type { Session, Provider } from "@supabase/supabase-js";

// Mirrors AppContextType from src/context/AppContext.tsx. Kept as a local
// duplicate here (test-only) rather than importing the real type, so these
// tests fail loudly if the shape of the context ever drifts from what the
// components under test actually consume.
export type AppContextValue = {
    session: Session | null;
    sessionLoaded: boolean;
    logout: () => Promise<void>;
    login: (provider: Provider) => Promise<void>;
    loginWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
    signUpWithPassword: (
        email: string,
        password: string,
        fullName: string,
    ) => Promise<{ error: string | null; needsConfirmation: boolean }>;
};

export const buildAppContextValue = (
    overrides: Partial<AppContextValue> = {},
): AppContextValue => ({
    session: null,
    sessionLoaded: true,
    logout: vi.fn(),
    login: vi.fn(),
    loginWithPassword: vi.fn(),
    signUpWithPassword: vi.fn(),
    ...overrides,
});
