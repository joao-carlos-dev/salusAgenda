import type { StepProps } from "../../interfaces/StepProps";
import type { FormData } from "../../interfaces/FormData";

import "../../styles/LoginRegister.css";
import Salustext from "../../img/sallustext.png";
import { useState } from "react";
import { validateProfessionalInformation } from "../../Utils/Forms";

const initialStepErrors = {
  profession: "",
  specialty: "",
  professionalDocument: "",
};

const ProfessionalIfonmation: React.FC<StepProps> = ({
  formData,
  updateFormData,
  nextStep,
}) => {
  const [errors, setErrors] =
    useState<typeof initialStepErrors>(initialStepErrors);

  const handleNext = () => {
    //salva dados
    const { errors: newErrors, isValid } = validateProfessionalInformation(
      formData as FormData
    );
    if (isValid) {
      updateFormData({
        profession: formData.profession,
        specialty: formData.specialty,
        professionalDocument: formData.professionalDocument,
      });
      nextStep();
    } else {
      setErrors({
        ...initialStepErrors,
        ...(newErrors as typeof initialStepErrors),
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const field = { [name]: value };

    updateFormData(field as unknown as Partial<FormData>);
  };
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

            {errors.professionalDocument && (
              <p className="error">{errors.professionalDocument}</p>
            )}
          </form>
        </div>
        <button
          id="prosseguir"
          className="button-register"
          type="button"
          onClick={handleNext}
        >
          Prosseguir
          <i className="bi bi-arrow-right"></i>
        </button>
      </section>
    </>
  );
};

export default ProfessionalIfonmation;
