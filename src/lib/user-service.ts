import { validarCurp } from "./validaciones";
import {USER_API} from "../api/user.api"


export async function registerUser(data: any): Promise<any|null> {
  try {
    const res = await fetch(USER_API.REGISTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) return null;

    return await res.json();
  } catch (error) {
    console.error("Error en registerUser:", error);
    return false;
  }
}

export async function loginUser(identifier: string): Promise<any | null> {
  // identifier = curp o número de expediente

  try {
    // Decidir qué enviar según si es un CURP válido
    const payload = validarCurp(identifier)
      ? { curp: identifier }
      : { numExpediente: identifier };

    const res = await fetch(USER_API.LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const text: string = await res.text();


    if (!res.ok) {
      return { error: text };
    }


    return JSON.parse(text);

  } catch (error) {
    console.error("Error en loginUser:", error);
    return { error: "Error de conexión con el servidor" };
  }

}

export async function updateUser(
  userId: string,
  data: any
): Promise<any | null> {
  try {
    console.log(USER_API.UPDATE(userId));
    
    const res = await fetch(USER_API.UPDATE(userId), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const text = await res.text();
      return { error: text };
    }

    return await res.json();
  } catch (error) {
    console.error("Error en updateUser:", error);
    return { error: "Error de conexión" };
  }
}


export async function updateDoctor(userId: string) {
  const res = await fetch(USER_API.UPDATEDOCTOR(userId),
    {
      method: "PUT",
    }
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}
