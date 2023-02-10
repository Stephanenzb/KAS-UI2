import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import {ReactMic} from "react-mic";
import { LoginButton } from "./LoginButton";
import { Button } from "./Button";
import './Recorder.css'
import Footer from "./Footer";
import videoSource from "../assets/videos/video-1.mp4"


const Recorder = () =>{

    const [record, setRecord] = useState(false);
    const [blobURL, setBlobURL] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [url, setUrl ] = useState("");
    const [blob, setBlob] = useState(null);
    const [transcriptedText, setTranscriptedText] = useState("");
    const [rowData, setRowData] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [transcripted, setTranscripted] = useState(false);
    const [errorTranscript, setErrorTranscript] = useState(false);
    const audioPlayer = useRef(null);


    const handleSubmit = (e) =>{
        e.preventDefault();
        let formdata = new FormData()
        formdata.append("audio-file", audioFile);
        const response = axios.post("https://lastkas.ey.r.appspot.com/upload", formdata
            ).then(
                res => {
                    setUrl(res.data.url);
                    setSubmitted(true)
                }
            ).catch(err => {
                setSubmitted(false)
                console.log(err)
                
            })       
      }

    const handleFileChange = (e) => {
        const audio = {
          preview: URL.createObjectURL(e.target.files[0]),
          data: e.target.files[0],
        };
        const newUrl = 'gs:/kas-audio/' + audio.name
        setAudioFile(audio);
        setUrl(newUrl)


      }


    const startRecording = () =>{
        setRecord(true);
        
    }

    const stopRecording = () => {
        setRecord(false); 
    }

    const onData = (recordedBlob) =>{
        console.log("real-time data : ", recordedBlob);
    }

  
    const blobToBase64 = blobInput => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blobInput);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });

    const blobCoversion = async  (blobInput) =>{
        try{
            const value = await blobToBase64(blobInput);
            const id = Math.floor(Math.random() * 100)
            const fileName = id.toString() + 'Input.wav'
            const newfile = urlToFile(value, fileName);
            const newUrl = "gs://kas-audio/" + newfile.name
            setAudioFile(newfile)
            setUrl(newUrl)
        }catch({response}){
            console.log(response)
        }
            
    }

    useEffect(() =>{
        console.log(audioFile)
    }, [audioFile])


    useEffect(() => {
        console.log("toto")
    }, [url])


    //transform urlto audio file 
    function urlToFile (dataUrl, filename){
        var arr = dataUrl.split(','),
            mime = "audio/wav",
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
            
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], filename, {type:mime});

    }
    
    const onStop = (recordedBlob) =>{
        console.log('recorded Blob is:', recordedBlob);
        let newBlobUrl =  recordedBlob.blobURL;
        setBlobURL(newBlobUrl);
        const newBlob = new Blob([recordedBlob['blob']], recordedBlob["options"]);
        setBlob(newBlob);        
        blobCoversion(new Blob([recordedBlob['blob']], { type: "audio/wav" }))
        
        
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


    const transcript = () =>{
        axios.get(
            "https://kasapi-dot-lastkas.ey.r.appspot.com/transcription", {
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
                setErrorTranscript(true);
                //setTranscripted("Oups ! Il y a une erreur dans le système, vérifie ta qualité audio, ou contacte Stéph !")
            })
          }


    useEffect(()=>{
        console.log(transcriptedText)
    }, [transcriptedText])      

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

    useEffect(() => {
        console.log(rowData)
    }, [rowData])

    
    

    return(
        <>
        <div className="recorder-container">
            <video src={videoSource} autoPlay loop muted />
            <ReactMic
            record={record}
            className="sound-wave"
            onStop={onStop}
            onData={onData}
            strokeColor="#000000"
            backgroundColor="#91BAD6"
            mimeType="audio/wav"
            />
            <div className="recorder-btns">
            <LoginButton
            className = 'bts'
            buttonStyle= 'btn--outline'
            buttonSize='btn--large'
            onClick={startRecording}
            >Start</LoginButton>
            <LoginButton
            className = 'bts'
            buttonStyle= 'btn--outline'
            buttonSize='btn--large'
            onClick={stopRecording}
            >Stop</LoginButton>
            </div>
            
            <h2>Audio disponible ici :</h2>

            <audio ref={audioPlayer} src={blobURL} controls='controls'/>
            
            <form className="recorder-form" onSubmit={handleSubmit}>
                <h2>Soummetre au système :</h2>
                <LoginButton
            className = 'bts'
            buttonStyle= 'btn--outline'
            buttonSize='btn--medium'
            onChange={handleFileChange}
            type="submit"
            >Soummetre</LoginButton>
            {!submitted && <p>Si ce message ne disparait pas, il y a un soucis, contacte nous :)</p>}
            {submitted && <p >Très bien passe à la suite :) </p>}
            </form>
            <h2 className="transcript-text">Transcrire: </h2>
            <LoginButton
            className = 'btn'
            buttonStyle= 'btn--outline'
            buttonSize='btn--medium'
            onClick={transcript}
            >Transcript</LoginButton>
            {errorTranscript && <p style={{'fontSize': '10px', 'color': 'white'}}>Il y a une erreur, contacte Stéph ou essaye encore !</p>}
            
        <div className="recorder-area">
        <textarea style={{'width' : '689px', 'height': '144px'}} placeholder={transcriptedText}></textarea>
        </div>
        <div className="recorder-btns">
            <LoginButton
            className ='btn'
            buttonStyle='btn--outline'
            buttonSize='btn--medium'
            onClick={storeTranscript}>Enregistrer</LoginButton>
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
        {transcripted && <p style={{'fontSize': '10px'}}>C'est tout bon, check ta Bibliothèque !</p>}
        {!transcripted && <p style={{'fontSize': '10px'}}>Si ce message ne disparait pas après un enregistrement contacte nous !</p>}
        </div>
           <Footer/>
         </>
    )

}

export default Recorder;
