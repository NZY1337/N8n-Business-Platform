import { useState } from "react";
import type React from "react";
import { Link } from "react-router";
import { ChevronLeftIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Alert from "../ui/alert/Alert";

import { useAppContext } from "../../context/AppContext";

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const { forgotPasswordEmail } = useAppContext();

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) {
            setError("Email is required.");
            return;
        }

        setSubmitting(true);
        setError(null);

        const { data, error } = await forgotPasswordEmail(email);
        setSubmitting(false);

        if (error) {
            setError(error.message);
            return;
        }

        if (data) setEmailSent(true);
    };

    return (
        <div className="flex flex-col flex-1">
            <div className="w-full max-w-md pt-10 mx-auto">
                <Link to="/signin" className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    <ChevronLeftIcon className="size-5" />
                    Back to sign in
                </Link>
            </div>
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Forgot Password
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enter the email associated with your account and we&apos;ll send you a link to reset your password.
                        </p>
                    </div>
                    <div>
                        {emailSent ? (
                            <Alert
                                variant="success"
                                title="Check your email"
                                message={`We sent a password reset link to ${email}.`}
                            />
                        ) : (
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="space-y-6">
                                    {error && <Alert variant="error" title="Something went wrong" message={error} />}
                                    <div>
                                        <Label>
                                            Email <span className="text-error-500">*</span>{" "}
                                        </Label>
                                        <Input
                                            type="email"
                                            name="email"
                                            placeholder="info@gmail.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Button className="w-full" size="sm" disabled={submitting}>
                                            {submitting ? "Sending..." : "Send reset link"}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        )}

                        <div className="mt-5">
                            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                                Remembered your password? {""}
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
