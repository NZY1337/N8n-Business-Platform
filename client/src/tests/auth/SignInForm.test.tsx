import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import SignInForm from "../../components/auth/SignInForm";
import { useAppContext } from "../../context/AppContext";
import { buildAppContextValue } from "./test-utils";

vi.mock("../../context/AppContext", () => ({
    useAppContext: vi.fn(),
}));

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));

vi.mock("react-router", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react-router")>();
    return { ...actual, useNavigate: () => mockNavigate };
});

const renderSignInForm = () =>
    render(
        <MemoryRouter>
            <SignInForm />
        </MemoryRouter>,
    );

describe("SignInForm", () => {
    const loginWithPassword = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useAppContext).mockReturnValue(buildAppContextValue({ loginWithPassword }));
    });

    it("renders the email/password fields, the submit button and both OAuth buttons", () => {
        renderSignInForm();

        expect(screen.getByPlaceholderText("info@gmail.com")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /continue with google/i })).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /continue with facebook/i }),
        ).toBeInTheDocument();
    });

    it("shows a validation error and never calls loginWithPassword when a field is empty", async () => {
        const user = userEvent.setup();
        renderSignInForm();

        await user.click(screen.getByRole("button", { name: "Sign in" }));

        expect(await screen.findByRole("alert")).toHaveTextContent(
            "Email and password are required.",
        );
        expect(loginWithPassword).not.toHaveBeenCalled();
    });

    it("logs in and navigates to /dashboard on success", async () => {
        const user = userEvent.setup();
        loginWithPassword.mockResolvedValue({ error: null });
        renderSignInForm();

        await user.type(screen.getByPlaceholderText("info@gmail.com"), "user@example.com");
        await user.type(screen.getByPlaceholderText("Enter your password"), "secret123");
        await user.click(screen.getByRole("button", { name: "Sign in" }));

        await waitFor(() => {
            expect(loginWithPassword).toHaveBeenCalledWith("user@example.com", "secret123");
            expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
        });
    });

    it("shows the Supabase error and does not navigate on failure", async () => {
        const user = userEvent.setup();
        loginWithPassword.mockResolvedValue({ error: "Invalid login credentials" });
        renderSignInForm();

        await user.type(screen.getByPlaceholderText("info@gmail.com"), "user@example.com");
        await user.type(screen.getByPlaceholderText("Enter your password"), "wrong-pass");
        await user.click(screen.getByRole("button", { name: "Sign in" }));

        expect(await screen.findByRole("alert")).toHaveTextContent("Invalid login credentials");
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("disables the submit button and shows a loading label while the request is in flight", async () => {
        const user = userEvent.setup();
        let resolveLogin!: (value: { error: string | null }) => void;
        loginWithPassword.mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveLogin = resolve;
                }),
        );
        renderSignInForm();

        await user.type(screen.getByPlaceholderText("info@gmail.com"), "user@example.com");
        await user.type(screen.getByPlaceholderText("Enter your password"), "secret123");
        await user.click(screen.getByRole("button", { name: "Sign in" }));

        expect(await screen.findByRole("button", { name: "Signing in..." })).toBeDisabled();

        resolveLogin({ error: null });
        await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
    });

    it("toggles the password field between hidden and visible", async () => {
        const user = userEvent.setup();
        const { container } = renderSignInForm();

        const passwordInput = screen.getByPlaceholderText("Enter your password");
        expect(passwordInput).toHaveAttribute("type", "password");

        const toggle = container.querySelector("span.cursor-pointer");
        expect(toggle).not.toBeNull();
        await user.click(toggle as Element);

        expect(passwordInput).toHaveAttribute("type", "text");
    });
});
