import axios from 'axios';
import type { LoginData } from '../interfaces/LoginData';
// import type { FormData } from '../interfaces/FormData';
import type { RegisterPayload } from '../interfaces/RegisterPayload';

const apiClient = axios.create({
     baseURL: '',
     headers: {
         'Content-Type': 'application/json'
     }
 })

 export interface HoursRequestDto {
    hours: string[]; 
}

 apiClient.interceptors.request.use(
  (config) => {
    // 1. Tenta pegar o token salvo no navegador
    const token = sessionStorage.getItem("token");

    // 2. Se o token existir, injeta no cabeçalho da requisição
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// (Opcional) Interceptor de Resposta para lidar com token expirado
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o backend retornar 403 (Proibido) ou 401 (Não autorizado)
    if (error.response && (error.response.status === 403 || error.response.status === 401)) {
        console.warn("Token expirado ou inválido. Redirecionando para login...");
        
        // Limpa os dados velhos
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userData");
        
        // Força o redirecionamento para a tela de login
        window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const LoginAPI = (loginData: LoginData) => {
     return apiClient.post('auth/professional/login', loginData)
}

export const RegisterAPI = (payload: RegisterPayload) => {
    return apiClient.post('professional/register', payload)
}

export const GetProfessionalDataById = (id: string) => {
    return apiClient.get(`professional/findProfessionalData/${id}`)
}

export const UpdateProfessionalAPI = (id: string, payload: RegisterPayload) => {
    return apiClient.put(`professional/update/${id}`, payload)
}

export const GetAllProfessionals = () => {
  return apiClient.get('professional/findAll');
}

export const UpdateProfessionalHoursAPI = (id: string, hoursList: string[]) => {
    const payload: HoursRequestDto = { hours: hoursList };
    return apiClient.patch(`professional/updateHours/${id}`, payload);
}

export const GetProfessionalHoursAPI = (id: string) => {
    return apiClient.get(`professional/findAllHours/${id}`);
}

export const FetchShareBySymbol = async (symbol: string) => {
      try{
          const response = await apiClient.get(`/Share/${symbol}`);
          return response;
      } catch (error) {
          console.error("Error fetching share by symbol:", error);
          throw error;
      }
  }
