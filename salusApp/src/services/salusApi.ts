import axios from 'axios';
import type { LoginData } from '../interfaces/LoginData';
import type { RegisterPayload } from '../interfaces/RegisterPayload';
import { toastService } from './toastService';

const apiClient = axios.create({
     
     headers: {
         'Content-Type': 'application/json'
     }
 })

 export interface HoursRequestDto {
    hours: string[]; 
}

export interface ScheduleRequestDto {
  consultationDate: string;       
  consultationTime: string;      
  consultationDescription: string;
  consultationCategoryId: number; 
  patientId: string;              
  professionalUserId: string;     
}

 apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 403 || error.response.status === 401)) {
        toastService.error("Sessão expirada. Você será redirecionado para login.");
        
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userData");
        sessionStorage.removeItem("userType");
        
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
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

export const RegisterPatient = (payload: RegisterPayload) => {
  return apiClient.post(`/patient/register`, payload)
}

export const LoginPatient = (loginData: LoginData) => {
     return apiClient.post('auth/patient/login', loginData)
}

export const SchedulingRegisterApi = (payload: ScheduleRequestDto) => {
  return apiClient.post('schedule/register', payload)
}
export const FindAllSchedules = (professionalId: string, date: string) => {
  return apiClient.get(`schedule/findSchedule/${professionalId}?date=${date}`)
}

// export const deleteHours = (professionalId: string, hours: string) => {
//   return apiClient.delete(`professional/deleteHours/${professionalId}`);
// }

export const deleteHours = (professionalId: string, hours: string) => {
  // O Axios trata o segundo parâmetro do delete como 'config'
  return apiClient.delete(`professional/deleteHours/${professionalId}`, {
    headers: {
      "Content-Type": "application/json",
    },
    data: hours, // A string do horário vai aqui (ex: "08:00")
  });
};

export const GenerateConsultationLinkApi = (professionalId: string) => {
  return apiClient.post('/consultationLink/generate', { professionalId });
}

export const ValidateConsultationLinkApi = (linkId: string) => {
  return apiClient.get(`/consultationLink/validate/${linkId}`);
}

export const FetchShareBySymbol = async (symbol: string) => {
      try{
          const response = await apiClient.get(`/Share/${symbol}`);
          return response;
      } catch (error) {
          toastService.handleApiError(error, "Erro ao buscar informações da ação");
          throw error;
      }
  }
