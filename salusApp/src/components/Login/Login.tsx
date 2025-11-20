import { useState } from "react";
import type { LoginData } from "../../interfaces/LoginData";
import { Link, useNavigate } from 'react-router-dom';
import isError from "../../Utils/isError";
import '../../styles/LoginRegister.css';
import Salustext from "../../img/sallustext.png";

import { LoginAPI } from "../../services/salusApi";

const Login = () => {
    const navigate = useNavigate();
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

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try{
            const response = await LoginAPI(loginData);
             if(response.data && response.status === 200){
                  //alert("Login realizado com sucesso!");
                  navigate('/scheduling')
                 sessionStorage.setItem('token', response.data.token);
                //  const testeRecuperaDado = sessionStorage.getItem('token');
                //  console.log("Token armazenado no sessionStorage: ", testeRecuperaDado);
             } else {
                 alert("Falha no login. Verifique suas credenciais.");
             }
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

            <form className="loginRegisterForm">
                <label htmlFor="text_mail" className="inputLabel">E-mail</label>
                <input required autoComplete="email" type="email" name="email" placeholder="Digite seu e-mail" value={loginData.email} onChange={handleLogin} id="text_mail" />
                
                <label htmlFor="password" className="inputLabel">Senha</label>
                <input required autoComplete="current-password" type="password" name="password" placeholder="Digite sua senha" value={loginData.password} onChange={handleLogin}/>

                <button className="button-submit" type="submit" onClick={handleSubmit}>
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
