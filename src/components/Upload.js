import React, {useState} from "react";
import axios from "axios";
import { Button } from "./Button";
import "./HeroSection.css"
import videoSource from '../assets/videos/video-1.mp4';
import Footer from "./Footer";
import { Storage } from "@google-cloud/storage";
import express from "express";
import cors from "cors";
import { format } from "util";
import Multer from "multer";




const Upload = () => {
    const [selectedFile, setSelectedFile] = useState(null)
    const [url, setUrl] = useState("");
    const [transcriptedText, setTranscriptedText] = useState("");
    const [transcripted, setTranscripted] = useState(false);
    const [rowData, setRowData] = useState([])
    const [submitted, setSubmitted] = useState(false)
    const [errorSubmit, setErrorSubmit] = useState(false);
    const [errorTranscript, setErrorTranscript] = useState(false);
    const { Storage } = require("@google-cloud/storage");
    const app = express();
    const port = 5000;
   

    app.use(cors());

    app.post("/upload-file-to-cloud-storage", multer.single("file"), function (req, res, next) { if (!req.file) { res.status(400).send("No file uploaded."); return; }

        let projectId = "lastkas"; // 
        let keyFilename = "lastkas.json"; 
        const storage = new Storage({
            projectId,
            keyFilename,
        });
        const bucketName = "lastkas_bucket";                                                                                         
        const bucket = storage.bucket("lastkas_bucket");
    
    
   
    axios.get("/upload", async (req, res) => {
       try {
            const [files] = await bucket.getFiles();
            res.send([files]);
            console.log("Réussi");
       } catch (error) {
         res.send("Erreur:" + error);
       }
   });

axios.post("/upload", multer.single("wavfile"), (req, res) => {
  console.log("Made it /upload");
  try {
    if (req.file) {
      console.log("Upload en cours...");
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream();

      blobStream.on("finish", () => {
        res.status(200).send("Upload réussi");
        console.log("Upload réussi");
      });
      blobStream.end(req.file.buffer);
    } else throw "Erreur, l'upload a échoué";
  } catch (error) {
    res.status(500).send(error);
  }
});
    

    const handelSelectedFile = (e) =>{
        setSelectedFile(e.target.files[0])
    }

    const handleUpload =  (e) => {
        e.preventDefault();
        const data = new FormData()
        data.append("audio-file", selectedFile)
        axios.post("https://metal-repeater-352000.uc.r.appspot.com/upload", data,
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
            "https://kasapi-dot-metal-repeater-352000.uc.r.appspot.com/transcription-upload", {
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
            "https://kasapi-dot-metal-repeater-352000.uc.r.appspot.com/store-transcription/bdd_kas_transcript", "bdd_kas_transcript",
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
            "https://kasapi-dot-metal-repeater-352000.uc.r.appspot.com/stored_transcriptions", {
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
