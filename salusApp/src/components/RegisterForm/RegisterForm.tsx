import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { RegisterPayload } from "../../interfaces/RegisterPayload";
import type { FormData } from "../../interfaces/FormData";
import { RegisterAPI } from "../../services/salusApi";
import isError from "../../Utils/isError";

import PersonalInformation from "../PersonalInformation/PersonalInformation";
import OccupationalInformation from "../OccupationalInformation/OccupationalInformation";
import DemographicInformation from "../DemographicInformation/DemographicInformation";

const initialData: FormData = {
  name: "",
  email: "",
  password: "",
  occupation: "",
  expertise: "",
  crm: "",
  cpf: "",
  gender: "",
  phoneNumber: "",
  birthDate: "",
};

// const formatToBrasilDate = (dateString: string): string => {
//   if (!dateString) return "";
//   const [year, month, day] = dateString.split("-");
//   return `${day}/${month}/${year}`;
// }

export function RegisterForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  // att dados forms
  const updateFormData = (fields: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  //avançar proxima etapa
  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  //para voltar
  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  //chama a última etapa

  const handleSubmit = async (finalStepDate?: Partial<FormData>) => {
    const dataToSend = {
      ...formData,
      ...(finalStepDate || {}),
    };

    const payload: RegisterPayload = {
      personalData: {
        name: dataToSend.name,
        cpf: dataToSend.cpf,
        email: dataToSend.email,
        password: dataToSend.password,
        phoneNumber: dataToSend.phoneNumber,
        gender: dataToSend.gender,
        birthDate: dataToSend.birthDate,
      },
      crm: dataToSend.crm,
      occupation: dataToSend.occupation,
      expertise: dataToSend.expertise,
    };

    setIsLoading(true);

    try {
      const response = await RegisterAPI(payload);
      if (response.status === 201) {
        navigate("/");
      } else {
        alert("Cadastro efetuado, mas status inesperado.");
      }
    } catch (e: unknown) {
      const erroMessage = isError(e) ? e.message : "An unknown error corrured";
      console.error("Cadastro error: ", erroMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const stepProps = { formData, updateFormData, nextStep, prevStep };

  let content;

  switch (currentStep) {
    case 1:
      content = <PersonalInformation {...stepProps} />;
      break;
    case 2:
      content = <OccupationalInformation {...stepProps} />;
      break;
    case 3:
      content = (
        <DemographicInformation
          {...stepProps}
          handleSubmit={handleSubmit}
          disabled={isLoading}
          buttonText={isLoading ? "Registrando..." : "Registrar"}
        />
      );
      break;
    default:
      content = <h2>Obrigado!!</h2>;
  }

  return <div>{content}</div>;
}
