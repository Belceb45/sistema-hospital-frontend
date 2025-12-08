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
  Link as LinkIcon,
  User,
} from "lucide-react";

import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Register from './register/register';


function Home() {
  return (
    <>
      <Navbar></Navbar>
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Tu salud, siempre accesible
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Gestiona tus citas médicas, consulta resultados de laboratorio y
            mantén tu información actualizada desde cualquier lugar.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button><Link to="/register">Comenzar</Link></Button>
            <Button></Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <Calendar className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Gestión de Citas</CardTitle>
              <CardDescription>
                Agenda, consulta y cancela tus citas médicas de forma rápida y
                sencilla
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <FileText className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Resultados de Laboratorio</CardTitle>
              <CardDescription>
                Accede a tus resultados médicos en cualquier momento y lugar
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <User className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Perfil Personal</CardTitle>
              <CardDescription>
                Mantén tu información médica y de contacto siempre actualizada
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <Activity className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Historial Médico</CardTitle>
              <CardDescription>
                Consulta tu historial completo de citas y tratamientos
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="max-w-3xl mx-auto mt-16 bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl">¿Primera vez aquí?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">
              Regístrate en nuestro portal para acceder a todos los servicios
              disponibles. Solo necesitas tu correo electrónico y algunos datos
              básicos.
            </p>
            <Button><Link to="/register">Cear Cuenta</Link></Button>
          </CardContent>
        </Card>
      </main>
      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Portal de Pacientes. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}

export default Home;
