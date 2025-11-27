// import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { StepProps } from "../../interfaces/StepProps";
// import type { FormData } from "../../interfaces/FormData";
// import { validatePersonalInformation } from "../../Utils/Forms";

import "../../styles/LoginRegister.css";
import Salustext from "../../img/sallustext.png";

const personalInfoSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});
type PersonalInfoSchema = z.infer<typeof personalInfoSchema>;

// const initialStepErrors = {
//   name:'',
//   email:'',
//   password:'',
//   phoneNumber: ''
//  }

const PersonalInformation: React.FC<StepProps> = ({
  formData,
  updateFormData,
  nextStep,
  isEdit = false,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoSchema>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: formData.name || "",
      email: formData.email || "",
      password: formData.password || "",
    },
  });

  const onSubmit = async (data: PersonalInfoSchema) => {
    if (isEdit && onSave) {
      await onSave(data);
    } else {
      updateFormData(data);
      nextStep();
    }
  };

  // const [errors, setErrors] = useState<typeof initialStepErrors >(initialStepErrors);

  // const handleNext = () => {
  //   //salva dados
  //   const { errors: newErrors, isValid } = validatePersonalInformation(formData as FormData);
  //   if(isValid) {
  //     updateFormData({
  //       name: formData.name,
  //       email: formData.email,
  //       password: formData.password,
  //       phoneNumber: formData.phoneNumber
  //     });
  //     nextStep();
  //   } else {
  //     setErrors({
  //       ...initialStepErrors,
  //       ...(newErrors as typeof initialStepErrors)
  //     });
  //   }
  // };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //   const { name, value } = e.target;
  //   const field = { [name]: value };

  //   setErrors(prevErrors => ({ ...prevErrors, [name]: ''}))

  //   updateFormData(field as unknown as Partial<FormData>);
  // }
  return (
    <>
      <section className="containerLoginRegister">
        <img src={Salustext} alt="Salus Agenda" />
        <div className="loginRegisterTitleContainer">
          {!isEdit && (
            <>
              <h1>Registra-se</h1>
            </>
          )}

          {isEdit && (
            <h1>Editar Informações Pessoais</h1>
          )}
        </div>

        <div className="loginRegister">
          <h2 className="subTitle">Dados para login.</h2>
          <form
            className="loginRegisterForm"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="name" className="inputLabel">
              Nome Completo
            </label>
            <input
              className={errors.name ? "inputError" : ""}
              autoComplete="name"
              type="text"
              // value={formData.name}
              // onChange={handleChange}
              // name="name"
              {...register("name")}
              placeholder="Digite seu nome completo"
            />
            {errors.name && <p className="error">{errors.name.message}</p>}

            <label htmlFor="email" className="inputLabel">
              E-mail
            </label>
            <input
              className={errors.email ? "inputError" : ""}
              // value={formData.email}
              // onChange={handleChange}
              autoComplete="email"
              type="email"
              // name="email"
              {...register("email")}
              placeholder="Digite seu e-mail"
              id="text_mail"
            />

            {errors.email && <p className="error">{errors.email.message}</p>}

            <label htmlFor="password" className="inputLabel">
              Senha
            </label>
            <input
              className={errors.password ? "inputError" : ""}
              // value={formData.password}
              // onChange={handleChange}
              autoComplete="password"
              type="password"
              // name="password"
              {...register("password")}
              placeholder="Digite sua senha"
            />

            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}
          </form>
        </div>
        <button
          id="prosseguir"
          className="button-register"
          type="button"
          onClick={handleSubmit(onSubmit)}
        >
          {isEdit ? "Salvar Alterações" : "Prosseguir"} 
          {!isEdit && <i className="bi bi-arrow-right"></i>}
        </button>
      </section>
    </>
  );
};

export default PersonalInformation;
