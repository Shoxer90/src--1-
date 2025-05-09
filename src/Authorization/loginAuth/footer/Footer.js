import React, { useState } from "react";
import styles from "../index.module.scss";
import { Alert, Snackbar } from "@mui/material";
import { useTranslation } from "react-i18next";

const middleLine = {height:"30px",width:"1.2px", background:"#3FB68A"}

const Footer = ({color}) => {
  const [message,setMessage] = useState("");
  const {t} = useTranslation();
  return (
    <div className={styles.footerStyle}>
      <div style={{height:"2px", backgroundColor:"#3FB68A", margin:"5px 0px"}}></div>
      
      <div className={styles.payxInfo}> 
        <p style={{color:{color}}}>PayX LLC</p>
        <>
          <div style={middleLine}></div>
          <p style={{color:{color}}}> 50 Mashtots Ave., Yerevan, Armenia, 0010</p>
        </>
        <>
          <div style={middleLine}></div>
          <p
            style={{color:{color},cursor:"pointer"}}
            onClick={() =>{
              navigator.clipboard.writeText("+37455522225")
              setMessage(t("landing.copyTel"))
              setTimeout(()=>{
                setMessage("")
              },1500)
            }}
          > Tel.: (+374)55 522 225 </p>
        </>
        <>
          <div style={middleLine}></div>
          <p 
            style={{color:{color},cursor:"pointer"}} 
            onClick={() =>{
              navigator.clipboard.writeText("info@payx.am");
              setMessage(t("landing.copyMail"));
              setTimeout(()=> {
                setMessage("")
              },1500);
            }}
          > E-mail: info@payx.am</p>
        </>

      </div>
        <Snackbar open={!!message} autoHideDuration={6000} onClose={()=>setMessage("")}>
          <Alert onClose={()=>setMessage("")} severity="success" sx={{  width: '200%'}}>
            {message}
          </Alert>
        </Snackbar>
      <div style={{margin:"0px",fontSize:"80%",padding:"0px"}}>
        © 2023, PayX LLC. All Rights Reserved.
      </div>
    </div>
  )
};

export default Footer;
