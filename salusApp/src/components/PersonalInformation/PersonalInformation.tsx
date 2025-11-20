import type { StepProps } from "../../interfaces/StepProps";
import type { FormData } from "../../interfaces/FormData";
import { validatePersonalInformation } from "../../Utils/Forms";

import "../../styles/LoginRegister.css";
import Salustext from "../../img/sallustext.png";
import React, { useState } from "react";
// import { useForm } from "react-hook-form";

const initialStepErrors = {
  name:'',
  email:'',
  password:'',
  phoneNumber: ''
 }

const PersonalInformation: React.FC<StepProps> = ({
  formData,
  updateFormData,
  nextStep
}) => {

  const [errors, setErrors] = useState<typeof initialStepErrors >(initialStepErrors);

  
  const handleNext = () => {
    //salva dados
    const { errors: newErrors, isValid } = validatePersonalInformation(formData as FormData);
    if(isValid) {
      updateFormData({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber
      });
      nextStep();
    } else {
      setErrors({
        ...initialStepErrors,
        ...(newErrors as typeof initialStepErrors)
      });
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const field = { [name]: value };

    setErrors(prevErrors => ({ ...prevErrors, [name]: ''}))

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
            <label htmlFor="name" className="inputLabel">
              Nome Completo
            </label>
            <input
              required
              autoComplete="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              name="name"
              placeholder="Digite seu nome completo"
            />
            {errors.name && <p className="error">{errors.name}</p>}


            <label htmlFor="phonenumber" className="inputLabel">
              Número de Celular
            </label>
            <input
              required
              autoComplete="tel"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              name="phoneNumber"
              placeholder="Digite seu número de celular"
            />
            {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}

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
