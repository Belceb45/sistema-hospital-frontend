import { Link, useNavigate, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import { useUser } from "../lib/user-context";
import {
  Activity,
  LogOut,
  User,
  LayoutDashboard,
  Calendar
} from "lucide-react";

export default function NavbarLog() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };


  const getButtonStyle = (path: string) => {
    const isActive = location.pathname === path;
    return {
      textTransform: 'none',
      fontWeight: isActive ? 700 : 500,
      color: isActive ? 'var(--primary)' : '#64748b', // Primary vs Slate-500
      backgroundColor: isActive ? 'rgba(var(--primary), 0.08)' : 'transparent',
      borderRadius: '12px',
      px: 2,
      minWidth: 'auto',
      '&:hover': {
        backgroundColor: isActive ? 'rgba(var(--primary), 0.12)' : '#f1f5f9',
        color: 'var(--primary)',
      }
    };
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        <Link to="/board" className="flex items-center gap-2 group mr-4">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
            <Activity className="h-6 w-6 text-primary group-hover:text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">
            Portal<span className="text-primary">Pacientes</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 md:gap-2">
          <Link to="/board">
            <Button variant="text" sx={getButtonStyle('/board')} startIcon={<LayoutDashboard size={18} />}>
              Inicio
            </Button>
          </Link>

          <Link to="/citas">
            <Button variant="text" sx={getButtonStyle('/citas')} startIcon={<Calendar size={18} />}>
              Mis Citas
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-3 md:gap-4 ml-4">

          {user && (
            <Link to="/profile">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100 shadow-sm">
                <div className="bg-blue-100 p-1 rounded-full">
                  <User size={14} className="text-blue-700" />
                </div>

                <span className="text-sm font-semibold text-slate-700 max-w-[120px] truncate">
                  {user.nombreCompleto?.split(" ")[0]}
                </span>

              </div>

            </Link>
          )}

          <div className="hidden md:block h-6 w-px bg-slate-200"></div>

          <Button
            variant="outlined"
            onClick={handleLogout}
            startIcon={<LogOut size={16} />}
            size="small"
            sx={{
              textTransform: 'none',
              borderRadius: '99px',
              px: 2,
              fontWeight: 600,
              color: '#64748b',
              borderColor: '#e2e8f0',
              '&:hover': {
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                borderColor: '#fecaca',
              }
            }}
          >
            Salir
          </Button>
        </div>

      </div>
    </header>
  );
}