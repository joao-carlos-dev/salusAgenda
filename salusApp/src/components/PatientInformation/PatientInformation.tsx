import z from "zod";
import Salustext from "../../img/sallustext.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { StepProps } from "../../interfaces/StepProps";

const patientInformation = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type PatientInfoSchema = z.infer<typeof patientInformation>;

const PatientInformation: React.FC<StepProps> = ({
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
  } = useForm<PatientInfoSchema>({
    resolver: zodResolver(patientInformation),
    defaultValues: {
      name: formData.name || "",
      email: formData.email || "",
      password: formData.password || "",
    },
  });

  const onSubmit = async (data: PatientInfoSchema) => {
    if (isEdit && onSave) {
      await onSave(data);
    } else {
      updateFormData(data);
      nextStep();
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
          <h2 className="subTitle">Dados para login.</h2>
          <form className="loginRegisterForm">
            <label htmlFor="name" className="inputLabel">
              Nome Completo
            </label>
            <input
              className={errors.name ? "inputError" : ""}
              autoComplete="name"
              type="text"
              placeholder="Digite seu nome completo"
              {...register("name")}
            />
            {errors.name && <p className="error">{errors.name.message}</p>}

            <label htmlFor="email" className="inputLabel">
              E-mail
            </label>
            <input
              className={errors.email ? "inputError" : ""}
              autoComplete="email"
              type="email"
              placeholder="Digite seu e-mail"
              id="text_mail"
              {...register("email")}
            />

            {errors.email && <p className="error">{errors.email.message}</p>}

            <label htmlFor="password" className="inputLabel">
              Senha
            </label>
            <input
              className={errors.password ? "inputError" : ""}
              autoComplete="password"
              type="password"
              placeholder="Digite sua senha"
              {...register("password")}
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
          Prosseguir
          {!isEdit && <i className="bi bi-arrow-right"></i>}
        </button>
      </section>
    </>
  );
};

export default PatientInformation;
