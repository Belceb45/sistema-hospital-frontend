/* --------------------------
   TIPOS
--------------------------- */
import type {Cita} from "../types/cita"
import type {Doctor} from "../types/doctor"

const API_URL = "http://localhost:8080/api/citas";
const API_URL_DOCTOR = "http://localhost:8080/api/doctores"


/* --------------------------
   DOCTOR
--------------------------- */
export async function fetchDoctorAsignado(doctorId: string): Promise<Doctor> {
  const res = await fetch(`${API_URL_DOCTOR}/${doctorId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

/* --------------------------
   1. CITAS DISPONIBLES
--------------------------- */
export async function fetchCitasDisponibles(pacienteId: string): Promise<Cita[]> {
  const res = await fetch(`${API_URL}/disponibles?pacienteId=${pacienteId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

/* --------------------------
   2. CITAS DE UN PACIENTE
--------------------------- */
export async function fetchCitasPaciente(pacienteId: string): Promise<Cita[]> {
  const res = await fetch(`${API_URL}/paciente/${pacienteId}`, {
    cache: "no-store",
  });

  
  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

/* --------------------------
   3. AGENDAR CITA
--------------------------- */
export async function agendarCita(
  idCita: string,
  pacienteId: string
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${API_URL}/agendar/${idCita}?pacienteId=${pacienteId}`, {
    method: "POST",
  });

  const text = await res.text();

  return res.ok ? { success: true } : { success: false, error: text };
}

/* --------------------------
   4. CANCELAR CITA
--------------------------- */
export async function cancelarCita(
  idCita: string
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${API_URL}/cancelar/${idCita}`, {
    method: "POST",
  });

  const text = await res.text();

  return res.ok ? { success: true } : { success: false, error: text };
}

/* --------------------------
   5. REAGENDAR CITA
--------------------------- */
export async function reagendarCita(
  idCitaActual: string,
  idNuevaCita: string,
  pacienteId: string
): Promise<{ success: boolean; error?: string }> {

  const params = new URLSearchParams({
    idCitaActual,
    idNuevaCita,
    pacienteId: pacienteId.toString(),
  });

  const res = await fetch(`${API_URL}/reagendar?${params}`, {
    method: "POST",
  });

  const text = await res.text();

  return res.ok ? { success: true } : { success: false, error: text };
}
