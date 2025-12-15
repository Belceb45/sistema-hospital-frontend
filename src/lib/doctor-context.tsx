// doctor-context.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Doctor } from "../types/doctor"; // Asegúrate que la ruta sea correcta

interface DoctorContextType {
  doctor: Doctor | null;
  setDoctor: (doctor: Doctor | null) => void;
  loadingDoctor: boolean;
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export const DoctorProvider = ({ children }: { children: ReactNode }) => {
  const [doctor, setDoctorState] = useState<Doctor | null>(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);

  // 1. Cargar desde LocalStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem("doctor_data");
    if (stored) {
      try {
        setDoctorState(JSON.parse(stored));
      } catch (e) {
        console.error("Error al leer doctor del storage", e);
        localStorage.removeItem("doctor_data");
      }
    }
    setLoadingDoctor(false);
  }, []);

  // 2. Interceptor para guardar en LocalStorage cada vez que cambie
  const setDoctor = (doc: Doctor | null) => {
    setDoctorState(doc);
    if (doc) {
      localStorage.setItem("doctor_data", JSON.stringify(doc));
    } else {
      localStorage.removeItem("doctor_data");
    }
  };

  return (
    <DoctorContext.Provider value={{ doctor, setDoctor, loadingDoctor }}>
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctor = () => {
  const ctx = useContext(DoctorContext);
  if (!ctx) throw new Error("useDoctor debe usarse dentro de DoctorProvider");
  return ctx;
};