import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";
import { useAppContext } from "../../context/AppContext";
import { buildAppContextValue, deferred } from "./test-utils";
import { MemoryRouter } from "react-router";

vi.mock("../../context/AppContext", () => ({
    useAppContext: vi.fn(),
}));

const renderResetPasswordForm = () => {
    render(
        <MemoryRouter>
            <ResetPasswordForm />
        </MemoryRouter>
    )
}

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));

vi.mock("react-router", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react-router")>();
    return { ...actual, useNavigate: () => mockNavigate };
});

describe("ResetPasswordForm", () => {
    const resetPassword = vi.fn();
    const logout = vi.fn();
    const user = userEvent.setup();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useAppContext).mockReturnValue(
            buildAppContextValue({ resetPassword, logout }),
        );
    });

    it('should have a link that goes to /signin', () => {
        renderResetPasswordForm();

        const links: HTMLBaseElement = screen.getByRole("link");
        expect(links.href).toContain("/signin");
    })

    it("renders the new-password fields and the submit button", () => {
        renderResetPasswordForm();
        expect(screen.getByPlaceholderText(/enter your new password/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/repeat your new password/i)).toBeInTheDocument();
    });

    it("test the empty fields error", async () => {
        renderResetPasswordForm();

        await user.click(screen.getByRole("button", { name: /reset password/i }));
        expect(screen.getByRole("alert")).toHaveTextContent(
            "Something went wrong: Both fields are required.",
        );
    });

    it("test the passwords missmatch", async () => {
        renderResetPasswordForm();

        await user.type(screen.getByPlaceholderText("Enter your new password"), "pwd");
        await user.type(screen.getByPlaceholderText("Repeat your new password"), "pwdd");
        await user.click(screen.getByRole("button", { name: /reset password/i }));

        expect(screen.getByRole("alert")).toHaveTextContent(
            "Something went wrong: Password must be at least 8 characters.",
        );
    });

    it("test the passwords length", async () => {
        renderResetPasswordForm();

        await user.type(screen.getByPlaceholderText("Enter your new password"), "pwdpwdpwd");
        await user.type(screen.getByPlaceholderText("Repeat your new password"), "pwdpwdpwdd");
        await user.click(screen.getByRole("button", { name: /reset password/i }));

        expect(screen.getByRole("alert")).toHaveTextContent(
            "Something went wrong: Passwords do not match",
        );
    });

    it("displays 'Sending...' and disable the button while the request is in flight", async () => {
        const { promise, resolve } = deferred<{ data: { ok: true } | null; error: { message: string } | null }>();
        resetPassword.mockReturnValue(promise);

        renderResetPasswordForm();

        await user.type(screen.getByPlaceholderText("Enter your new password"), "pwdpwdpwdd");
        await user.type(screen.getByPlaceholderText("Repeat your new password"), "pwdpwdpwdd");
        await user.click(screen.getByRole("button", { name: /reset password/i }));

        expect(await screen.findByRole("button", { name: "Resetting..." })).toBeDisabled();

        resolve({ data: { ok: true }, error: null });

        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith("/signin", { replace: true }),
        );

        expect(logout).toHaveBeenCalled();
    })
});

