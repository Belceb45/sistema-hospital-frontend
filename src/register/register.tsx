import {
  Activity,
  Calendar,
  FileText,
  Link as LinkIcon,
  User,
  AlertCircle,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../lib/user-service";
import { useState } from "react";

function register() {

  const navigate=useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    curp: "",
    number1: "",
    number2: "",
    dateOfBirth: "",
    address: "",
    emergencyContact1: "",
    emergencyContact2: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  ///
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.name === "curp" || e.target.name === "fileNumber" ? e.target.value.toUpperCase() : e.target.value

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }))
  }


  ///
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.curp.length !== 18) {
      setError("El CURP debe tener 18 caracteres");
      return;
    }

    

    setLoading(true);

    try {
      const success = await registerUser(formData);

      if (success) {
        navigate("/dashboard");
        
      } else {
        setError("Este CURP o número de expediente ya está registrado");
      }
    } catch (err) {
      setError("Ha ocurrido un error. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  ///////////////////////////777
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background py-8 px-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Activity className="h-10 w-10 text-primary" />
          <h1 className="text-3xl font-bold text-primary">
            Portal de Pacientes
          </h1>
        </div>

        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
            <CardDescription>
              Completa el formulario para registrarte en el portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="">
                <div className="space-y-2">
                  <Label htmlFor="curp">CURP *</Label>
                  <Input
                    id="curp"
                    name="curp"
                    type="text"
                    placeholder="DAGE691207MDFRRL09"
                    value={formData.curp}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    maxLength={18}
                    className="uppercase"
                  />
                  <p className="text-xs text-muted-foreground">18 caracteres</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Juan Pérez García"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+52 55 1234 5678"
                    value={formData.number1}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Fecha de Nacimiento *</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección *</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Av. Reforma 123, Ciudad de México"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">
                  Contacto de Emergencia 1*
                </Label>
                <Input
                  id="emergencyContact"
                  name="emergencyContact"
                  type="tel"
                  placeholder="+52 55 8765 4321"
                  value={formData.emergencyContact1}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">
                  Contacto de Emergencia 2*
                </Label>
                <Input
                  id="emergencyContact"
                  name="emergencyContact"
                  type="tel"
                  placeholder="+52 55 4017 4321"
                  value={formData.emergencyContact2}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Tu CURP y número de expediente son los únicos datos necesarios
                  para acceder. Guárdalos en un lugar seguro.
                </AlertDescription>
              </Alert>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <div className="text-sm text-muted-foreground text-center">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Inicia sesión aquí
              </Link>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default register;
