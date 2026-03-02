import { api } from "../utils/axios";

export const getSolicitudes = async () => {
  try {
    const { data } = await api.get('/api/solicitudes');
    return data.result;
  } catch (error) {
    let err = {};
    if (error.response) {
      err.status = error.response.status;
      err.statusText = error.response.data.statusText || error.response.statusText;
    } else {
      err.status = 503;
      err.statusText = "El servidor no responde";
    }
    throw err;
  }
};