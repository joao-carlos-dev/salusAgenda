import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { RegisterPayload } from "../../interfaces/RegisterPayload";
import type { FormData } from "../../interfaces/FormData";
import { GetProfessionalDataById, GetProfessionalHoursAPI, RegisterPatient, ValidateConsultationLinkApi } from "../../services/salusApi";
import isError from "../../Utils/isError";
import PatientInformation from "../PatientInformation/PatientInformation";
import PatientDemographicInformation from "../PatientDemographicInformation/PatientDemographicInformation";
import axios from "axios";

const initialData: FormData = {
  name: "",
  email: "",
  password: "",
  cpf: "",
  gender: "",
  phoneNumber: "",
  birthDate: "",
};
interface ProfessionalData {
    name?: string;
    occupation?: string;
    expertise?: string;
    personalData?: { name?: string; }
}

export function RegisterFormPatient() {
  
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const { linkId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [doctor, setDoctor] = useState<ProfessionalData | null>(null);
  const [professionalId, setProfessionalId] = useState("");
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [patientId, setPatientId] = useState(""); // Deve vir do login do paciente
  useEffect(() => {
          const validateAndFetch = async () => {
              if (!linkId) return;
              try {
                  const response = await ValidateConsultationLinkApi(linkId);
                  
                  const profId = response.data.id;
                  setProfessionalId(profId);
                  sessionStorage.setItem("profId", profId)
                  const hoursResponse = await GetProfessionalHoursAPI(profId);
                  console.log("horarios: " + hoursResponse.data)
                  
                  let hours = [];
                  if (Array.isArray(hoursResponse.data)) hours = hoursResponse.data;
                  else if (typeof hoursResponse.data === 'object') hours = Object.keys(hoursResponse.data);
                  setAvailableHours(hours.sort());
                  const savedData = sessionStorage.getItem("userData");
                  if (savedData) {
                      const parsed = JSON.parse(savedData);
                      setPatientId(parsed.id || parsed.userId || "");
                  }
              } catch (err) {
                  console.error(err);
                  setError("Este link de agendamento é inválido ou expirou.");
              } finally {
                  setLoading(false);
              }
          };
  
          validateAndFetch();
      }, [linkId]);
      if (loading) return <div className="loading-screen">Validando link...</div>;
      if (error) return <div className="error-screen"><i className="bi bi-x-circle"></i> {error}</div>;

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
       console.log("✅ Resposta da API:", response.status, response.data);
      if (response.status === 201) {
        navigate("/agendar");
        sessionStorage.setItem("idPatient", response.data.idPatient)
      } else {
        alert("Cadastro efetuado, mas status inesperado." + axios.AxiosError);
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
