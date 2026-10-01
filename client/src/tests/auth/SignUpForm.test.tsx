import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import SignUpForm from "../../components/auth/SignUpForm";
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

const renderSignUpForm = () =>
    render(
        <MemoryRouter>
            <SignUpForm />
        </MemoryRouter>,
    );

// Fills every field with values that pass validation, unless overridden.
const fillValidForm = async (
    user: ReturnType<typeof userEvent.setup>,
    overrides: Partial<{
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        repeatPassword: string;
        acceptTerms: boolean;
    }> = {},
) => {
    const values = {
        firstName: "Ada",
        lastName: "Lovelace",
        email: "ada@example.com",
        password: "secret123",
        repeatPassword: "secret123",
        acceptTerms: true,
        ...overrides,
    };

    if (values.firstName) await user.type(screen.getByPlaceholderText("Enter your first name"), values.firstName);
    if (values.lastName) await user.type(screen.getByPlaceholderText("Enter your last name"), values.lastName);
    if (values.email) await user.type(screen.getByPlaceholderText("Enter your email"), values.email);
    if (values.password) await user.type(screen.getByPlaceholderText("Enter your password"), values.password);
    if (values.repeatPassword) await user.type(screen.getByPlaceholderText("Repeat password"), values.repeatPassword);
    if (values.acceptTerms) await user.click(screen.getByRole("checkbox"));
};

describe("SignUpForm", () => {
    const signUpWithPassword = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useAppContext).mockReturnValue(buildAppContextValue({ signUpWithPassword }));
    });

    it("renders the form fields, the terms checkbox and both OAuth buttons", () => {
        renderSignUpForm();

        expect(screen.getByPlaceholderText("Enter your first name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter your last name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Repeat password")).toBeInTheDocument();
        expect(screen.getByRole("checkbox")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /continue with google/i })).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /continue with facebook/i }),
        ).toBeInTheDocument();
    });

    it("requires every field, including repeat password, before submitting", async () => {
        const user = userEvent.setup();
        renderSignUpForm();

        await fillValidForm(user, { repeatPassword: "" });
        await user.click(screen.getByRole("button", { name: "Sign Up" }));

        expect(await screen.findByRole("alert")).toHaveTextContent("All fields are required.");
        expect(signUpWithPassword).not.toHaveBeenCalled();
    });

    it("rejects a password shorter than 8 characters", async () => {
        const user = userEvent.setup();
        renderSignUpForm();

        await fillValidForm(user, { password: "short1", repeatPassword: "short1" });
        await user.click(screen.getByRole("button", { name: "Sign Up" }));

        expect(await screen.findByRole("alert")).toHaveTextContent(
            "Password must be at least 8 characters.",
        );
        expect(signUpWithPassword).not.toHaveBeenCalled();
    });

    it("rejects mismatched passwords", async () => {
        const user = userEvent.setup();
        renderSignUpForm();

        await fillValidForm(user, { repeatPassword: "different1" });
        await user.click(screen.getByRole("button", { name: "Sign Up" }));

        expect(await screen.findByRole("alert")).toHaveTextContent("Passwords do not match.");
        expect(signUpWithPassword).not.toHaveBeenCalled();
    });

    it("requires the terms checkbox to be accepted", async () => {
        const user = userEvent.setup();
        renderSignUpForm();

        await fillValidForm(user, { acceptTerms: false });
        await user.click(screen.getByRole("button", { name: "Sign Up" }));

        expect(await screen.findByRole("alert")).toHaveTextContent(
            "You must accept the Terms and Conditions.",
        );
        expect(signUpWithPassword).not.toHaveBeenCalled();
    });

    it("trims and joins first/last name into a single full name on submit", async () => {
        const user = userEvent.setup();
        signUpWithPassword.mockResolvedValue({ error: null, needsConfirmation: false });
        renderSignUpForm();

        await fillValidForm(user, { firstName: "  Ada  ", lastName: "  Lovelace  " });
        await user.click(screen.getByRole("button", { name: "Sign Up" }));

        await waitFor(() => {
            expect(signUpWithPassword).toHaveBeenCalledWith(
                "ada@example.com",
                "secret123",
                "Ada Lovelace",
            );
        });
    });

    it("navigates to /dashboard when no email confirmation is needed", async () => {
        const user = userEvent.setup();
        signUpWithPassword.mockResolvedValue({ error: null, needsConfirmation: false });
        renderSignUpForm();

        await fillValidForm(user);
        await user.click(screen.getByRole("button", { name: "Sign Up" }));

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/dashboard"));
    });

    it("shows a confirmation message instead of navigating when Supabase requires email confirmation", async () => {
        const user = userEvent.setup();
        signUpWithPassword.mockResolvedValue({ error: null, needsConfirmation: true });
        renderSignUpForm();

        await fillValidForm(user, { email: "ada@example.com" });
        await user.click(screen.getByRole("button", { name: "Sign Up" }));

        expect(await screen.findByRole("alert")).toHaveTextContent(
            "We sent a confirmation link to ada@example.com",
        );
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("shows the Supabase error and does not navigate on failure", async () => {
        const user = userEvent.setup();
        signUpWithPassword.mockResolvedValue({
            error: "User already registered",
            needsConfirmation: false,
        });
        renderSignUpForm();

        await fillValidForm(user);
        await user.click(screen.getByRole("button", { name: "Sign Up" }));

        expect(await screen.findByRole("alert")).toHaveTextContent("User already registered");
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("disables the submit button and shows a loading label while the request is in flight", async () => {
        const user = userEvent.setup();
        let resolveSignUp!: (value: { error: string | null; needsConfirmation: boolean }) => void;
        signUpWithPassword.mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveSignUp = resolve;
                }),
        );
        renderSignUpForm();

        await fillValidForm(user);
        await user.click(screen.getByRole("button", { name: "Sign Up" }));

        expect(await screen.findByRole("button", { name: "Creating account..." })).toBeDisabled();

        resolveSignUp({ error: null, needsConfirmation: false });
        await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
    });

    it("toggles the password and repeat-password visibility independently", async () => {
        const user = userEvent.setup();
        const { container } = renderSignUpForm();

        const passwordInput = screen.getByPlaceholderText("Enter your password");
        const repeatInput = screen.getByPlaceholderText("Repeat password");
        expect(passwordInput).toHaveAttribute("type", "password");
        expect(repeatInput).toHaveAttribute("type", "password");

        const toggles = container.querySelectorAll("span.cursor-pointer");
        expect(toggles.length).toBe(2);

        await user.click(toggles[0]);
        expect(passwordInput).toHaveAttribute("type", "text");
        expect(repeatInput).toHaveAttribute("type", "password");

        await user.click(toggles[1]);
        expect(repeatInput).toHaveAttribute("type", "text");
    });
});
