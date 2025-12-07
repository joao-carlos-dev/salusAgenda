import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { RegisterPayload } from "../../interfaces/RegisterPayload";
import type { FormData } from "../../interfaces/FormData";
import { RegisterPatient } from "../../services/salusApi";
import isError from "../../Utils/isError";
import PatientInformation from "../PatientInformation/PatientInformation";
import PatientDemographicInformation from "../PatientDemographicInformation/PatientDemographicInformation";

const initialData: FormData = {
  name: "",
  email: "",
  password: "",
  cpf: "",
  gender: "",
  phoneNumber: "",
  birthDate: "",
};

export function RegisterFormPatient() {
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
    };

    setIsLoading(true);

    try {
      const response = await RegisterPatient(payload);
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
      content = <PatientInformation {...stepProps} />;
      break;
    case 2:
      content = (
        <PatientDemographicInformation
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
