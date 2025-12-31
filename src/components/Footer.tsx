import { Link } from "react-router-dom";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  HeartPulse, 
  ArrowRight 
} from "lucide-react";

export default function Footer() {
  return (
  
    <footer className="bg-primary text-white pt-16 pb-8 border-t border-blue-700">
      <div className="container mx-auto px-4">
        

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
     
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white text-xl font-bold">
              <div className="bg-blue-470 p-2 rounded-lg shadow-md border border-blue-500">
                <HeartPulse size={24} className="text-white" />
              </div>
              <span>Hospital System</span>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed opacity-90">
              Comprometidos con tu salud. Tecnología de vanguardia y especialistas certificados para brindarte la mejor atención.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="hover:bg-blue-700 p-2 rounded-full transition-all"><Facebook size={20} /></a>
              <a href="#" className="hover:bg-blue-700 p-2 rounded-full transition-all"><Twitter size={20} /></a>
              <a href="#" className="hover:bg-blue-700 p-2 rounded-full transition-all"><Instagram size={20} /></a>
            </div>
          </div>

       
          <div>
            <h3 className="font-bold mb-6 text-blue-200 uppercase tracking-wider text-xs">Navegación</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link to="/board" className="hover:text-blue-200 hover:translate-x-1 transition-all flex items-center gap-2">
                  <ArrowRight size={14} className="text-blue-400" /> Inicio
                </Link>
              </li>
              <li>
                <Link to="/citas/nueva" className="hover:text-blue-200 hover:translate-x-1 transition-all flex items-center gap-2">
                  <ArrowRight size={14} className="text-blue-400" /> Agendar Cita
                </Link>
              </li>
              <li>
                <Link to="/resultados" className="hover:text-blue-200 hover:translate-x-1 transition-all flex items-center gap-2">
                  <ArrowRight size={14} className="text-blue-400" /> Resultados
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-blue-200 hover:translate-x-1 transition-all flex items-center gap-2">
                  <ArrowRight size={14} className="text-blue-400" /> Mi Perfil
                </Link>
              </li>
            </ul>
          </div>


          <div>
            <h3 className="font-bold mb-6 text-blue-200 uppercase tracking-wider text-xs">Soporte</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="#" className="hover:text-blue-200 transition-colors">Centro de Ayuda</a></li>
              <li><a href="#" className="hover:text-blue-200 transition-colors">Aviso de Privacidad</a></li>
              <li><a href="#" className="hover:text-blue-200 transition-colors">Términos y Condiciones</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-6 text-blue-200 uppercase tracking-wider text-xs">Contacto</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-300 mt-0.5 shrink-0" />
                <span className="opacity-90">
                  Riobamba 639, Magdalena de las Salinas,<br />
                  Gustavo A. Madero, 07760 CDMX
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-300 shrink-0" />
                <span className="opacity-90">55 5555 5555</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-300 shrink-0" />
                <span className="opacity-90">contacto@hospital.com</span>
              </li>
            </ul>
          </div>

        </div>

     
        <div className="border-t border-blue-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-blue-200">
          <p>© {new Date().getFullYear()} Hospital System. Todos los derechos reservados.</p>
          <div className="flex gap-6 font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
}