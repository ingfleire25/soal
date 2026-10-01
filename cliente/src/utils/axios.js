// Reutilizar el cliente que agrega el Bearer de sesión y maneja respuestas 401.
// Mantener ambos exports evita romper servicios que importan el cliente legado.
import apiAutenticada from "@/services/api";

export const api = apiAutenticada;
export const apiPrivada = apiAutenticada;
 