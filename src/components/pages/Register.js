import React, { useEffect, useState } from "react";
import {Button} from "../Button"
import { LoginButton } from "../LoginButton";
import './Register.css';
import Footer from "../Footer";
import axios from "axios";
import videoSource from '../../assets/videos/video-1.mp4';

const Register = (props) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [path, setPath] = useState("")
  const [alert, setAlert] = useState(false)
  


  const handleSubmit =  (e) =>{
    e.preventDefault();
      axios.post("https://kasapi-dot-lastkas.ey.r.appspot.com/create-user/database_users/", "databse_users",
      {
        params: {
          email : email,
          username : username,
          password : password
        }
      }
       ).then( (res) =>{
         console.log(res)
          window.location = "/sign-up" 
          setPath("/login")
        }).catch(err => 
          {
            console.log(err)
            setAlert(true)
          }
        ) 
    }

    useEffect(() =>{
      console.log(path)
    },[path]);


  return (
    <div className="register-container">
    <video src={videoSource} autoPlay loop muted />
      <form className="form-profile" onSubmit={handleSubmit}>
          <h1>Inscrivez vous dès maintenant</h1>
          <div className="form-group">
            <label htmlFor="email" style={{color: 'white', fontSize:"90 px"}}>Email</label>
            <input
              type="text"
              className="form-control"
              id="email"
              placeholder="mail@mail.fr"
              style={{width:"90%", padding:"12px 45px", margin: "8px 0", boxSizing:"border-box"}}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="username" style={{color: 'white', fontSize:"90 px"}}>username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="kamelia"
              style={{width:"90%", padding:"12px 30px", margin: "8px 0", boxSizing:"border-box"}}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" style={{color: 'white', fontSize:"90 px"}}>Mot de passe</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Mot de passe"
              style={{width:"90%", padding:"12px 20px", margin: "8px 0", boxSizing:"border-box"}}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>
          <div className="register-btns">
          <LoginButton className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
          type="submit">
            Valider
          </LoginButton>
          <Button className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
          path='register'>
            Annuler
          </Button>
          </div>
          {alert && <p style={{"color" : "white"}}> Oups ! une erreur s'est produite ! Essaye encore ou appelle kam !</p>}
      </form>
      <Footer/>
    </div>
  );
};

export default Register;
