import { ButtonHTMLAttributes, ReactNode, useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    variant?: "primary" | "danger" | "secondary";
    loading?: boolean;
    confirm?: boolean;
    confirmTitle?: string;
    confirmMessage?: string;
    onConfirm?: () => void;
};

export default function Button({
    children,
    variant = "primary",
    loading = false,
    className = "",
    confirm = false,
    confirmTitle = "Confirmar ação?",
    confirmMessage = "Tem certeza que deseja continuar? Esta ação não pode ser desfeita.",
    onClick,
    onConfirm,
    ...props
}: ButtonProps) {
    const [open, setOpen] = useState(false);

    const base =
        "flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition focus:outline-none";
    const variants: Record<string, string> = {
        primary: "bg-blue-600 text-white shadow hover:bg-blue-700",
        danger: "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100",
        secondary: "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700",
    };

    function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        if (confirm) {
            e.preventDefault();
            setOpen(true);
        } else if (onClick) {
            onClick(e);
        }
    }

    function handleConfirm() {
        setOpen(false);
        if (onConfirm) onConfirm();
    }

    return (
        <>
            <button
                className={`${base} ${variants[variant]} ${className}`}
                disabled={loading || props.disabled}
                onClick={handleClick}
                {...props}
            >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {children}
            </button>
            {open && (
                <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 max-w-xs w-full flex flex-col items-center gap-4 border border-zinc-200 dark:border-zinc-800">
                        <AlertTriangle size={36} className="text-red-500" />
                        <div className="font-semibold text-lg text-center">{confirmTitle}</div>
                        <div className="text-zinc-500 text-sm mb-2 text-center">{confirmMessage}</div>
                        <div className="flex gap-3 w-full">
                            <button
                                className={`${base} ${variants.secondary} flex-1`}
                                onClick={() => setOpen(false)}
                                disabled={loading}
                                type="button"
                            >
                                Cancelar
                            </button>
                            <button
                                className={`${base} ${variants.danger} flex-1 bg-red-500 text-white hover:bg-red-600 border-none`}
                                onClick={handleConfirm}
                                disabled={loading}
                                type="button"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : "Confirmar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}