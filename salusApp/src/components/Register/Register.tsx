import '../../styles/LoginRegister.css';
import Salustext from "../../img/sallustext.png";


const Login = () => {
    
  return (
    <>
      <section className="containerLoginRegister">
        <img src={Salustext} alt="Salus Agenda" />
        <div className="loginRegisterTitleContainer">
            <h1>Registra-se</h1>
        </div>

        <div className="loginRegister">

            <h2 className='subTitle'>Dados para login.</h2>
            <form className="loginRegisterForm">
                <label htmlFor="username" className="inputLabel">Nome Completo</label>
                <input type="text" name="text" placeholder="Digite seu nome completo" />

                <label htmlFor="text_mail" className="inputLabel">E-mail</label>
                <input autoComplete="username" type="email" name="email" placeholder="Digite seu e-mail" id="text_mail" />
                
                <label htmlFor="password" className="inputLabel">Senha</label>
                <input autoComplete="current-password" type="password" name="password" placeholder="Digite sua senha"/>

                <button className="button-register" type="submit">
                  Prosseguir
                  <i className="bi bi-arrow-right"></i>
                </button>
            </form>

        </div>
        
      </section>
    </>
  );
};

export default Login;
