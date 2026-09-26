import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";
import streamloopIcon from "../../assets/streamloop-icon.svg";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
            <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
                {children}
                <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
                    <div className="relative flex items-center justify-center z-1">
                        <GridShape />
                        <div className="flex flex-col items-center max-w-xs">
                            <Link to="/" className="block">
                                <div className="flex items-center gap-4">
                                    <div className="w-25 h-25 bg-black flex items-center justify-center">
                                        <img src={streamloopIcon} alt="Streamloop" className="w-14 h-14" />
                                    </div>
                                    <span className="font-black text-7xl tracking-tighter text-white uppercase italic">Streamloop</span>
                                </div>
                            </Link>
                            <p className="text-white/70 text-sm tracking-wide text-left w-full">
                                Automations that run your business, not the other way around.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
                    <ThemeTogglerTwo />
                </div>
            </div>
        </div>
    );
}
