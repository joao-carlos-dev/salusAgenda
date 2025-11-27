import { useState } from "react";
import { useParams } from "react-router-dom";
import { UpdateProfessionalAPI } from "../../services/salusApi";
import DemographicInformation from "../DemographicInformation/DemographicInformation";
import PersonalInformation from "../PersonalInformation/PersonalInformation";
import OccupationalInformation from "../OccupationalInformation/OccupationalInformation";

import './UpdateProfessional.css';
import type { FormData } from "../../interfaces/FormData";
import type { RegisterPayload } from "../../interfaces/RegisterPayload";
// import type { RegisterPayload } from "../../interfaces/RegisterPayload";


export const UpdateProfessional = () => {
  const { id: paramId } = useParams();
  const [activeTab, setActiveTab] = useState("personal");

  const getProfessionalId = () => {
    if (paramId) return paramId;

    const savedData = sessionStorage.getItem("userData");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        return parsed.id || parsed._id || parsed.personalData?.id;
      } catch {
        return null;
      }
    }
    return null;
  };

  const professionalId = getProfessionalId();

  const [formData, setFormData] = useState<FormData>(() => {
    const savedData = sessionStorage.getItem("userData");

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);

        return {
          name: parsedData.personalData?.name || parsedData.name || "",
          email: parsedData.personalData?.email || parsedData.email || "",
          password: "",
          phoneNumber:
            parsedData.personalData?.phone || parsedData.phoneNumber || "",
          birthDate:
            parsedData.personalData?.birthDate || parsedData.birthDate || "",
          gender: parsedData.personalData?.gender || parsedData.gender || "",
          cpf: parsedData.personalData?.cpf || parsedData.cpf || "",
          occupation: parsedData.occupation || "",
          expertise: parsedData.expertise || "",
          crm: parsedData.crm || "",
        };
      } catch (e) {
        console.error("Erro ao analisar os dados salvos do usuário:", e);
      }
    }

    return {
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
      birthDate: "",
      gender: "",
      cpf: "",
      occupation: "",
      expertise: "",
      crm: "",
    };
  });

  const handleSave = async (partialdata: Partial<FormData>) => {
    if (!professionalId) {
        alert("Erro: ID do usuário não encontrado.");
        return;
    }

    const updatedData = { ...formData, ...partialdata };
    setFormData(updatedData);

    const personalDataPayload = {
        name: updatedData.name,
        cpf: updatedData.cpf,
        email: updatedData.email,
        phoneNumber: updatedData.phoneNumber,
        birthDate: updatedData.birthDate,
        gender: updatedData.gender,
        password: updatedData.password,
    };

    if (updatedData.password && updatedData.password.trim() !== "") {
        personalDataPayload.password = updatedData.password;
    }

    const payload: RegisterPayload = {
        personalData: personalDataPayload,
        occupation: updatedData.occupation,
        expertise: updatedData.expertise,
        crm: updatedData.crm,
    }

    try {
      await UpdateProfessionalAPI(professionalId, payload);
      const dataToStore = { ...updatedData, password: "" };
        sessionStorage.setItem("userData", JSON.stringify(dataToStore));
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error);
      alert("Ocorreu um erro ao atualizar o perfil.");
    }
  };

  // Funções dummy para satisfazer a interface StepProps (não usadas na edição)
  const dummyFunc = () => {};
  const updateDummy = (d: Partial<FormData>) =>
    setFormData((prev) => ({ ...prev, ...d }));


  return (
    <div className="profile-edit-container">
      <h2>Editar Perfil</h2>

      <div className="tabs">
        <button
          onClick={() => setActiveTab("personal")}
          disabled={activeTab === "personal"}
        >
          Dados Pessoais
        </button>
        <button
          onClick={() => setActiveTab("occupational")}
          disabled={activeTab === "occupational"}
        >
          Profissional
        </button>
        <button
          onClick={() => setActiveTab("demographic")}
          disabled={activeTab === "demographic"}
        >
          Demográfico
        </button>
      </div>

      <div className="tab-content" style={{ marginTop: "20px" }}>
        {activeTab === "personal" && (
          <PersonalInformation
            formData={formData}
            updateFormData={updateDummy}
            nextStep={dummyFunc}
            prevStep={dummyFunc}
            isEdit={true}
            onSave={handleSave}
          />
        )}

        {activeTab === "occupational" && (
          <OccupationalInformation
            formData={formData}
            updateFormData={updateDummy}
            nextStep={dummyFunc}
            prevStep={dummyFunc}
            isEdit={true}
            onSave={handleSave}
          />
        )}

        {activeTab === "demographic" && (
          <DemographicInformation
            formData={formData}
            updateFormData={updateDummy}
            nextStep={dummyFunc}
            prevStep={dummyFunc}
            handleSubmit={(data) => handleSave(data as Partial<FormData>)}
            isEdit={true}
            buttonText="Salvar Alterações"
          />
        )}
      </div>
    </div>
  );
};
