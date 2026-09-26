import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthProviders from "../../components/auth/AuthProviders";
import { useAppContext } from "../../context/AppContext";
import { buildAppContextValue } from "./test-utils";

vi.mock("../../context/AppContext", () => ({
    useAppContext: vi.fn(),
}));

describe("AuthProviders", () => {
    const login = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useAppContext).mockReturnValue(buildAppContextValue({ login }));
    });

    it("renders a Google button and calls login('google') when clicked", async () => {
        const user = userEvent.setup();
        render(<AuthProviders provider="google" />);

        await user.click(screen.getByRole("button", { name: /continue with google/i }));

        expect(login).toHaveBeenCalledWith("google");
    });

    it("renders a Facebook button and calls login('facebook') when clicked", async () => {
        const user = userEvent.setup();
        render(<AuthProviders provider="facebook" />);

        await user.click(screen.getByRole("button", { name: /continue with facebook/i }));

        expect(login).toHaveBeenCalledWith("facebook");
    });

    it("renders a fallback message for an unsupported provider", () => {
        // @ts-expect-error deliberately passing an unsupported provider to exercise the default branch
        render(<AuthProviders provider="twitter" />);

        expect(screen.getByText("Invalid provider type")).toBeInTheDocument();
    });
});
