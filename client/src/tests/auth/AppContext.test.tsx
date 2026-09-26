import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { AppProvider, useAppContext } from "../../context/AppContext";

const { mockAuth } = vi.hoisted(() => ({
    mockAuth: {
        signInWithOAuth: vi.fn(),
        signInWithPassword: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        onAuthStateChange: vi.fn(),
    },
}));

// Path is relative to this test file; it resolves to the same client/lib/supabase.ts
// that AppContext.tsx imports (via '../../lib/supabase' from src/context).
vi.mock("../../../lib/supabase", () => ({
    supabase: { auth: mockAuth },
}));

const wrapper = ({ children }: { children: ReactNode }) => <AppProvider>{children}</AppProvider>;

beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
    });
});

describe("useAppContext", () => {
    it("throws when called outside of an AppProvider", () => {
        expect(() => renderHook(() => useAppContext())).toThrow(
            "useAppContext must be used within an AppProvider",
        );
    });
});

describe("AppProvider", () => {
    it("starts with no session", () => {
        const { result } = renderHook(() => useAppContext(), { wrapper });

        expect(result.current.session).toBeNull();
    });

    it("login calls signInWithOAuth with the given provider and a /dashboard redirect", async () => {
        mockAuth.signInWithOAuth.mockResolvedValue({});
        const { result } = renderHook(() => useAppContext(), { wrapper });

        await act(async () => {
            await result.current.login("facebook");
        });

        expect(mockAuth.signInWithOAuth).toHaveBeenCalledWith({
            provider: "facebook",
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
                queryParams: {},
            },
        });
    });

    it("login adds the select_account prompt only for the google provider", async () => {
        mockAuth.signInWithOAuth.mockResolvedValue({});
        const { result } = renderHook(() => useAppContext(), { wrapper });

        await act(async () => {
            await result.current.login("google");
        });

        expect(mockAuth.signInWithOAuth).toHaveBeenCalledWith(
            expect.objectContaining({
                provider: "google",
                options: expect.objectContaining({
                    queryParams: { prompt: "select_account" },
                }),
            }),
        );
    });

    it("loginWithPassword forwards the credentials and returns no error on success", async () => {
        mockAuth.signInWithPassword.mockResolvedValue({ error: null });
        const { result } = renderHook(() => useAppContext(), { wrapper });

        const response = await act(() =>
            result.current.loginWithPassword("a@b.com", "secret123"),
        );

        expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({
            email: "a@b.com",
            password: "secret123",
        });
        expect(response).toEqual({ error: null });
    });

    it("loginWithPassword surfaces the Supabase error message", async () => {
        mockAuth.signInWithPassword.mockResolvedValue({
            error: { message: "Invalid login credentials" },
        });
        const { result } = renderHook(() => useAppContext(), { wrapper });

        const response = await act(() =>
            result.current.loginWithPassword("a@b.com", "wrong"),
        );

        expect(response).toEqual({ error: "Invalid login credentials" });
    });

    it("signUpWithPassword sends full_name and reports needsConfirmation when no session comes back", async () => {
        mockAuth.signUp.mockResolvedValue({ data: { session: null }, error: null });
        const { result } = renderHook(() => useAppContext(), { wrapper });

        const response = await act(() =>
            result.current.signUpWithPassword("a@b.com", "secret123", "Ada Lovelace"),
        );

        expect(mockAuth.signUp).toHaveBeenCalledWith({
            email: "a@b.com",
            password: "secret123",
            options: {
                data: { full_name: "Ada Lovelace" },
                emailRedirectTo: `${window.location.origin}/dashboard`,
            },
        });
        expect(response).toEqual({ error: null, needsConfirmation: true });
    });

    it("signUpWithPassword reports no confirmation needed when a session comes back immediately", async () => {
        mockAuth.signUp.mockResolvedValue({
            data: { session: { access_token: "t" } },
            error: null,
        });
        const { result } = renderHook(() => useAppContext(), { wrapper });

        const response = await act(() =>
            result.current.signUpWithPassword("a@b.com", "secret123", "Ada Lovelace"),
        );

        expect(response).toEqual({ error: null, needsConfirmation: false });
    });

    it("signUpWithPassword surfaces errors and never asks for confirmation on failure", async () => {
        mockAuth.signUp.mockResolvedValue({
            data: { session: null },
            error: { message: "User already registered" },
        });
        const { result } = renderHook(() => useAppContext(), { wrapper });

        const response = await act(() =>
            result.current.signUpWithPassword("a@b.com", "secret123", "Ada Lovelace"),
        );

        expect(response).toEqual({
            error: "User already registered",
            needsConfirmation: false,
        });
    });

    it("logout calls signOut", async () => {
        mockAuth.signOut.mockResolvedValue({});
        const { result } = renderHook(() => useAppContext(), { wrapper });

        await act(async () => {
            await result.current.logout();
        });

        expect(mockAuth.signOut).toHaveBeenCalled();
    });

    it("updates session and sessionLoaded when the Supabase auth listener fires", async () => {
        let capturedCallback: ((event: string, session: Session | null) => void) | undefined;
        mockAuth.onAuthStateChange.mockImplementation((cb) => {
            capturedCallback = cb;
            return { data: { subscription: { unsubscribe: vi.fn() } } };
        });

        const fakeSession = { access_token: "token-123" } as Session;
        const { result } = renderHook(() => useAppContext(), { wrapper });

        act(() => {
            capturedCallback?.("SIGNED_IN", fakeSession);
        });

        await waitFor(() => {
            expect(result.current.session).toEqual(fakeSession);
            expect(result.current.sessionLoaded).toBe(true);
        });
    });
});
