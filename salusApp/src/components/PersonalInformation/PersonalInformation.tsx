import type { StepProps } from "../../interfaces/StepProps";


import "../../styles/LoginRegister.css";
import Salustext from "../../img/sallustext.png";
import { useState } from "react";

const PersonalInformation: React.FC<StepProps> = ({
  formData,
  updateFormData,
  nextStep
}) => {

  const [personalData, setPersonalData] = useState({
    username: formData.username,
    email: formData.email,
    password: formData.password,
  });

  const handleNext = () => {
    //salva dados
    updateFormData(personalData);
    nextStep();
  };
  return (
    <>
      <section className="containerLoginRegister">
        <img src={Salustext} alt="Salus Agenda" />
        <div className="loginRegisterTitleContainer">
          <h1>Registra-se</h1>
        </div>

        <div className="loginRegister">
          <h2 className="subTitle">Dados para login.</h2>
          <form className="loginRegisterForm">
            <label htmlFor="username" className="inputLabel">
              Nome Completo
            </label>
            <input
              required
              type="text"
              value={personalData.username}
              onChange={e => setPersonalData(prev => ({ ...prev, username: e.target.value}))}
              name="text"
              placeholder="Digite seu nome completo"
            />

            <label htmlFor="email" className="inputLabel">
              E-mail
            </label>
            <input
              required
              value={personalData.email}
              onChange={e => setPersonalData(prev => ({ ...prev, email: e.target.value}))}
              autoComplete="email"
              type="email"
              name="email"
              placeholder="Digite seu e-mail"
              id="text_mail"
            />

            <label htmlFor="password" className="inputLabel">
              Senha
            </label>
            <input
              required
              value={personalData.password}
              onChange={e => setPersonalData(prev => ({ ...prev, password: e.target.value}))}
              autoComplete="password"
              type="password"
              name="password"
              placeholder="Digite sua senha"
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

export default PersonalInformation;
