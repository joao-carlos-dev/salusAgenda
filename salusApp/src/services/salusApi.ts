import axios from 'axios';
import type { LoginData } from '../interfaces/LoginData';
// import type { FormData } from '../interfaces/FormData';
import type { RegisterPayload } from '../interfaces/RegisterPayload';

const apiClient = axios.create({
     baseURL: 'http://localhost:8080/',
     headers: {
         'Content-Type': 'application/json'
     }
 })

export const LoginAPI = (loginData: LoginData) => {
     return apiClient.post('auth/professional/login', loginData)
}

export const RegisterAPI = (payload: RegisterPayload) => {
    return apiClient.post('professional/register', payload)
}

export const UpdateProfessionalAPI = (id: string, payload: RegisterPayload) => {
    return apiClient.put(`professional/update/${id}`, payload)
}

export const FetchShareBySymbol = async (symbol: string) => {
      try{
          const response = await apiClient.get(`/Share/${symbol}`,
              {
                  headers: {
                      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                  }
          });
          return response;
      } catch (error) {
          console.error("Error fetching share by symbol:", error);
          throw error;
      }
  }
