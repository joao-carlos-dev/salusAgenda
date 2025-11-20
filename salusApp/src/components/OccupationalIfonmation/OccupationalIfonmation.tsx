import type { StepProps } from "../../interfaces/StepProps";
import type { FormData } from "../../interfaces/FormData";

import "../../styles/LoginRegister.css";
import Salustext from "../../img/sallustext.png";
import { useState } from "react";
import { validateoccupationalInformation } from "../../Utils/Forms";

const initialStepErrors = {
  occupation: "",
  expertise: "",
  crm: ""
};

const OccupationalIfonmation: React.FC<StepProps> = ({
  formData,
  updateFormData,
  nextStep,
}) => {
  const [errors, setErrors] =
    useState<typeof initialStepErrors>(initialStepErrors);

  const handleNext = () => {
    //salva dados
    const { errors: newErrors, isValid } = validateoccupationalInformation(
      formData as FormData
    );
    if (isValid) {
      updateFormData({
        occupation: formData.occupation,
        expertise: formData.expertise,
        crm: formData.crm,
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
            <label htmlFor="occupation" className="inputLabel">
              Profissão
            </label>
            <input
              required
              value={formData.occupation}
              onChange={handleChange}
              type="text"
              name="occupation"
              placeholder="Digite sua Profissão"
            />

            {errors.occupation && <p className="error">{errors.occupation}</p>}

            <label htmlFor="expertise" className="inputLabel">
              Especialidade
            </label>
            <input
              required
              value={formData.expertise}
              onChange={handleChange}
              type="text"
              name="expertise"
              placeholder="Digite sua especialidade"
            />
            {errors.expertise && <p className="error">{errors.expertise}</p>}

            <label htmlFor="crm" className="inputLabel">
              Documento profissional
            </label>
            <input
              required
              value={formData.crm}
              onChange={handleChange}
              autoComplete="crm"
              type="text"
              name="crm"
              placeholder="Digite seu (CRM, CRO...)"
            />

            {errors.crm && (
              <p className="error">{errors.crm}</p>
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

export default OccupationalIfonmation;
