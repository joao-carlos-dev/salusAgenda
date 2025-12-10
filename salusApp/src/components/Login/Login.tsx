import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import iziToast from "izitoast";
import isError from "../../Utils/isError";
import "../../styles/LoginRegister.css";
import Salustext from "../../img/sallustext.png";

// import type { LoginData } from "../../interfaces/LoginData";

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
  const [loginError, setLoginError] = useState("");
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
    setLoginError("");

    try {
      let response;
      if (userType === "professional") {
        response = await LoginAPI(data);
      } else {
        response = await LoginPatient(data);
      }

      console.log("Resposta back", response.data);
      console.log(`Resposta (${userType}):`, response.data);

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
        if (userType === "professional") {
          navigate("/schedulingProfessional");
        } else {
          navigate("/agendar");
        }
      }
    } catch (e: unknown) {
      iziToast.error({
          title: "Erro no login",
          message: "Credenciais inválidas. Tente novamente.",
          position: "topRight",
        });
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
              //   required
              className={errors.email ? "inputError" : ""}
              autoComplete="email"
              type="email"
              //   name="email"
              placeholder="Digite seu e-mail"
              //   value={loginData.email}
              //   onChange={handleLogin}
              id="text_mail"
              {...register("email")}
            />

            {errors.email && <p className="error">{errors.email.message}</p>}

            <label htmlFor="password" className="inputLabel">
              Senha
            </label>
            <input
              //   required
              className={errors.password ? "inputError" : ""}
              autoComplete="current-password"
              type="password"
              //   name="password"
              placeholder="Digite sua senha"
              //   value={loginData.password}
              //   onChange={handleLogin}
              {...register("password")}
            />

            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}

            

            <button
              className="button-submit"
              type="submit"
              disabled={isLoading}
              //   onClick={handleSubmit}
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
