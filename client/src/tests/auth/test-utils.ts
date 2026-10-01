import { vi } from "vitest";
import type { AppContextType } from "../../context/AppContext";

export const deferred = <T>() => Promise.withResolvers<T>();

export const buildAppContextValue = (
    overrides: Partial<AppContextType> = {},
): AppContextType => ({
    session: null,
    sessionLoaded: true,
    logout: vi.fn(),
    login: vi.fn(),
    loginWithPassword: vi.fn(),
    signUpWithPassword: vi.fn(),
    forgotPasswordEmail: vi.fn(),
    resetPassword: vi.fn(),
    ...overrides,
});
