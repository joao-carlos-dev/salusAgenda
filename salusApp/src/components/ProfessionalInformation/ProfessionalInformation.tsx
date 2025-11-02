import type { StepProps } from "../../interfaces/StepProps";

import "../../styles/LoginRegister.css";
import Salustext from "../../img/sallustext.png";
import { useState } from "react";

const ProfessionalIfonmation: React.FC<StepProps> = ({
  formData,
  updateFormData,
  nextStep
}) => {

  const [professionalData, setProfessionalData] = useState({
    profession: formData.profession,
    specialty: formData.specialty,
    professionalDocument: formData.professionalDocument,
  });

  const handleNext = () => {
    updateFormData(professionalData);
    nextStep();
  }
  return (
    <>
      <section className="containerLoginRegister">
        <img src={Salustext} alt="Salus Agenda" />
        <div className="loginRegisterTitleContainer">
          <h1>Registra-se</h1>
        </div>

        <div className="loginRegister">
          <h2 className="subTitle">Dados profissionais.</h2>
          <form className="loginRegisterForm">
            <label htmlFor="profession" className="inputLabel">
              Profissão
            </label>
            <input
              required
              value={professionalData.profession}
              onChange={e => setProfessionalData(prev => ({ ...prev, profession: e.target.value}))}
              type="text"
              name="profissao"
              placeholder="Digite sua Profissão"
            />

            <label htmlFor="specialty" className="inputLabel">
              Especialidade
            </label>
            <input
              required
              value={professionalData.specialty}
              onChange={e => setProfessionalData(prev => ({ ...prev, specialty: e.target.value}))}
              type="text"
              name="especialidade"
              placeholder="Digite sua especialidade"
            />

            <label htmlFor="professionalDocument" className="inputLabel">
              Documento profissional
            </label>
            <input
              required
              value={professionalData.professionalDocument}
              onChange={e => setProfessionalData(prev => ({ ...prev, professionalDocument: e.target.value}))}
              autoComplete="current-password"
              type="text"
              name="documentoprofissional"
              placeholder="Digite seu (CRM, CRO...)"
            />

            <button id="prosseguir" className="button-register" type="button" onClick={handleNext}>
              Prosseguir
              <i className="bi bi-arrow-right"></i>
            </button>
          </form>
          
        </div>
      </section>
    </>
  );
};

export default ProfessionalIfonmation;
