import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toastService } from "../../services/toastService";
import isError from "../../Utils/isError";
import "../../styles/LoginRegister.css";
import Salustext from "../../img/sallustext.png";

import { LoginAPI, LoginPatient } from "../../services/salusApi";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail obrigatório")
    .email("Formato de e-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

type UserType = "professional" | "patient";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<UserType>("patient");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    
    setIsLoading(true);

    try {
      let response;
      if (userType === "professional") {
        response = await LoginAPI(data);
      } else {
        response = await LoginPatient(data);
      }

      if (response.data && response.status === 200) {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("userType", userType);

        if (
          response.data.id ||
          response.data.user ||
          response.data.personalData
        ) {
          const dataToSave = response.data.user || response.data;
          sessionStorage.setItem("userData", JSON.stringify(dataToSave));
        }

        toastService.success(`Bem-vindo de volta, ${userType === 'professional' ? 'Dr(a)' : 'paciente'}!`);

        if (userType === "professional") {
          navigate("/schedulingprofessional");
        } else {
          navigate("/agendar");
        }
      }
    } catch (e: unknown) {
      toastService.handleApiError(e, "E-mail ou senha inválidos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="containerLoginRegister">
        <img src={Salustext} alt="Salus Agenda" />
        <div className="loginRegisterTitleContainer">
          <h1>Faça seu login</h1>
        </div>
        <div className="loginRegister">
          <div className="userTypeSelector">
            <button
              type="button"
              className={userType == "patient" ? "active" : ""}
              onClick={() => setUserType("patient")}
            >
              Paciente
            </button>

            <button
              type="button"
              className={userType == "professional" ? "active" : ""}
              onClick={() => setUserType("professional")}
            >
              Profissional
            </button>

          </div>
          <form className="loginRegisterForm" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="text_mail" className="inputLabel">
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
              autoComplete="current-password"
              type="password"
              placeholder="Digite sua senha"
              {...register("password")}
            />

            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}

            <button
              className="button-submit"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Carregando..." : "Login"}
            </button>
          </form>
        </div>

        <Link to={userType === "professional" ? "/register" : "/registerpatient"} className="registerText">
            Ainda não tem uma conta? <strong>Registre-se como {userType === "patient" ? "Paciente" : "Profissional"}</strong>
        </Link>
    
      </section>
    </>
  );
};

export default Login;
