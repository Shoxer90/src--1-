import { memo, useState } from "react";
import { Button, Dialog, DialogTitle, Divider, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';


import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";
import { completeEhdmRegistration, getDataByTin } from "../../../services/auth/auth";
import SnackErr from "../../dialogs/SnackErr";



const CompleteUserDataForEhdm = ({open, close, setMessage,func, setIsLoad}) => {
  const {t} = useTranslation();
  const [submitClick, setSubmitClick] = useState(false);
  const [newUser, setNewUser] = useState({
    tin:"",
    legalName: "",
    legalAddress: "",
    taxRegime: 0
  });
  const [infoDialog,setInfoDialog] = useState({
    isOpen: false,
    message:"",
    type:"info",
  })

  const taxtType = [
    {
      id: 1,
      name: t("productinputs.nds"),
    },  {
      id: 2,
      name: t("productinputs.ndsNone"),
    },  {
      id: 3,
      name: t("productinputs.tax3"),
    },  {
      id: 7,
      name: t("productinputs.tax7"),
    },
  ]

  const handleChange = (e) => {
    setSubmitClick(false)
    setInfoDialog({
      isOpen: false,
      message:"",
      type:"",
    })
    setNewUser({
      ...newUser,
      [e.target.name]:e.target.value
    })
  };

  const limitChar = (e,val) => {
    const text = e.target.value;  
      const valid = /^[0-9]*$/;
    if(valid.test(text) &&  text.length <= val) {
      setNewUser({
        ...newUser,
        [e.target.name]: e.target.value,
      
      })
      if(e.target.name === "tin") {
        setNewUser({
          ...newUser,
          [e.target.name]: e.target.value,
          legalName: "",
          legalAddress: ""
        })
        if(text.length === 8) {
          setIsLoad(true)
          getDataByTin(e.target.value).then((res) => {
            setIsLoad(false)
            if(res?.response?.status === 400) {
              setInfoDialog({isOpen: true, message:res?.response?.data?.message, type:"error"})
            }else{
              setNewUser({
                ...newUser,
                tin: e.target.value,
                legalName: res?.data?.legalName,
                legalAddress: res?.data?.legalAddress
              })
            }
          })
        }
      }
    }
  };

  const completeRegistration = () => {
    setSubmitClick(true)
    if(
      newUser?.legalAddress &&
      newUser?.tin &&
      newUser?.legalName &&
      newUser?.taxRegime
    ) {
      func(newUser)
    }else{
      setMessage({type:"error", message:t("authorize.errors.allInputEmpty")})
    }
  }
    


  return (
    <Dialog
      open={open}
    >
      <DialogTitle className={styles.dialogHeader}>
        <div>{t("authorize.completeEhdmAuth")}</div>
        <CloseIcon onClick={close} />
      </DialogTitle>
      <Divider />
      <div className={styles.update_card}>

        <TextField sx={{m:.6}} 
          autoComplete="off"
          inputProps={{
            style: {
              height: "30px",
              width:"70%",
              padding:"1px 10px",
              margin: "10px"
            }
          }}
          error={(!newUser?.tin && submitClick)|| (newUser?.tin && newUser?.tin?.length !==8)}
          name="tin"
          value={newUser?.tin}
          placeholder={`${t("authorize.tin")} (8 ${t("productinputs.symb")}) *`} 
          onChange={(e)=>limitChar(e,8)}     
          />
          <span style={{color:"black", textAlign:"start", margin:"10px"}}>
            <div>
              <span 
               style={{
                  fontWeight:700,
                  color:(submitClick && !newUser?.legalName) ? "red": "black"
                }}
              >{`${t("authorize.legalName")} *`}</span>
              <span>{newUser?.legalName}</span>
            </div>
            <div>
              <span 
                style={{
                 fontWeight:700,
                 color:(submitClick && !newUser?.legalAddress) ? "red": "black"
                }}
                >
                {`${t("authorize.legalAddress")} *`}
                </span>
              <span>{newUser?.legalAddress}</span>
            </div>
          </span>
          <FormControl sx={{ width: "40%", margin:"10px"}}>
            <InputLabel>{`${t("authorize.taxType")}*`}</InputLabel>
            <Select
              error={!newUser?.taxRegime && submitClick}
              size="small"
              name="taxRegime"
              value={newUser?.taxRegime}
              label={`${t("authorize.taxType") }*`}
              onChange={(e)=>handleChange(e)}
            >
              {taxtType && taxtType.map((item, index) => (
                <MenuItem 
                  key={item?.id} 
                  value={item?.id}
                >
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={completeRegistration}
          >
            {t("authorize.registration")}
          </Button>
        {infoDialog?.message &&
          <Dialog open={infoDialog?.isOpen} onClose={()=>setInfoDialog({isOpen: false, message:"",type:"info"})}>
            <SnackErr type={infoDialog?.type} message={infoDialog?.message}  close={()=>setInfoDialog({isOpen: false, message:"",type:"info"})}/>
          </Dialog>
        }
      </div>
    </Dialog>
  )
};

export default memo(CompleteUserDataForEhdm);
