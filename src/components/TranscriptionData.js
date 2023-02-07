import axios from "axios";
import React, { useState, useEffect} from "react";
import Footer from "./Footer";
import { LoginButton } from "./LoginButton";
import './TranscriptedData.css';
import videoSource from "../assets/videos/video-1.mp4"




const TranscriptionData = () =>{
    const [rowData, setRowData] = useState([])
    const [showButton, setShowButton] = useState(true)

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
                setShowButton(false)
                
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
        <div className="data-container">
        <video src={videoSource} autoPlay loop muted />
        <h1>Click ici pour afficher tes transcriptions </h1>
        {showButton &&
        <LoginButton
        className = 'bts'
        buttonStyle= 'btn--outline'
        buttonSize='btn--large'
        onClick={getData}
    >Montrer</LoginButton>
        }
        
        <table className ="TableData">
            <thead>
            <tr style={{'border':'1px solid black', 'backgroundColor': 'transparent'}}>
                <th style={{'border':'1px solid black', 'color' : 'white'}}>ID</th>
                <th style={{'border':'1px solid black', 'color' : 'white'}}>Content</th>
            </tr>
            </thead> 
            <tbody>
                {rowData.map( row =>(
                    <tr style={{'border':'1px solid black', 'color' : 'white'}}>
                    <td style={{'border':'1px solid black', 'color' : 'white'}}>{row.title}</td>
                    <td style={{'border':'1px solid black', 'color' : 'white'}}>{row.content}</td>
                </tr>
                ))}
            </tbody>       
        </table>
        </div>
        
        <Footer/>
        </>
    )

}

export default TranscriptionData;
