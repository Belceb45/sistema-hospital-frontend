import { Activity } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";


function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
    
      
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
            <Activity className="h-6 w-6 text-primary group-hover:text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            Portal<span className="text-primary">Pacientes</span>
          </span>
        </Link>

       
        <div className="flex items-center gap-2 md:gap-4">
          
    
          <Link to="/login">
            <Button 
                variant="text" 
                sx={{ 
                    textTransform: 'none', 
                    color: '#64748b', 
                    fontWeight: 600,
                    borderRadius: '99px',
                    px: 2,
                    '&:hover': {
                        color: 'var(--primary)',
                        backgroundColor: 'rgba(var(--primary), 0.05)'
                    }
                }}
            >
                Iniciar Sesión
            </Button>
          </Link>

          <Link to="/register">
            <Button 
                variant="contained" 
                sx={{ 
                    textTransform: 'none', 
                    borderRadius: '99px',
                    px: 3,
                    py: 0.8,
                    fontWeight: 'bold',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                    }
                }}
            >
                Registrarse
            </Button>
          </Link>
        </div>

      </div>
    </header>
  );
}

export default Navbar;