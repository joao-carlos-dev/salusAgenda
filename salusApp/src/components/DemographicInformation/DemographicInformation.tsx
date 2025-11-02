import type { DemographicStepProps } from "../../interfaces/DemographicStepProps";

import "../../styles/LoginRegister.css";
import Salustext from "../../img/sallustext.png";
import { useState } from "react";

const DemographicInformation: React.FC<DemographicStepProps> = ({
  formData,
  updateFormData,
  handleSubmit,
  //prevStep
}) => {
  const [demographicData, setDemographicData] = useState({
    cpf: formData.cpf,
  });

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ genero: e.target.value})
  }

  const handleFinish = () => {
    handleSubmit();
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
              value={demographicData.cpf}
              onChange={(e) =>
                setDemographicData((prev) => ({ ...prev, cpf: e.target.value }))
              }
              type="text"
              name="text"
              placeholder="Digite seu CPF"
            />

            <label htmlFor="genero">
              Qual seu gênero
            </label>
            <select name="genero" id="genero" value={formData.genero} onChange={handleGenderChange}>
              <option value="">Gênero</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="nao-binario">Não binário</option>
            </select>

            <input
              type="checkbox"
              id="declaro"
              name="declaro"
              value="declaro"
            />
            <label htmlFor="declaro">
              Declaro que e li e concordo com os termos.
            </label>

            <button
              id="prosseguir"
              className="button-register"
              type="button"
              onClick={handleFinish}
            >
              Prosseguir
              <i className="bi bi-arrow-right"></i>
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default DemographicInformation;
