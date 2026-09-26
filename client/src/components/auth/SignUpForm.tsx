import { useState } from "react";
import type React from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import AuthProviders from "./AuthProviders";
import Alert from "../ui/alert/Alert";
import { useAppContext } from "../../context/AppContext";

const MIN_PASSWORD_LENGTH = 8;

export default function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [confirmationSent, setConfirmationSent] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { signUpWithPassword } = useAppContext();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!firstName.trim() || !lastName.trim() || !email || !password || !repeatPassword) {
            setError("All fields are required.");
            return;
        }

        if (password.length < MIN_PASSWORD_LENGTH) {
            setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
            return;
        }

        if (password !== repeatPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!isChecked) {
            setError("You must accept the Terms and Conditions.");
            return;
        }

        setSubmitting(true);
        setError(null);

        const result = await signUpWithPassword(email, password, `${firstName.trim()} ${lastName.trim()}`);
        setSubmitting(false);

        if (result.error) {
            setError(result.error);
            return;
        }

        if (result.needsConfirmation) {
            setConfirmationSent(true);
            return;
        }

        navigate("/dashboard");
    };

    return (
        <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
            <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
                <Link to="/" className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    <ChevronLeftIcon className="size-5" />
                    Back to dashboard
                </Link>
            </div>
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Sign Up
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enter your email and password to sign up!
                        </p>
                    </div>
                    <div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
                            <AuthProviders provider="facebook" />
                            <AuthProviders provider="google" />
                        </div>
                        <div className="relative py-3 sm:py-5">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                                    Or
                                </span>
                            </div>
                        </div>
                        {confirmationSent ? (
                            <Alert
                                variant="success"
                                title="Check your email"
                                message={`We sent a confirmation link to ${email}. Click it to activate your account.`}
                            />
                        ) : (
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="space-y-5">
                                    {error && <Alert variant="error" title="Sign up failed" message={error} />}
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        {/* <!-- First Name --> */}
                                        <div className="sm:col-span-1">
                                            <Label>
                                                First Name<span className="text-error-500">*</span>
                                            </Label>
                                            <Input
                                                type="text"
                                                id="fname"
                                                name="fname"
                                                placeholder="Enter your first name"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>
                                        {/* <!-- Last Name --> */}
                                        <div className="sm:col-span-1">
                                            <Label>
                                                Last Name<span className="text-error-500">*</span>
                                            </Label>
                                            <Input
                                                type="text"
                                                id="lname"
                                                name="lname"
                                                placeholder="Enter your last name"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    {/* <!-- Email --> */}
                                    <div>
                                        <Label>
                                            Email<span className="text-error-500">*</span>
                                        </Label>
                                        <Input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    {/* <!-- Password --> */}
                                    <div>
                                        <Label>
                                            Password<span className="text-error-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                placeholder="Enter your password"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <span
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                            >
                                                {showPassword ? (
                                                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                                ) : (
                                                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    {/* <!-- Repeat Password --> */}
                                    <div>
                                        <Label>
                                            Repeat Password<span className="text-error-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                placeholder="Repeat password"
                                                type={showRepeatPassword ? "text" : "password"}
                                                name="repeatPassword"
                                                value={repeatPassword}
                                                onChange={(e) => setRepeatPassword(e.target.value)}
                                            />
                                            <span
                                                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                            >
                                                {showRepeatPassword ? (
                                                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                                ) : (
                                                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    {/* <!-- Checkbox --> */}
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            className="w-5 h-5"
                                            checked={isChecked}
                                            onChange={setIsChecked}
                                        />
                                        <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                                            By creating an account means you agree to the{" "}
                                            <span className="text-gray-800 dark:text-white/90">
                                                Terms and Conditions,
                                            </span>{" "}
                                            and our{" "}
                                            <span className="text-gray-800 dark:text-white">
                                                Privacy Policy
                                            </span>
                                        </p>
                                    </div>
                                    {/* <!-- Button --> */}
                                    <div>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
                                        >
                                            {submitting ? "Creating account..." : "Sign Up"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        <div className="mt-5">
                            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                                Already have an account? {""}
                                <Link to="/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
