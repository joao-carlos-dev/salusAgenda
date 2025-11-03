import type { StepProps } from "../../interfaces/StepProps";
import type { FormData } from "../../interfaces/FormData";

import "../../styles/LoginRegister.css";
import Salustext from "../../img/sallustext.png";
import { useState } from "react";

const ProfessionalIfonmation: React.FC<StepProps> = ({
  formData,
  updateFormData,
  nextStep
}) => {

  const [errors, setErrors] = useState({
    profession:'',
    specialty:'',
    professionalDocument:''
  });

  const validate = () => {
    let isValid = true;
    const newErrors = { profession: '', specialty:'', professionalDocument:'' };

    if (!formData.profession || formData.profession.length < 3) {
      newErrors.profession = 'A profissão é um campo obrigatório';
      isValid = false;
    }

    if (!formData.specialty || formData.specialty.length < 3) {
      newErrors.specialty = 'A especialidade é um campo obrigatório';
      isValid = false;
    }

     if(!formData.professionalDocument || formData.professionalDocument.length < 6) {
      newErrors.professionalDocument = 'O documento profissional deve ter pelo menos seis caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  const handleNext = () => {
    if(validate()) {
      updateFormData({
        profession: formData.profession,
        specialty: formData.specialty,
        professionalDocument: formData.professionalDocument
      });
      nextStep();
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const field = { [name]: value };
  
      updateFormData(field as unknown as Partial<FormData>);
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
              value={formData.profession}
              onChange={handleChange}
              type="text"
              name="profession"
              placeholder="Digite sua Profissão"
            />

            {errors.profession && <p className="error">{errors.profession}</p>}


            <label htmlFor="specialty" className="inputLabel">
              Especialidade
            </label>
            <input
              required
              value={formData.specialty}
              onChange={handleChange}
              type="text"
              name="specialty"
              placeholder="Digite sua especialidade"
            />
            {errors.specialty && <p className="error">{errors.specialty}</p>}


            <label htmlFor="professionalDocument" className="inputLabel">
              Documento profissional
            </label>
            <input
              required
              value={formData.professionalDocument}
              onChange={handleChange}
              autoComplete="professionalDocument"
              type="text"
              name="professionalDocument"
              placeholder="Digite seu (CRM, CRO...)"
            />

            {errors.professionalDocument && <p className="error">{errors.professionalDocument}</p>}

          </form>
          
        </div>
            <button id="prosseguir" className="button-register" type="button" onClick={handleNext}>
              Prosseguir
              <i className="bi bi-arrow-right"></i>
            </button>
      </section>
    </>
  );
};

export default ProfessionalIfonmation;
