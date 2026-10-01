import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";
import { useAppContext } from "../../context/AppContext";
import { buildAppContextValue, deferred } from "./test-utils";
import { MemoryRouter } from "react-router";

vi.mock("../../context/AppContext", () => ({
    useAppContext: vi.fn(),
}));

const renderForgotPasswordForm = () => {
    render(
        <MemoryRouter>
            <ForgotPasswordForm />
        </MemoryRouter>
    )
}

describe("ForgotPasswordForm", () => {
    const forgotPasswordEmail = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useAppContext).mockReturnValue(buildAppContextValue({ forgotPasswordEmail }));
    })

    it("renders the email field and the submit button", () => {
        renderForgotPasswordForm();
        expect(screen.getByText("Enter the email associated with your account and we'll send you a link to reset your password.")).toBeInTheDocument();
        expect(screen.getByText("Forgot Password")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("info@gmail.com")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Send reset link" })).toBeInTheDocument();
    });

    it("sends a confirmation email if user click on Sent Reset link button", async () => {
        const user = userEvent.setup();
        forgotPasswordEmail.mockResolvedValue({ data: { ok: true }, error: null });
        renderForgotPasswordForm();

        await user.type(screen.getByPlaceholderText("info@gmail.com"), "ada@example.com");
        await user.click(screen.getByRole("button", { name: /send reset link/i }));

        expect(await screen.findByRole("alert")).toHaveTextContent(
            "We sent a password reset link to ada@example.com.",
        );
    });

    it("display an error if no email is filled inside input", async () => {
        const user = userEvent.setup();
        renderForgotPasswordForm();

        await user.click(screen.getByRole("button", { name: /send reset link/i }));
        expect(await screen.findByRole("alert")).toHaveTextContent("Email is required.");
    });

    it("display an error if email is not valid", async () => {
        const user = userEvent.setup();
        forgotPasswordEmail.mockResolvedValue({ data: null, error: { message: "invalid format" } });

        renderForgotPasswordForm();

        await user.type(screen.getByPlaceholderText("info@gmail.com"), "andrew_m");
        await user.click(screen.getByRole("button", { name: /send reset link/i }));
        expect(await screen.findByRole("alert")).toHaveTextContent("invalid format");
    });

    it("displays 'Sending...' and disables the button while the request is in flight", async () => {
        const user = userEvent.setup();
        const { promise, resolve } = deferred<{ data: { ok: true } | null; error: { message: string } | null }>();
        forgotPasswordEmail.mockReturnValue(promise);

        renderForgotPasswordForm();

        await user.type(screen.getByPlaceholderText("info@gmail.com"), "andrew_m@gmail.com");
        await user.click(screen.getByRole("button", { name: /send reset link/i }));

        expect(await screen.findByRole("button", { name: "Sending..." })).toBeDisabled();

        resolve({ data: { ok: true }, error: null });
        await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Check your email"));
    });

    it('should have a link that goes to /signin', () => {
        renderForgotPasswordForm();

        const links: HTMLBaseElement[] = screen.getAllByRole("link");
        expect(links[0].href).toContain("/signin");
        expect(links[1].href).toContain("/signin");
    })
})