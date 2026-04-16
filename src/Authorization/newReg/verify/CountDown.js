import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function CountDown({
    func
}) {
  const {t} = useTranslation();
  const [open, setOpen] = useState(false);
  const [countdown, setCountdown] = useState(20);
  const [showButton, setShowButton] = useState(false);
  const [clickResend, setClickResend] = useState(false)
  const resendRef = useRef()

  useEffect(() => {
    if (open && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (open && countdown === 0) {
      setShowButton(true);
    }
  }, [open, countdown]);

  useEffect(() => {
    setOpen(true);
    setCountdown(20);
    setShowButton(false);
  }, [clickResend]);

  return (
    <div
      style={{
        color:showButton?"#3FB68A":"grey",
        display:"flex",
        justifyContent:"center", 
        cursor:showButton?"pointer": null,
        marginTop:"10px"
      }}
    >
      {!showButton ?
        <div>{countdown}</div>:
        <div 
          onClick={()=> {
            setClickResend(!clickResend)
            func()
          }}
        >
          {t("authorize.sendAgain")}
        </div>
      }
    </div>
  );
}

// <div>{`Didn't receive the code? Resend verification code after ${countdown} sec`}</div>: