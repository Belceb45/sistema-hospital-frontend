const API_URL = "http://localhost:8080/api/users";

export async function registerUser(data: any): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return res.ok;
  } catch (error) {
    console.error("Error en registerUser:", error);
    return false;
  }
}

export async function loginUser(identifier: string): Promise<any | null> {
  // identifier = curp o número de expediente
  try {
    const res = await fetch(`${API_URL}/find/${identifier}`);

    if (!res.ok) return null;

    return await res.json();
  } catch (error) {
    console.error("Error en loginUser:", error);
    return null;
  }
}
