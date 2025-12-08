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
import ErrorModal from "../modal/errorModal";

function register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombreCompleto: "",
    curp: "",
    telefono: "",
    telefono2: "",
    telefono3: "",
    RFC: "",
    direccion: "",
    fechaNacimiento: ""
  });

  const [loading, setLoading] = useState(false);

  const [errorModal, setErrorModal] = useState<{ abierto: boolean; mensaje: string }>(
    {
      abierto: false,
      mensaje: "",
    }
  )

  const mostrarError = (mensaje: string) => {
    setErrorModal({ abierto: true, mensaje });
  }
  const cerrarError = () => {
    setErrorModal({ abierto: false, mensaje: "" });
  }

  ///
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.name === "curp" || e.target.name === "rfc" || e.target.name === "fileNumber" ? e.target.value.toUpperCase() : e.target.value

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }))
  }


  ///
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //setError("");

    if (!validarCurp(formData.curp)) {
      mostrarError("El curp tiene un formato invalido")
      return;
    }

    if (!validarRFC(formData.RFC)) {
      mostrarError("El RFC tiene un formato invalido");
      return;
    }



    setLoading(true);

    try {
      const success = await registerUser(formData);

      if (success) {
        navigate("/dashboard");

      } else {
        mostrarError("Este CURP o numero de expediente ya esta registrado")
        //setError("Este CURP o número de expediente ya está registrado");
      }
    } catch (err) {
      mostrarError("Ha ocurrido un error inesperado, intente de nuevo");
      //setError("Ha ocurrido un error. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  function validarCurp(curp: string) {

    const re: RegExp = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/
    const validado: RegExpMatchArray | null = curp.match(re);

    if (!validado) {
      return false;
    }
    function digitoVerificador(curp17: string): number {
      const diccionario: string = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"
      let lngSuma: number = 0.0;
      let lngDigito: number = 0.0;
      //17 caracteres CURP
      for (let index = 0; index < 17; index++)
        lngSuma = lngSuma + diccionario.indexOf(curp17.charAt(index)) * (18 - index);

      lngDigito = 10 - (lngSuma % 10);
      return lngDigito === 10 ? 0 : lngDigito;

    }
    //comparacion estricta de tipos !==
    if (parseInt(validado[2], 10) !== digitoVerificador(validado[1]))
      return false;
    return true;
  }

  // validacion RFC
  function validarRFC(rfc: string, aceptarGenerico: boolean = true): string | false {
  rfc = rfc.toUpperCase().replace(/\s+/g, '');

  // Regex actualizado: 3 letras para persona moral, 4 letras para persona física
  const re = /^([A-ZÑ&]{3,4})(\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([A-Z\d]{2})([0-9A-Z])$/;
  const match = rfc.match(re);

  if (!match) return false;

  const [_, rfcBase, anio, mes, dia, homoclave, digitoVerificador] = match;
  const rfcSinDigito = rfcBase + anio + mes + dia + homoclave;
  const len = rfcSinDigito.length;

  const diccionario = "0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ Ñ";
  const indice = len + 1;

  let suma = len === 12 ? 0 : 481; // Ajuste para persona moral

  for (let i = 0; i < len; i++) {
    suma += diccionario.indexOf(rfcSinDigito.charAt(i)) * (indice - i);
  }

  let digitoEsperado: number | string = 11 - (suma % 11);
  if (digitoEsperado === 11) digitoEsperado = 0;
  else if (digitoEsperado === 10) digitoEsperado = "A";

  if ((digitoVerificador !== digitoEsperado.toString()) &&
      (!aceptarGenerico || rfcSinDigito + digitoVerificador !== "XAXX010101000")) return false;
  if (!aceptarGenerico && rfcSinDigito + digitoVerificador === "XEXX010101000") return false;

  return rfc;
}



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
                  id="nombreCompleto"
                  name="nombreCompleto"
                  type="text"
                  placeholder=""
                  value={formData.nombreCompleto}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    type="text"
                    placeholder="5512345678"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Fecha de Nacimiento *</Label>
                  <Input
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono1">Telefono de emergencia 1 *</Label>
                <Input
                  id="telefono2"
                  name="telefono2"
                  type="text"
                  placeholder="5512345678"
                  value={formData.telefono2}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono3">Telefono de emergencia 2 *</Label>
                <Input
                  id="telefono3"
                  name="telefono3"
                  type="text"
                  placeholder="5512345678"
                  value={formData.telefono3}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección *</Label>
                <Input
                  id="address"
                  name="direccion"
                  type="text"
                  placeholder="Av. Reforma 123, Ciudad de México"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rfc">RFC *</Label>
                <Input
                  id="rfc"
                  name="RFC"
                  type="text"
                  placeholder=""
                  value={formData.RFC}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="uppercase"

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

      <ErrorModal
        abierto={errorModal.abierto}
        mensaje={errorModal.mensaje}
        cerrarModal={cerrarError}
      />




    </div>
  );
}

export default register;
