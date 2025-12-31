import { Link, useNavigate, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import { useState, useEffect, useRef } from "react";
import { useUser } from "../lib/user-context";
import {
  Activity,
  LogOut,
  User,
  LayoutDashboard,
  Calendar,
  Bell,
  X
} from "lucide-react";
import type { Notificacion } from "../types/notificacion";
import { fetchNotificaciones, marcarLeida } from "../lib/notificaciones-service";

export default function NavbarLog() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // --- LÓGICA DE NOTIFICACIONES ---
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [showNotis, setShowNotis] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.id) {
      cargarNotificaciones();
      const interval = setInterval(cargarNotificaciones, 30000); 
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
        setShowNotis(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cargarNotificaciones = async () => {
    if (!user?.id) return;
    try {
      const data = await fetchNotificaciones(user.id);
      setNotificaciones(data);
 
      setUnreadCount(data.filter(n => !n.leida).length);
    } catch (error) {
      console.error("Error cargando notificaciones");
    }
  };

  const handleMarcarLeida = async (id: string) => {
    await marcarLeida(id);
    
    setNotificaciones(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };
  

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getButtonStyle = (path: string) => {
    const isActive = location.pathname === path;
    return {
      textTransform: 'none',
      fontWeight: isActive ? 700 : 500,
      color: isActive ? 'var(--primary)' : '#64748b',
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

          <Link to="/resultados">
            <Button variant="text" sx={getButtonStyle('/citas')} startIcon={<Calendar size={18} />}>
              Resultados
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-3 md:gap-4 ml-4">
          <div className="flex items-center gap-4">

          
            <div className="relative" ref={notiRef}>
              <button
                onClick={() => setShowNotis(!showNotis)}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors relative text-slate-500 hover:text-blue-600"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {showNotis && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="p-3 border-b bg-slate-50 flex justify-between items-center">
                    <h3 className="font-semibold text-xs text-slate-700 uppercase tracking-wide">Notificaciones</h3>
                    <button onClick={() => setShowNotis(false)} className="text-slate-400 hover:text-slate-600">
                      <X size={14} />
                    </button>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto">
                    {notificaciones.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-sm">
                        No tienes notificaciones nuevas.
                      </div>
                    ) : (
                      notificaciones.map((noti) => (
                        <div
                          key={noti.id}
                          onClick={() => !noti.leida && handleMarcarLeida(noti.id)}
                          className={`p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer relative
                                            ${!noti.leida ? 'bg-blue-50/50' : 'opacity-70'}
                                        `}
                        >
                          {!noti.leida && (
                            <div className="absolute top-4 right-3 h-2 w-2 bg-blue-500 rounded-full"></div>
                          )}
                          <p className="text-sm text-slate-800 mb-1 pr-4 font-medium">{noti.mensaje}</p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {new Date(noti.fecha).toLocaleDateString()} - {new Date(noti.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
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
      </div>
    </header>
  );
}