import React, { useEffect, useRef, useState } from 'react';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useTranslation } from 'react-i18next';
import { Button, Dialog } from '@mui/material';
import { sendCertificate } from '../../../services/crt';
import ConfirmDialog from '../../dialogs/ConfirmDialog';
import SnackErr from '../../dialogs/SnackErr';

const CertificateUploader = ({isRegisteredInEhdm, activeServiceType, switchStatus}) => {
  const fileInputRef = useRef(null);
  const {t} = useTranslation();
  const [uploadedCrt, setUploadedCrt] = useState(isRegisteredInEhdm && activeServiceType === 3)
  const [contentText, setContentText] = useState("")
  const [file, setFile] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false)
  const [message, setMessage] = useState({
    message:"",
    type: ""
  });

  const handleChange = (event) => {
    setFile(event.target.files[0]);
    event.target.value = ""
    if(!isRegisteredInEhdm && activeServiceType ===3){
      setContentText(t("updates.fileUpld") )
      setOpenConfirm(true)
    }
  };

   const checkConditions = () => { 
    if(!isRegisteredInEhdm && activeServiceType !==3) {
      switchStatus(true)
    } else{
      fileInputRef.current.click();
    }
   }

  const handleUpload = async () => {
    if (!file) {
        setMessage({message:t("info.uploadFile"), type:"error"})
      return;
    }else{
      sendCertificate(file).then((res) => {
        if(res?.status !== 200) {
          setMessage({message:res?.data?.message, type:"error"})
        }else{
          setUploadedCrt(true)
          setMessage({message:res?.data?.message, type:"success"})

        }
      })
    }
    setOpenConfirm(false)
  };


    useEffect(() => {
      setUploadedCrt(isRegisteredInEhdm && activeServiceType === 3)

    }, [isRegisteredInEhdm, activeServiceType])
  return (
    <div>
    <Button
      variant="contained" 
      size="small"
      sx={{mt:1, width:"90%"}}
      style={{background: !uploadedCrt && "#fd7e14",textTransform: "capitalize", border:"orange"}} 
      disabled={uploadedCrt}
      onClick={checkConditions}
    >
        {uploadedCrt ? <><FileUploadIcon fontSize="small"/> {t("updates.uploadedCRT1")}</>: t("updates.uploadCRT")}
    </Button>
    <input 
      ref={fileInputRef}
      type="file" 
      style={{display:"none",cursor: "pointer"}}
      onChange={(e)=>handleChange(e)}
    />
    {(openConfirm || file) &&
      <ConfirmDialog
        func={handleUpload}
        open={openConfirm}
        close={()=>setOpenConfirm(false)}
        content={contentText}
      />
    }
    <Dialog open={message?.message}>
      <SnackErr 
        message={message?.message} 
        type={message?.type} 
        close={()=>{
          setFile({})
          setMessage({message:"", type:""})
        }}
      />
    </Dialog>
    </div>
  );
};

export default CertificateUploader;
