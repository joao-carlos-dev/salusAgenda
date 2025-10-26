import { useState } from "react";
import type { LoginData } from "../../interfaces/LoginData";
import { Link } from 'react-router-dom';
import isError from "../../Utils/isError";
import '../../styles/LoginRegister.css';
import Salustext from "../../img/sallustext.png";

const Login = () => {
    const [loginData, setLoginData] = useState<LoginData> ({
        email: '',
        password: ''
    });

    const handleLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setLoginData({
            ...loginData,
            [name]: value
        }); 
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try{
            console.log("Vêm api");
        } catch(e: unknown) {
            const erroMessage = isError(e) ? e.message : "An unknown error corrured";
            console.error("Login error: ", erroMessage);
        }
    }
  return (
    <>
      <section className="containerLoginRegister">
        <img src={Salustext} alt="Salus Agenda" />
        <div className="loginRegisterTitleContainer">
            <h1>Faça seu login</h1>
        </div>
        <div className="loginRegister">

            <form className="loginRegisterForm" onSubmit={handleSubmit}>
                <label htmlFor="text_mail" className="inputLabel">E-mail</label>
                <input autoComplete="username" type="email" name="email" placeholder="Digite seu e-mail" value={loginData.email} onChange={handleLogin} id="text_mail" />
                
                <label htmlFor="password" className="inputLabel">Senha</label>
                <input autoComplete="current-password" type="password" name="password" placeholder="Digite sua senha" value={loginData.password} onChange={handleLogin}/>

                <button className="button-submit" type="submit">
                    Login
                </button>
            </form>

        </div>
        <Link to="/register" className="registerText">
            Ainda não tem uma conta? Registre-se
        </Link>
      </section>
    </>
  );
};

export default Login;
