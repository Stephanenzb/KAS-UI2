import React, {useState} from "react";
import axios from "axios";
import { Button } from "./Button";
import "./HeroSection.css"
import videoSource from '../assets/videos/video-1.mp4';
import Footer from "./Footer";



const Upload = () => {
    const [selectedFile, setSelectedFile] = useState(null)
    const [url, setUrl] = useState("");
    const [transcriptedText, setTranscriptedText] = useState("");
    const [transcripted, setTranscripted] = useState(false);
    const [rowData, setRowData] = useState([])
    const [submitted, setSubmitted] = useState(false)
    const [errorSubmit, setErrorSubmit] = useState(false);
    const [errorTranscript, setErrorTranscript] = useState(false);

   
    

    const handelSelectedFile = (e) =>{
        setSelectedFile(e.target.files[0])
    }

    const handleUpload =  (e) => {
        e.preventDefault();
        const data = new FormData()
        data.append("audio-file", selectedFile)
        axios.post("https://lastkas.ey.r.appspot.com/upload", data,
        ).then(
            res => {
                setUrl(res.data.url);
                setSubmitted(true)
            }
        ).catch(
            err => {
                console.log(err);
                setErrorSubmit(true)
            }
            )
    }

    const transcript = () =>{
        axios.get(
            "https://kasapi-dot-lastkas.ey.r.appspot.com/transcription-upload", {
                params : {
                    public_url: url
                }
            }
            ).then(
                res => {
                    console.log(res)
                    if (res.data.length > 0){
                        setTranscriptedText(res.data)
                    }else{
                        setTranscriptedText("Oups ! Notre IA est entrain de grandir, On pourra te fournir cela dans la prochaine version de KAS !")
                    }
                    
                }
            ).catch(err => {
                console.log(err)
                setErrorTranscript(true)
            })
    }

    const storeTranscript = () => {
        const id = Math.floor(Math.random() * 100)
       
        axios.post(
            "https://kasapi-dot-lastkas.ey.r.appspot.com/store-transcription/bdd_kas_transcript", "bdd_kas_transcript",
              {
                  params: {
                      title:id,
                      content : transcriptedText
                  }
                
            }
            
        ).then(
           res => {
               console.log(res)
               setTranscripted(true)
           }
           
        ).catch(
            err => {console.log(err);
            }
        )
    } 

    const getData = () =>{
        return axios.get(
            "https://kasapi-dot-lastkas.ey.r.appspot.com/stored_transcriptions", {
                params : {
                    index_name : "bdd_kas_transcript" 
                }
            }
           
        ).then(
            (res) =>{
                setRowData(res.data)
            } 
           
        )
        .catch(
            err => console.log(err)
        )
    }


    return (
      <div> 
        <div className="hero-container">
            <video src={videoSource} autoPlay loop muted />
            <input type="file" onChange={handelSelectedFile}></input>
            {submitted && <p style={{'fontSize': '10px', 'color': 'white'}} >Très bien passe à la suite :) </p>}
            {transcripted && <p style={{'fontSize': '10px', 'color': 'white'}}>C'est tout bon, check ta Bibliothèque !</p>}
            {errorTranscript && <p style={{'fontSize': '10px', 'color': 'white'}}>Il y a une erreur, contact Stéph ou essaye encore !</p>}
            {errorSubmit && <p style={{'fontSize': '10px', 'color': 'white'}}> Il y a une erreur, contact Stéph ou essaye encore !</p>}
            <div className="hero-btns">    
            <Button className='btns'
            buttonStyle='btn--outline'
            buttonSize='btn--large'
            onClick={handleUpload}
            >Upload</Button>
            <Button className='btns'
            buttonStyle='btn--outline'
            buttonSize='btn--large'
            onClick={transcript}>
              Transcript
            </Button>
            </div>
            <div className="recorder-area">
            <textarea style={{'width' : '689px', 'height': '144px'}} placeholder={transcriptedText}></textarea>
            <div className="hero-btns"> 
            <Button
                className ='btn'
                buttonStyle='btn--outline'
                buttonSize='btn--medium'
                onClick={storeTranscript}
            >
              Enregistrer  
            </Button>
            <Button
            className ='btn'
            buttonStyle='btn--outline'
            buttonSize='btn--medium'
            onClick={getData}
            path='/TranscriptedAudio'>Bibliothèque</Button>
            <Button
            className ='btn'
            buttonStyle='btn--outline'
            buttonSize='btn--medium'
            path="/profil">Annuler</Button>
            </div>
            </div>
        </div>
        <Footer/>
    </div>   
    )
}

export default Upload;
