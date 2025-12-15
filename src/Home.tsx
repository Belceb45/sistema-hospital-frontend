import Navbar from "./components/Navbar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "./components/ui/card";
import {
  Activity,
  Calendar,
  FileText,
  User,
  ArrowRight,
  ShieldCheck,
  Stethoscope
} from "lucide-react";

import { Link } from "react-router-dom";
import Button from "@mui/material/Button";


import logoEscom from "../public/logoEscom.png"; 

function Home() {
  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <Navbar />

      <main className="flex-1">
        
        <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pb-16 pt-24 lg:pt-32">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-green-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <ShieldCheck size={16} /> Portal Seguro de Pacientes
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 text-balance">
              Tu salud, <span className="text-primary">siempre accesible</span> y en buenas manos.
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto text-balance animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Gestiona tus citas médicas, consulta resultados de laboratorio y mantén tu historial clínico actualizado 
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Link to="/register">
                  <Button 
                    variant="contained" 
                    size="large" 
                    endIcon={<ArrowRight size={18} />}
                    sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: '50px', textTransform: 'none' }}
                  >
                    Comenzar ahora
                  </Button>
              </Link>
              <Link to="/login">
                  <Button 
                    variant="outlined" 
                    size="large"
                    sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: '50px', textTransform: 'none', borderWidth: '2px' }}
                  >
                    Ya tengo cuenta
                  </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Todo lo que necesitas en un solo lugar</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">Diseñado para simplificar tu experiencia médica y darte el control total.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                <FeatureCard 
                    icon={Calendar} 
                    title="Gestión de Citas" 
                    desc="Agenda, reprograma o cancela tus consultas médicas en segundos sin llamadas telefónicas."
                />
                <FeatureCard 
                    icon={FileText} 
                    title="Resultados Digitales" 
                    desc="Recibe tus resultados de laboratorio directamente en tu perfil tan pronto estén listos."
                />
                <FeatureCard 
                    icon={User} 
                    title="Perfil Personal" 
                    desc="Actualiza tus datos de contacto y emergencia fácilmente para mantenernos conectados."
                />
                <FeatureCard 
                    icon={Activity} 
                    title="Historial Clínico" 
                    desc="Acceso seguro a tu historial de consultas y tratamientos previos para tu referencia."
                />
                </div>
            </div>
        </div>

        <div className="container mx-auto px-4 py-16">
            <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground max-w-5xl mx-auto shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                
                <div className="relative z-10 p-10 md:p-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
                            <Stethoscope size={16} /> Nuevo Paciente
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Primera vez aquí?</h2>
                        <p className="text-lg text-blue-100 mb-0">
                            Regístrate en nuestro portal para acceder a todos los servicios. Es rápido, seguro y gratuito.
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <Link to="/register">
                            <Button 
                                variant="contained" 
                                size="large"
                                sx={{ 
                                    backgroundColor: 'white', 
                                    color: 'var(--primary)', 
                                    '&:hover': { backgroundColor: '#f8fafc' },
                                    px: 5,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    borderRadius: '12px'
                                }}
                            >
                                Crear Cuenta Gratis
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>

      </main>

      <footer className="border-t border-slate-100 bg-slate-50 py-12">
        <div className="container mx-auto px-4">
            
       
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8">
                
              
                <div className="hidden md:block"></div>

                <div className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-4 text-slate-800 font-bold text-xl">
                        <Activity className="text-primary" /> Portal Pacientes
                    </div>
                    <p className="text-slate-500 text-sm mb-4">
                        Comprometidos con tu bienestar y privacidad.
                    </p>
                    <div className="flex justify-center gap-6 text-sm text-slate-400">
                        <a href="#" className="hover:text-primary transition-colors">Términos</a>
                        <a href="#" className="hover:text-primary transition-colors">Privacidad</a>
                        <a href="#" className="hover:text-primary transition-colors">Ayuda</a>
                    </div>
                    <p className="text-xs text-slate-300 mt-6">
                        &copy; 2025 Portal de Pacientes. Todos los derechos reservados.
                    </p>
                </div>

                <div className="flex flex-col items-center md:items-end">
                    <span className="text-[10px] text-slate-400 mb-1 uppercase tracking-wider font-semibold">Desarrollado por</span>
                    <img 
                        src={logoEscom} 
                        alt="Logo ESCOM" 
                        className="h-16 w-auto opacity-90 hover:opacity-100 transition-opacity" 
                    />
                </div>

            </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <Card className="border border-slate-100 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 group">
            <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-primary mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Icon size={24} />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-base leading-relaxed">
                    {desc}
                </CardDescription>
            </CardContent>
        </Card>
    )
}

export default Home;