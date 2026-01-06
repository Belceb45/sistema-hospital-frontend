import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ShieldCheck, FileText, Lock, Clock, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export default function AvisoPrivacidad() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl mb-6">
        <Link
          to="/register"
          className="text-primary hover:underline text-sm font-medium flex items-center gap-2"
        >
          ← Volver al registro
        </Link>
      </div>

      <Card className="shadow-xl border-none w-full max-w-4xl">
        <CardHeader className="bg-primary text-white rounded-t-lg p-8">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="h-8 w-8" />
            <CardTitle className="text-3xl font-bold">
              Aviso de Privacidad Integral
            </CardTitle>
          </div>
          <p className="opacity-90">Cumplimiento NOM-004-SSA3-2012 y Ley 2025</p>
          <p className="opacity-75 text-sm">Última actualización: Marzo 2025</p>
        </CardHeader>

        <CardContent className="p-8 space-y-8 text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
              <Lock className="h-5 w-5 text-primary" /> 1. Responsable del Tratamiento
            </h2>
            <p>
              <b>[Nombre de tu Clínica o Empresa]</b>, con domicilio en [Dirección], es responsable de recabar sus datos personales y protegerlos conforme a la <b>Ley Federal de Protección de Datos Personales (Nueva Ley 2025)</b>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
              <FileText className="h-5 w-5 text-primary" /> 2. Datos Personales Sensibles
            </h2>
            <p>
              Trataremos datos de salud (diagnósticos, recetas y laboratorio) necesarios para su atención médica y la integración de su expediente.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
              <Clock className="h-5 w-5 text-primary" /> 3. Conservación Legal (NOM-004)
            </h2>
            <p className="bg-slate-50 p-4 border-l-4 border-primary">
              En cumplimiento con la <b>NOM-004-SSA3-2012</b>, su expediente clínico se conservará por un mínimo de <b>5 años</b> posteriores a su última consulta.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
              <RefreshCw className="h-5 w-5 text-primary" /> 4. Derechos ARCO y Portabilidad
            </h2>
            <p>
              Usted puede ejercer sus derechos de Acceso, Rectificación, Cancelación u Oposición. Además, bajo la reforma de 2025, tiene derecho a la <b>portabilidad digital</b> de sus datos médicos.
            </p>
          </section>

          <div className="border-t pt-6 text-sm text-slate-500">
            <p>Para dudas, contacte a: <b>serviciocliente@hospitalportal.com</b></p>
          </div>
        </CardContent>
      </Card>
     
      <div className="h-20"></div>
    </div>
  );
}