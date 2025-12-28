import { useEffect, useState } from "react";
import NavbarLog from "../components/NavbarLog";
import Button from "@mui/material/Button";
import { useUser } from "../lib/user-context";
import { Link } from "react-router-dom";
import { fetchCitasPaciente, fetchDoctorAsignado } from "../lib/citas-service"; 
import type { Cita } from "../types/cita";
import { useDoctor } from "../lib/doctor-context";

// Estilos UI
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";

// Iconos (Agregamos FileText)
import { 
  Calendar, 
  User, 
  Clock, 
  MapPin, 
  Activity, 
  Stethoscope, 
  ArrowRight,
  Map,
  FileText // <--- IMPORTADO
} from "lucide-react";

// Tipo auxiliar extendido para la UI
interface CitaExtendida extends Cita {
  doctorNombre?: string;
  doctorEspecialidad?: string;
}

function Board() {
  const { user } = useUser();
  const { doctor } = useDoctor(); 

  const [citas, setCitas] = useState<CitaExtendida[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarCitas = async () => {
      try {
        if (user?.id) {
          const data = await fetchCitasPaciente(user.id);
          
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);

          // Filtrar activas
          const citasActivas = data.filter((c) => {
             const fechaCita = new Date(`${c.fecha}T${c.hora}`);
             const estado = c.estado ? c.estado.toLowerCase() : "";
             return estado !== "cancelada" && fechaCita >= hoy;
          });

          // ENRIQUECER CON DATOS DEL DOCTOR ESPECÍFICO
          const uniqueDocIds = Array.from(new Set(citasActivas.map(c => c.doctor)));
          
          const docsMap: Record<string, {nombre: string, especialidad: string}> = {};
          
          await Promise.all(uniqueDocIds.map(async (docId) => {
              if (docId) {
                  try {
                      const d = await fetchDoctorAsignado(docId);
                      docsMap[docId] = { nombre: d.nombre, especialidad: d.especialidad };
                  } catch (e) {
                      console.error("Error fetching doc info", docId);
                  }
              }
          }));

          const citasEnriquecidas = citasActivas.map(c => ({
              ...c,
              doctorNombre: docsMap[c.doctor]?.nombre || "Desconocido",
              doctorEspecialidad: docsMap[c.doctor]?.especialidad || "General"
          }));

          citasEnriquecidas.sort((a, b) => {
            const dateA = new Date(`${a.fecha}T${a.hora}`);
            const dateB = new Date(`${b.fecha}T${b.hora}`);
            return dateA.getTime() - dateB.getTime();
          });

          setCitas(citasEnriquecidas);
        }
      } catch (error) {
        console.error("Error al cargar citas", error);
      } finally {
        setLoading(false);
      }
    };

    cargarCitas();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-background font-sans">
      <NavbarLog />

      <main className="container mx-auto px-4 py-8 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* --- HERO SECTION --- */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-border p-8 mb-8">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
                Hola, <span className="text-primary">{user?.nombreCompleto?.split(" ")[0]}</span> 
              </h1>
              <p className="text-muted-foreground text-lg">
                Bienvenido a tu panel de salud personal.
              </p>
            </div>
           
            {doctor && (
                <div className="hidden md:flex bg-background/50 backdrop-blur-sm p-3 rounded-2xl border border-border shadow-sm items-center gap-4">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-700">
                        <Stethoscope size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase">Médico de General</p>
                        <p className="text-sm font-bold text-foreground">Dr. {doctor.nombre}</p>
                    </div>
                </div>
            )}
          </div>
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        </div>

        {/* --- DASHBOARD GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA IZQUIERDA (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            
          
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Calendar className="text-primary h-5 w-5" />
                        Tu Agenda Médica
                    </h2>
                    <Link to="/citas" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                        Ver calendario completo <ArrowRight size={14}/>
                    </Link>
                </div>

                <Card className="shadow-lg border-border/60 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-8 text-center space-y-3">
                            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-muted-foreground">Sincronizando agenda...</p>
                        </div>
                    ) : citas.length > 0 ? (
                    <div className="divide-y divide-border">
                        {citas.slice(0, 3).map((cita) => {
                        const fechaObj = new Date(`${cita.fecha}T${cita.hora}`);
                        return (
                            <div key={cita.id} className="group p-6 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                <div className="flex flex-col items-center justify-center bg-primary/5 border border-primary/10 rounded-2xl px-5 py-3 min-w-[80px] group-hover:bg-primary/10 transition-colors">
                                    <span className="text-2xl font-bold text-primary">
                                        {fechaObj.getDate()}
                                    </span>
                                    <span className="text-xs font-bold text-primary/70 uppercase tracking-wider">
                                        {fechaObj.toLocaleDateString("es-ES", { month: "short" })}
                                    </span>
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                            Consulta
                                        </span>
                                        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                            <Clock size={12} />
                                            {fechaObj.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                    </div>
                                    
                                    <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                                        Dr. {cita.doctorNombre}
                                    </h4>
                                    
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className={`flex items-center gap-1.5 ${cita.doctorEspecialidad !== 'Medicina General' ? 'text-purple-600 font-medium' : ''}`}>
                                            <Stethoscope size={14} /> {cita.doctorEspecialidad}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <MapPin size={14} /> Consultorio 1
                                        </span>
                                    </div>
                                </div>

                                <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="outlined" size="small" sx={{ borderRadius: 20, textTransform: 'none' }}>
                                        Detalles
                                    </Button>
                                </div>
                            </div>
                        );
                        })}
                    </div>
                    ) : (
                    <div className="text-center py-12 px-6">
                        <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">Todo despejado</h3>
                        <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
                        No tienes citas programadas próximamente.
                        </p>
                        <Link to="/citas/nueva">
                            <Button variant="contained" sx={{ borderRadius: 2, textTransform: 'none', boxShadow: 'none' }}>
                                Agendar nueva cita
                            </Button>
                        </Link>
                    </div>
                    )}
                </CardContent>
                {citas.length > 0 && (
                    <div className="bg-muted/30 p-3 text-center border-t border-border">
                        <Link to="/citas" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                            Ver todas mis citas ({citas.length})
                        </Link>
                    </div>
                )}
                </Card>
            </div>

    
            <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Map className="text-primary h-5 w-5" />
                    Ubicación de la Clínica
                </h2>
                <Card className="shadow-lg border-border/60 overflow-hidden">
                    <div className="aspect-video w-full bg-slate-100 relative">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.5037989939144!2d-99.13170228509376!3d19.486749386851676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1f9a0cffdff01%3A0x631b4564a293f318!2sHospital%20Angeles%20Lindavista!5e0!3m2!1ses!2smx!4v1678901234567!5m2!1ses!2smx"
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen={true} 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Ubicación Hospital Angeles Lindavista"
                            className="absolute inset-0 w-full h-full"
                        ></iframe>
                    </div>
                    <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="font-bold text-foreground">Hospital Angeles Lindavista</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin size={14}/> Riobamba 639, Magdalena de las Salinas, CDMX
                            </p>
                        </div>
                        <Button 
                            variant="outlined" 
                            size="small"
                            href="https://www.google.com/maps/place/Hospital+Angeles+Lindavista/@19.4867494,-99.1295136,17z/data=!3m1!4b1!4m6!3m5!1s0x85d1f9a0cffdff01:0x631b4564a293f318!8m2!3d19.4867494!4d-99.1295136!16s%2Fg%2F11b6g8q0y3?entry=ttu" 
                            target="_blank"
                            startIcon={<MapPin size={16}/>}
                            sx={{ textTransform: 'none', borderRadius: 2 }}
                        >
                            Cómo llegar
                        </Button>
                    </CardContent>
                </Card>
            </div>

          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">Acciones Rápidas</h2>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                <Link to="/citas/nueva" className="block group">
                    <Card className="border-2 border-border/50 hover:border-primary/50 hover:shadow-md transition-all duration-300 h-full">
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <Calendar className="h-6 w-6 text-primary group-hover:text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">Agendar Cita</h3>
                                <p className="text-xs text-muted-foreground">Programar consulta</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link to="/profile" className="block group">
                    <Card className="border-2 border-border/50 hover:border-chart-2/50 hover:shadow-md transition-all duration-300 h-full">
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="bg-chart-2/10 p-3 rounded-xl group-hover:bg-chart-2 group-hover:text-white transition-colors duration-300">
                                <User className="h-6 w-6 text-chart-2 group-hover:text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground group-hover:text-chart-2 transition-colors">Mi Perfil</h3>
                                <p className="text-xs text-muted-foreground">Datos personales</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>


            <Card className="bg-sidebar text-sidebar-foreground border-sidebar-border shadow-md overflow-hidden relative">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="h-4 w-4 text-accent" />
                        Resumen
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-4xl font-bold text-primary">{citas.length}</p>
                            <p className="text-sm text-muted-foreground font-medium mt-1">Citas pendientes</p>
                        </div>
                        <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center mb-2">
                            <Stethoscope size={20} className="text-primary"/>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
                        <span>Estado del servicio</span>
                        <span className="flex items-center gap-1 text-green-600 font-bold">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            En línea
                        </span>
                    </div>
                </CardContent>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
            </Card>

          
            <Link to="/resultados" className="block group">
                <Card className="bg-white border-2 border-border/50 hover:border-blue-500/50 hover:shadow-md transition-all duration-300 overflow-hidden relative">
                    <CardHeader className="pb-2">
                         <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                            <FileText className="h-5 w-5 text-blue-600" />
                            Resultados
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-foreground font-medium group-hover:text-blue-600 transition-colors">
                                    Estudios de Laboratorio
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Consulta y descarga tus reportes en PDF.
                                </p>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                <ArrowRight size={20} className="text-blue-600 group-hover:text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Board;