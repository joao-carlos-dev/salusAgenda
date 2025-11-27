import React from "react";
import { IMaskInput } from "react-imask";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { DemographicStepProps } from "../../interfaces/DemographicStepProps";
import "../../styles/LoginRegister.css";
import Salustext from "../../img/sallustext.png";

const demographicSchema = z.object({
  // cpf: z.string().min(11, "CPF deve conter no mínimo 11 caracteres"),
  cpf: z.string("CPF inválido"),
  gender: z.string().min(1, "Gênero obrigatório"),
  // phoneNumber: z.string().min(11, "Número de celular inválido"),
  phoneNumber: z.string("Número de celular inválido"),
  birthDate: z.string()
    .min(1, "Data de nascimento obrigatória")
    .refine((dateString) => !isNaN(new Date(dateString).getTime()), "Data inválida")
    .refine((dateString) => {
      const date = new Date(dateString);
      const today = new Date();
      return date <= today;
    }, "A data de nascimento não pode ser no futuro"),
  terms: z
    .boolean()
    .refine((val) => val === true, { message: "Você deve aceitar os termos" }),
});

type DemographicSchema = z.infer<typeof demographicSchema>;

const DemographicInformation: React.FC<DemographicStepProps> = ({
  formData,
  updateFormData,
  handleSubmit: parentHandleSubmit,
  disabled,
  buttonText,
  isEdit = false,
  onSave
  //prevStep
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DemographicSchema>({
    resolver: zodResolver(demographicSchema),
    defaultValues: {
      cpf: formData.cpf || "",
      gender: formData.gender || "",
      phoneNumber: formData.phoneNumber || "",
      birthDate: formData.birthDate || "",
      terms: false,
    },
  });

  const onSubmit = async (data: DemographicSchema) => {
    if (isEdit && onSave) {
      await onSave(data);
    } else {
      updateFormData({
        cpf: data.cpf,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        birthDate: data.birthDate,
      });
    }

    if (parentHandleSubmit) {
      parentHandleSubmit({
        cpf: data.cpf,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        birthDate: data.birthDate,
      });
    }
  };

  return (
    <>
      <section className="containerLoginRegister">
        <img src={Salustext} alt="Salus Agenda" />
        <div className="loginRegisterTitleContainer">

          {!isEdit && (
            <h1>Registra-se</h1>
          )}
          {isEdit && (
            <h1>Editar Informações Demográficas</h1>
          )}
        </div>

        <div className="loginRegister">
          <h2 className="subTitle">Dados demográficos.</h2>
          <form
            className="loginRegisterForm"
            onSubmit={handleSubmit(onSubmit)}
          >
            <label htmlFor="cpf" className="inputLabel">
              CPF
            </label>
            <Controller
              name="cpf"
              control={control}
              defaultValue=""
              rules={{ required: "CPF é obrigatório"}}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <IMaskInput
                mask="000.000.000-00"
                value={value}
                onAccept={(value: string) => onChange(value)}
                onBlur={onBlur}
                inputRef={ref}
                className={errors.cpf ? "inputError" : "textInput"}
                placeholder="000.000.000-00"
                />
              )}
            />
            {errors.cpf && <p className="error">{errors.cpf.message}</p>}

            <label htmlFor="phonenumber" className="inputLabel">
              Número de Celular
            </label>
              <Controller
              name="phoneNumber"
              control={control}
              defaultValue=""
              rules={{ required: "Número de celular é obrigatório" }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <IMaskInput
                  mask="(00)00000-0000"
                  value={value}
                  onAccept={(value: string) => onChange(value)}
                  onBlur={onBlur}
                  inputRef={ref}
                  className={errors.phoneNumber ? "inputError" : "textInput"}
                  type="tel"
                  autoComplete="tel"
                  placeholder="(00)00000-0000"
                />
              )}
            />
            {errors.phoneNumber && (
              <p className="error">{errors.phoneNumber.message}</p>
            )}

            <label htmlFor="birthDate" className="inputLabel" >
              Data de Nascimento
            </label>
            <input
              className={errors.birthDate ? "inputError" : "textInput"}
              type="date"
              {...register("birthDate")}
              id="birthDate"
            />
            {errors.birthDate && (
              <p className="error">{errors.birthDate.message}</p>
            )}

            <label htmlFor="gender" className="inputLabel">
              Qual seu gênero
            </label>
            <select className="selectInput" id="gender" {...register("gender")}>
              <option value="">Gênero</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="nao-binario">Não binário</option>
            </select>

            {errors.gender && <p className="error">{errors.gender.message}</p>}
          </form>
        </div>

        <div className="footerCard">
          <input type="checkbox" id="declaro" {...register("terms")} />
          <label htmlFor="declaro">
            Declaro que e li e concordo com os termos.
          </label>
        </div>
        {errors.terms && <p className="error">{errors.terms.message}</p>}

        <button
          id="prosseguir"
          className="button-register"
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={disabled}
        >
          {isEdit ? "Salvar Alterações" : buttonText || "Registrar"}
          {!isEdit && <i className="bi bi-arrow-right"></i>}
        </button>
      </section>
    </>
  );
};

export default DemographicInformation;
