import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { StepProps } from "../../interfaces/StepProps";
// import type { FormData } from "../../interfaces/FormData";

import "../../styles/LoginRegister.css";
import Salustext from "../../img/sallustext.png";
// import { useState } from "react";
// import { validateoccupationalInformation } from "../../Utils/Forms";

const occupationSchema = z.object({
  occupation: z.string().min(2, "A profissão deve ter pelo menos 2 caracteres."),
  expertise: z.string().min(2, "A especialidade deve ter pelo menos 2 caracteres."),
  crm: z.string().min(2, "O documento profissional deve ter pelo menos 2 caracteres."),
});

type OccupationFormData = z.infer<typeof occupationSchema>;
// const initialStepErrors = {
//   occupation: "",
//   expertise: "",
//   crm: ""
// };

const OccupationalInfonmation: React.FC<StepProps> = ({
  formData,
  updateFormData,
  nextStep,
  isEdit = false,
  onSave
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors},
  } = useForm<OccupationFormData>({
    resolver: zodResolver(occupationSchema),
    defaultValues: {
      occupation: formData.occupation || "",
      expertise: formData.expertise || "",
      crm: formData.crm || "",
    },
  });

  // const [errors, setErrors] =
  //   useState<typeof initialStepErrors>(initialStepErrors);

  const onSubmit = async (data: OccupationFormData) => {
    if (isEdit && onSave) {
      await onSave(data);
    } else {
      updateFormData({
        occupation: data.occupation,
        expertise: data.expertise,
        crm: data.crm,
      });
      nextStep();
    }
  };

  // const handleNext = () => {
  //   //salva dados
  //   const { errors: newErrors, isValid } = validateoccupationalInformation(
  //     formData as FormData
  //   );
  //   if (isValid) {
  //     updateFormData({
  //       occupation: formData.occupation,
  //       expertise: formData.expertise,
  //       crm: formData.crm,
  //     });
  //     nextStep();
  //   } else {
  //     setErrors({
  //       ...initialStepErrors,
  //       ...(newErrors as typeof initialStepErrors),
  //     });
  //   }
  // };

  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   const { name, value } = e.target;
  //   const field = { [name]: value };

  //   updateFormData(field as unknown as Partial<FormData>);
  // };
  return (
    <>
      <section className="containerLoginRegister">
        <img src={Salustext} alt="Salus Agenda" />
        <div className="loginRegisterTitleContainer">
          
          {!isEdit && (
            <h1>Registra-se</h1>
          )}
          {isEdit && (
            <h1>Editar Informações Profissionais</h1>
          )}
        </div>

        <div className="loginRegister">
          <h2 className="subTitle">Dados profissionais.</h2>
          <form className="loginRegisterForm" onSubmit={(e) => e.preventDefault()}>

            <label htmlFor="occupation" className="inputLabel">
              Profissão
            </label>
            <input
              className={errors.occupation ? "inputError" : ""}
              // value={formData.occupation}
              // onChange={handleChange}
              type="text"
              // name="occupation"
              {...register("occupation")}
              placeholder="Digite sua Profissão"
            />

            {errors.occupation && <p className="error">{errors.occupation.message}</p>}

            <label htmlFor="expertise" className="inputLabel">
              Especialidade
            </label>
            <input
            className={errors.expertise ? "inputError" : ""}
              // required
              // value={formData.expertise}
              // onChange={handleChange}
              type="text"
              // name="expertise"
              {...register("expertise")}
              placeholder="Digite sua especialidade"
            />
            {errors.expertise && <p className="error">{errors.expertise.message}</p>}

            <label htmlFor="crm" className="inputLabel">
              Documento profissional
            </label>
            <input
            className={errors.crm ? "inputError" : ""}
              // required
              // value={formData.crm}
              // onChange={handleChange}
              // autoComplete="crm"
              type="text"
              // name="crm"
              {...register("crm")}
              placeholder="Digite seu (CRM, CRO...)"
            />

            {errors.crm && (
              <p className="error">{errors.crm.message}</p>
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

export default OccupationalInfonmation;
