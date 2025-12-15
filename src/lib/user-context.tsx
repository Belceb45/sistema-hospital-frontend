import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type {User} from "../types/user"

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  updateProfile:(userData:Partial<User>)=>void
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión almacenada al iniciar la app
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUserState(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const setUser = (user: User | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  //

  const updateProfile=(userData:Partial<User>)=>{
    if (user) {
      const updateUser={...user,...userData}
      setUser(updateUser)
      localStorage.setItem("user",JSON.stringify(updateUser));
    }
  }


  return (
    <UserContext.Provider value={{ user, setUser, logout,updateProfile,loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser debe usarse dentro de UserProvider");
  return ctx;
};
