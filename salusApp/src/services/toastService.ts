import iziToast from 'izitoast';
import axios, { AxiosError } from 'axios';

export const toastService = {
  success: (message: string, title = 'Sucesso') => {
    iziToast.success({
      title,
      message,
      position: 'topRight',
      timeout: 3000,
    });
  },

  error: (message: string, title = 'Erro') => {
    iziToast.error({
      title,
      message,
      position: 'topRight',
      timeout: 5000,
    });
  },

  warning: (message: string, title = 'Aviso') => {
    iziToast.warning({
      title,
      message,
      position: 'topRight',
      timeout: 4000,
    });
  },

  info: (message: string, title = 'Informação') => {
    iziToast.info({
      title,
      message,
      position: 'topRight',
      timeout: 3000,
    });
  },

  // Tratamento automático de erros de API
  handleApiError: (error: unknown, defaultMessage = 'Erro ao processar requisição') => {
    let message = defaultMessage;

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string; error?: string }>;
      
      if (axiosError.response?.status === 401) {
        message = 'Sessão expirada. Faça login novamente.';
      } else if (axiosError.response?.status === 403) {
        message = 'Acesso negado. Você não tem permissão.';
      } else if (axiosError.response?.status === 404) {
        message = 'Recurso não encontrado.';
      } else if (axiosError.response?.status === 422) {
        message = 'Dados inválidos. Verifique o formulário.';
      } else if (axiosError.response?.status === 500) {
        message = 'Erro no servidor. Tente novamente mais tarde.';
      } else if (axiosError.response?.data?.message) {
        message = axiosError.response.data.message;
      } else if (axiosError.message) {
        message = axiosError.message;
      }
    } else if (error instanceof Error) {
      message = error.message;
    }

    toastService.error(message);
  },
};
