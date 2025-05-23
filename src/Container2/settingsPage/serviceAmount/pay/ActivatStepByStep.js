import { memo, useState, useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogTitle, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import Step1 from "./Step1";
import Step3 from "./Step3";
import { useSelector } from "react-redux";
import { completeEhdmRegistration, payForEhdm, payForEhdmWithUsingCard } from "../../../../services/auth/auth";
import styles from "./index.module.scss";
import SnackErr from "../../../dialogs/SnackErr";
import Loader from "../../../loading/Loader";

const ActivateStepByStep = ({
  open, 
  close, 
  setMessage,
  content,
  activateEhdm,
  price,
}) => {
  const {t} = useTranslation();
  const user = useSelector(state => state?.user?.user);
  const [loader, setLoader] = useState(false);
  const [payData, setPayData] = useState({ })
  const [step, setStep] = useState({
    "s1": true,
    "s2": false,
  });

  const [newUser, setNewUser] = useState({
    tin:"",
    legalName: "",
    legalAddress: "",
    taxRegime: 0,
    isRegisteredForEhdm:"false"
  });
  
  const [infoDialog,setInfoDialog] = useState({
    isOpen: false,
    message:"",
    type:"info",
  })

  const saveUserDataForEhdm = (arg) => {
  setLoader(true)
  completeEhdmRegistration(arg).then((res) => {
    setLoader(false)
    if(res.status === 200) {
      return setStep({
        "s1":false,
        "s2": true,
      })
    }else{
      setMessage({
        type:"error",
        message: res?.response?.message || t("dialogs.wrong")
      })
    }
  })
  };
  
  const payForCompleteEhdmRegistration = () => {
    setLoader(true)
    if(payData?.cardId) {
      payForEhdmWithUsingCard(payData?.cardId).then((res) => {
        setLoader(false)
        if(res?.status !== 200) {
        }else{
          setMessage({type:"success", message: t("dialogs.done")})
        }
      })
    }else{
      payForEhdm(payData?.attach).then((res) => {
        setLoader(false)
        if(res?.status !== 200) {
        }else{
          // window.open( res?.data?.formUrl, '_blank', 'noopener,noreferrer');
          window.location.href = res?.data?.formUrl
        }
      })
    }
  };

  const notActiveStyle = {
    opacity: 0.3,
  };
  
  useEffect(() => {
    if(user?.isRegisteredForEhdm) {
      setStep({
        "s1":false,
        "s2": true,
      })
    }else {
      setStep({
        "s1": true,
        "s2": false,
      })
    }
  },[user?.isRegisteredForEhdm]);

  return (
    <Dialog
      open={open}
      minWidth="320px"
    >
       <DialogTitle className={styles.dialogHeader}>
        <div></div>
        <CloseIcon onClick={close} />
      </DialogTitle>
      <Divider color="black" />
      {!user?.isRegisteredForEhdm ? <div id="completeData" style={step?.s1 ? null: notActiveStyle}>
        <Step1 
          setInfoDialog={setInfoDialog}
          setLoader={setLoader}
          setMessage={setInfoDialog}
          saveUserDataForEhdm={saveUserDataForEhdm}
          newUser={newUser} 
          setNewUser={setNewUser}
          user={user}
        />
      </div>: ""}
      <div id="payForEhdm"  style={step?.s2 ? null: notActiveStyle}>
        <Step3 
          setPayData={setPayData}
          payData={payData}
          content={content}
          activateEhdm={activateEhdm}
          price={price}
          loader={loader} 
          user={user}
          payForCompleteEhdmRegistration={payForCompleteEhdmRegistration}
          close={close}
        />
      </div>
      {infoDialog?.message &&
        <Dialog open={infoDialog?.isOpen} onClose={()=>setInfoDialog({isOpen: false, message:"",type:"info"})}>
          <SnackErr type={infoDialog?.type} message={infoDialog?.message}  close={()=>setInfoDialog({isOpen: false, message:"",type:"info"})}/>
        </Dialog>
      }
      <Dialog open={loader}>
        <Loader />
      </Dialog>
    </Dialog>
    )
};

export default memo(ActivateStepByStep);

