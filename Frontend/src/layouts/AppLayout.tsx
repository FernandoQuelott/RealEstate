import { NavLink, Outlet } from "react-router-dom";
import { Button } from "@/components/Button";
import { tokenStorage } from "@/utils/storage";

const navItems = [
    { to: "/apartamentos", label: "Apartamentos" },
    { to: "/clientes", label: "Clientes" },
    { to: "/reservas", label: "Reservas" },
    { to: "/vendas", label: "Vendas" }
];

export const AppLayout = () => {
    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#e9fff8_0,_#f8fafc_45%,_#eef3ff_100%)]">
            <header className="border-b border-ink-900/10 bg-white/75 backdrop-blur">
                <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
                    <div>
                        <p className="font-title text-xl font-bold text-ink-900">Real Estate Portal</p>
                        <p className="text-xs text-ink-500">Gestao completa de apartamentos, clientes, reservas e vendas</p>
                    </div>

                    <nav className="flex flex-wrap items-center gap-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `rounded-xl px-3 py-2 text-sm font-semibold transition ${isActive ? "bg-brand-500 text-white" : "text-ink-700 hover:bg-ink-900/5"
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    <Button
                        variant="ghost"
                        onClick={() => {
                            tokenStorage.clear();
                            window.location.href = "/login";
                        }}
                    >
                        Sair
                    </Button>
                </div>
            </header>

            <main className="mx-auto w-full max-w-7xl px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
};
