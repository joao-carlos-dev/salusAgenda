import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode";

import isError from "../../Utils/isError";
import "../../styles/LoginRegister.css";
import Salustext from "../../img/sallustext.png";

// Importe as duas APIs de login
import { LoginAPI, LoginPatient } from "../../services/salusApi";

// Interface para o Token
interface TokenPayload {
  sub?: string;
  email?: string;
  name?: string;
  id?: string;
  [key: string]: unknown;
}

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

  // Estado para alternar as abas (Padrão: Paciente, pois é o fluxo mais comum vindo de links)
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

      console.log(` Resposta Login (${userType}):`, response.data);

      if (response.data && response.status === 200) {
        // Salva Token e Tipo
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("userType", userType);

        // Salva dados do usuário (id, nome, etc)
        if (
          response.data.id ||
          response.data.user ||
          response.data.personalData
        ) {
          const dataToSave = response.data.user || response.data;
          sessionStorage.setItem("userData", JSON.stringify(dataToSave));
        }
        // console.log("Token", response.data.token);
        // navigate("/schedulingProfessional");

        if (userType === "professional") {
          navigate("/schedulingProfessional");
        } else {
          // Fluxo normal (Dashboard)
          if (userType === "professional") {
            navigate("/schedulingProfessional");
          } else {
            // Rota da home do paciente (ajuste conforme suas rotas)
            navigate("/schedulingregister");
          }
        }
      } else {
        setLoginError("Falha no login. Verifique suas credenciais.");
      }
    } catch (e: unknown) {
      const errorMessage = isError(e)
        ? e.message
        : "Ocorreu um erro desconhecido";
      setLoginError(errorMessage);
      console.error("Login error: ", errorMessage);
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
          {/* --- ABAS DE SELEÇÃO --- */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
              width: "100%",
            }}
          >
            <button
              type="button"
              onClick={() => setUserType("patient")}
              style={{
                flex: 1,
                padding: "12px",
                border: "none",
                // Estilo condicional: Azul se ativo, Cinza se inativo
                background: userType === "patient" ? "#007bff" : "#f1f3f5",
                color: userType === "patient" ? "white" : "#666",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "all 0.2s",
              }}
            >
              Sou Paciente
            </button>
            <button
              type="button"
              className={userType == "professional" ? "active" : ""}
              onClick={() => setUserType("professional")}
            >
              Sou Profissional
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
              id="text_mail"
              placeholder={
                userType === "patient"
                  ? "E-mail do paciente"
                  : "E-mail profissional"
              }
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

            {loginError && (
              <p className="error" style={{ textAlign: "center" }}>
                {loginError}
              </p>
            )}

            <button
              className="button-submit"
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? "Entrando..."
                : `Login como ${
                    userType === "patient" ? "Paciente" : "Profissional"
                  }`}
            </button>
          </form>
        </div>

        <Link to={userType === "professional" ? "/register" : "/registerpatient"} className="registerText">
            Ainda não tem uma conta?<strong>Registre-se como {userType === "patient" ? "Paciente" : "Profissional"}</strong>
        </Link>
      </section>
    </>
  );
};

export default Login;
