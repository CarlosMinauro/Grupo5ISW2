// src/services/ConfiguracionService.ts

import { ConfiguracionTipo } from "../types/ConfiguracionTipo";
import { API_URL, ENDPOINTS } from '../config/api';

// ============ Código original local (no eliminar) ============
let config: ConfiguracionTipo = {
  id: 1,
  nombre: "Leo Messi",
  email: "lio@gmail.com",
  password: "12345"
};

export function getConfiguracion(): ConfiguracionTipo {
  // Retorno local
  return config;
}

export function actualizarConfiguracion(nueva: ConfiguracionTipo) {
  // Actualiza local
  config = nueva;
}

// ============ NUEVO: Llamadas reales al backend ============
export async function fetchConfiguracionBackend(): Promise<ConfiguracionTipo> {
  const userStr = sessionStorage.getItem("user");
  let token = "";
  if (userStr) {
    token = JSON.parse(userStr).token;
  }

  const resp = await fetch(import.meta.env.VITE_API_URL + "/perfil", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await resp.json();
  if (data.msg === "") {
    // Convertimos el user devuelto en ConfiguracionTipo
    return {
      id: data.user.id,
      nombre: data.user.name,
      email: data.user.email,
      password: ""
    };
  }
  // Si falla, usa el local
  return getConfiguracion();
}

export async function updateConfiguracionBackend(conf: ConfiguracionTipo): Promise<ConfiguracionTipo> {
  const userStr = sessionStorage.getItem("user");
  let token = "";
  if (userStr) {
    token = JSON.parse(userStr).token;
  }

  const body = {
    name: conf.nombre,
    email: conf.email,
    password: conf.password // si no quieres cambiar la pass, envía ""
  };

  const resp = await fetch(import.meta.env.VITE_API_URL + "/perfil", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  const data = await resp.json();
  if (data.msg === "") {
    // Convertimos la respuesta en ConfiguracionTipo
    return {
      id: data.user.id,
      nombre: data.user.name,
      email: data.user.email,
      password: "" // no retornamos la pass
    };
  }
  // fallback
  return conf;
}

export const fetchUserConfig = async () => {
    try {
        const response = await fetch(ENDPOINTS.PROFILE);
        // ... existing code ...
    } catch (error) {
        console.error('Error fetching user config:', error);
        throw error;
    }
};

export const updateUserConfig = async (configData: any) => {
    try {
        const response = await fetch(ENDPOINTS.PROFILE, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(configData)
        });
        // ... existing code ...
    } catch (error) {
        console.error('Error updating user config:', error);
        throw error;
    }
};
