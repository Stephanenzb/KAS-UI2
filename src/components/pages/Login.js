import '../../App.css';
import React, { useState, useContext, useEffect} from "react";
import Auth from "../contextes/Auth";
import { Button } from '../Button';
import {LoginButton} from '../LoginButton'
import './Login.css'
import {login} from "../services/AuthApi"
import Footer from '../Footer';
import videoSource from '../../assets/videos/video-1.mp4';



const Login = ({ history }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {isAuthenticated, setIsAuthenticated} = useContext(Auth);
  const [alert, setAlert] = useState(false)

  


  const handleSubmit = async (e) =>{
      e.preventDefault(); 
      try{
        const response = await login(email, username,password);
        setIsAuthenticated(response);
        history.replace("/profil")
      } catch({ response}){
        console.log(response);
        setAlert(true)
      }
    }

    useEffect(() => {
      if (isAuthenticated) {
        history.replace('/profil');
      }
    }, [history, isAuthenticated]);
  
  

  return (
    <div className="login-container">
      <video src={videoSource} autoPlay loop muted />
      <form className="form-profile" onSubmit={handleSubmit} >
          <h1>Se connecter</h1>
          <div className="form-group">
            <label htmlFor="email" style={{color: 'white', fontSize:"90 px"}}>Username</label>
            <input
              type="text"
              name="email"
              className="form-control"
              id="email"
              placeholder="Kamelia@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              style={{width:"90%", padding:"12px 60px", margin: "8px 0", boxSizing:"border-box"}}
            />
          </div>
          <div className="form-group">
            <label htmlFor="username" style={{color: 'white', fontSize:"90 px"}}>Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              id="username"
              placeholder="Kamelia"
              onChange={(e) => setUsername(e.target.value)}
              style={{width:"90%", padding:"12px 60px", margin: "8px 0", boxSizing:"border-box"}}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" style={{color: 'white', fontSize:"90 px"}}>Mot de passe</label>
            <input
              type="password"
              name="password"
              className="form-control"
              id="password"
              placeholder="Mot de passe"
              onChange={(e) => setPassword(e.target.value)}
              style={{width:"90%", padding:"12px 50px", margin: "8px 0", boxSizing:"border-box"}}
            />
          </div>
          <div className="login-btns">    
          <LoginButton className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
          type='submit'>Connexion</LoginButton>
          <Button className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
          path='/'>
            Annuler
          </Button>
          </div>
          {alert && <p style={{"color" : "white"}}>Oups ! Une erreur s'est produite, essaye encore ou appelle Kam !</p>}
      </form>
      <Footer/>
    </div>
  );
};

export default Login;

