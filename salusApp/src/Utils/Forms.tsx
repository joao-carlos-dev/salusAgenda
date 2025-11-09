import type { FormData } from "../interfaces/FormData";
import type { FormErrors } from "../interfaces/FormError";


const validateText = (
  value: string | undefined,
  minLength: number,
  fieldLabel: string
): string => {
  if (!value || value.trim() === '') {
    return `${fieldLabel} é um campo obrigatório.`;
  }
  if (value.length < minLength) {
    return `${fieldLabel} deve ter pelo menos ${minLength} caracteres.`;
  }
  return '';
};

export const validatePersonalInformation = (
  formData: FormData
): { errors: Partial<FormErrors>; isValid: boolean } => {
  const newErrors: Partial<FormErrors> = {};

  // Validação nome
  const usernameError = validateText(formData.username, 3, 'Nome completo');
  if (usernameError) {
    newErrors.username = usernameError;
  }

  // Validação email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email) {
    newErrors.email = 'E-mail é um campo obrigatório.';
  } else if (!emailRegex.test(formData.email)) {
    newErrors.email = 'O e-mail inserido não é válido.';
  }

  // Validação senha
  const passwordError = validateText(formData.password, 6, 'A senha');
  if (passwordError) {
    newErrors.password = passwordError;
  }

  const isValid = Object.keys(newErrors).length === 0;

  return { errors: newErrors, isValid };
};

export const validateProfessionalInformation = (
  formData: FormData
) : { errors: Partial<FormErrors>; isValid: boolean } => {
  const newErrors: Partial<FormErrors> = {};

  const professionError = validateText(formData.profession, 3, 'A profissão');
  if (professionError) {
      newErrors.profession = professionError;
  }

  const specialtyError = validateText(formData.specialty, 3, 'A especialidade');
  if (specialtyError) {
    newErrors.specialty = specialtyError;
  }

  const documentError = validateText(formData.professionalDocument, 6, 'O documento profissional');
  if (documentError) {
    newErrors.professionalDocument = documentError;
  }

  const isValid = Object.keys(newErrors).length === 0;

  return { errors: newErrors, isValid };
}

export const validateDemographicInformation = (
  formData: FormData
) : { errors: Partial<FormErrors>; isValid: boolean } => {
  const newErrors: Partial<FormErrors> = {};

  if (!formData.genero || formData.genero === "") {
    newErrors.genero = "A seleção de gênero é obrigatória";
  }

  if (!formData.cpf) {
    newErrors.cpf = "O CPF é obrigatório.";
  } else if (formData.cpf.length !== 11) {
    newErrors.cpf = "O CPF deve ter 11 digitos.";
  }
  
  const isValid = Object.keys(newErrors).length === 0;

  return { errors: newErrors, isValid };
}