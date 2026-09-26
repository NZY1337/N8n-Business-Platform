import { Bot, Zap, Users, Activity } from 'lucide-react';
import PageMeta from "../../components/common/PageMeta";
import { useCurrentUser } from '../../hooks/useCurrentUser';

// ── Stat card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    sub?: string;
}

function StatCard({ icon, label, value, sub }: StatCardProps) {
    return (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-5 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">
                {icon}
            </div>
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white/90">{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

// ── Entry point ───────────────────────────────────────────────────────────────
// Placeholder dashboard for the automation business. The old fitness widgets
// (workout/nutrition/weight tracking) were removed along with the backend
// modules behind them. Wire up real automation/client data here once the
// new domain model (Client, Automation, Execution) exists.

export default function Home() {
    const { currentUser } = useCurrentUser();

    return (
        <>
            <PageMeta
                title="Dashboard - Streamloop"
                description="Overview of your automation business."
            />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                    Bine ai venit{currentUser?.email ? `, ${currentUser.email}` : ''}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Aici vei vedea automatizările, clienții și execuțiile tale.
                </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard icon={<Bot className="w-5 h-5" />} label="Automatizări active" value={0} />
                <StatCard icon={<Zap className="w-5 h-5" />} label="Execuții luna asta" value={0} />
                <StatCard icon={<Users className="w-5 h-5" />} label="Clienți" value={0} />
                <StatCard icon={<Activity className="w-5 h-5" />} label="Uptime" value="—" />
            </div>

            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-10 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center mb-4">
                    <Bot className="w-6 h-6 text-brand-500" />
                </div>
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nicio automatizare conectată încă</h2>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                    Dashboard-ul e pregătit pentru noul model — clienți, automatizări n8n și execuții. Se populează pe măsură ce le construim.
                </p>
            </div>
        </>
    );
}
