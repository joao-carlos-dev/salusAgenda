import type { DemographicStepProps } from "../../interfaces/DemographicStepProps";
import type { FormData } from "../../interfaces/FormData";
import "../../styles/LoginRegister.css";
import Salustext from "../../img/sallustext.png";
import { useState } from "react";

const DemographicInformation: React.FC<DemographicStepProps> = ({
  formData,
  updateFormData,
  handleSubmit,
  //prevStep
}) => {
  // const [demographicData, setDemographicData] = useState({
  //   cpf: formData.cpf,
  // });
  const [errors, setErrors] = useState({ cpf: "", genero: "" });

  const validate = () => {
    let isValid = true;
    const newErros = { cpf: "", genero: "" };

    if (!formData.genero || formData.genero === "") {
      newErros.genero = "A seleção de gênero é obrigatória";
      isValid = false;
    }

    if (!formData.cpf || formData.cpf.length !== 11) {
      newErros.cpf = "O CPF é obrigatório e deve ter 11 digitos";
      isValid = false;
    }

    setErrors(newErros);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const field = { [name]: value };

    updateFormData(field as unknown as Partial<FormData>);
  };
  // const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   updateFormData({ genero: e.target.value})
  // }

  const handleFinish = () => {
    if (validate()) {
      handleSubmit();
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

            <label htmlFor="genero" className="inputLabel">
              Qual seu gênero
            </label>
            <select
              className="selectInput"
              name="genero"
              id="genero"
              value={formData.genero}
              onChange={handleChange}
            >
              <option value="">Gênero</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="nao-binario">Não binário</option>
            </select> 


            {errors.genero && <p className="error">{errors.genero}</p>}

          </form>
        </div>

        <div className="footerCard">
            <input
              type="checkbox"
              id="declaro"
              name="declaro"
              value="declaro"
            />
            <label htmlFor="declaro" className="declaro">
              Declaro que e li e concordo com os termos.
            </label>

          <div>
            <button
              id="prosseguir"
              className="button-register"
              type="button"
              onClick={handleFinish}
            >
              Prosseguir
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default DemographicInformation;
