import type { StepProps } from "../../interfaces/StepProps";
import type { FormData } from "../../interfaces/FormData";

import "../../styles/LoginRegister.css";
import Salustext from "../../img/sallustext.png";
import React, { useState } from "react";

const PersonalInformation: React.FC<StepProps> = ({
  formData,
  updateFormData,
  nextStep
}) => {

  const [errors, setErrors] = useState({
    username:'',
    email:'',
    password:''
  });

  //validação central
  const validate = () => {
    let isValid = true;
    const newErrors = { username: '', email:'', password:'' };


    //validação nome
    if (!formData.username || formData.username.length < 3) {
      newErrors.username = 'Nome completo é um campo obrigatório';
      isValid = false;
    }

    //email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "E-mail é um campo obrigatório";
      isValid = false;
    }

    //senha
    if(!formData.password || formData.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos seis caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  const handleNext = () => {
    //salva dados
    if(validate()) {
      updateFormData({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      nextStep();
    }
  };

  //att apenas um campo
  //type FormElement = HTMLInputElement | HTMLSelectElement;
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
          <h2 className="subTitle">Dados para login.</h2>
          <form className="loginRegisterForm" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="username" className="inputLabel">
              Nome Completo
            </label>
            <input
              required
              autoComplete="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              name="username"
              placeholder="Digite seu nome completo"
            />
            {errors.username && <p className="error">{errors.username}</p>}

            <label htmlFor="email" className="inputLabel">
              E-mail
            </label>
            <input
              required
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              type="email"
              name="email"
              placeholder="Digite seu e-mail"
              id="text_mail"
            />

            {errors.email && <p className="error">{errors.email}</p>}

            <label htmlFor="password" className="inputLabel">
              Senha
            </label>
            <input
              required
              value={formData.password}
              onChange={handleChange}
              autoComplete="password"
              type="password"
              name="password"
              placeholder="Digite sua senha"
            />

            {errors.password && <p className="error">{errors.password}</p>}

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

export default PersonalInformation;
