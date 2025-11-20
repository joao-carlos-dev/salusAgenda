import type { DemographicStepProps } from "../../interfaces/DemographicStepProps";
import type { FormData } from "../../interfaces/FormData";
import "../../styles/LoginRegister.css";
import Salustext from "../../img/sallustext.png";
import { useState } from "react";
import { validateDemographicInformation } from "../../Utils/Forms";

const initialStepErrors = {
  cpf: "",
  gender: "",
};
const DemographicInformation: React.FC<DemographicStepProps> = ({
  formData,
  updateFormData,
  handleSubmit,
  //prevStep
}) => {
  const [errors, setErrors] =
    useState<typeof initialStepErrors>(initialStepErrors);

  const validate = () => {
    //salva dados
    const { errors: newErrors, isValid } = validateDemographicInformation(
      formData as FormData
    );
    if (isValid) {
      setErrors(initialStepErrors);
    } else {
      setErrors({
        ...initialStepErrors,
        ...(newErrors as typeof initialStepErrors),
      });
    }

    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const field = { [name]: value };

    updateFormData(field as unknown as Partial<FormData>);
  };

  const handleFinish = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (validate()) {
      updateFormData({
        cpf: formData.cpf,
        gender: formData.gender,
      });
      handleSubmit(e);
    }
  };
  return (
    <>
      <section className="containerLoginRegister">
        <img src={Salustext} alt="Salus Agenda" />
        <div className="loginRegisterTitleContainer">
          <h1>Registra-se</h1>
        </div>

        <div className="loginRegister">
          <h2 className="subTitle">Dados demográficos.</h2>
          <form className="loginRegisterForm">
            <label htmlFor="cpf" className="inputLabel">
              CPF
            </label>
            <input
              required
              value={formData.cpf}
              onChange={handleChange}
              type="text"
              name="cpf"
              placeholder="Digite seu CPF"
            />
            {errors.cpf && <p className="error">{errors.cpf}</p>}

            <label htmlFor="gender" className="inputLabel">
              Qual seu gênero
            </label>
            <select
              className="selectInput"
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Gênero</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="nao-binario">Não binário</option>
            </select>

            {errors.gender && <p className="error">{errors.gender}</p>}
          </form>
        </div>

        <div className="footerCard">
          <input type="checkbox" id="declaro" name="declaro" value="declaro" />
          <label htmlFor="declaro">
            Declaro que e li e concordo com os termos.
          </label>
        </div>
        <button
          id="prosseguir"
          className="button-register"
          type="button"
          onClick={handleFinish}
        >
          Registra
          <i className="bi bi-arrow-right"></i>
        </button>
      </section>
    </>
  );
};

export default DemographicInformation;
