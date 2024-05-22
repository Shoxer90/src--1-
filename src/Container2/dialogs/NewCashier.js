import React, {memo, useState} from "react";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Box } from "@mui/system";
import { Divider, TextField } from "@mui/material";
import { createNewCashier } from "../../services/auth/auth";
import SnackErr from "./SnackErr";
import InfoDialog from "./InfoDialog";
import CloseIcon from '@mui/icons-material/Close';
import validator from "validator";
import Loader from "../loading/Loader";



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NewCashier = ({
  t,
  register,
  setRegister,
  setOpenCashierDail,
  openCashierDial,
  userInfo,
  setUserInfo,
  logOutFunc,
  limitOver
}) => {

	const [cashierUserName, setCashierUserName] = useState("");
  const [load, setLoad] = useState(false);
  const [message, setMessage] = useState();
  const [errorMail, setErrorMail] = useState();
  const inputArr = [t("authorize.first"), t("authorize.last"), t("authorize.email"), t("authorize.password")];

  const mailValidate = (e) => {
    if(validator.isEmail(e)) {
      return true
    }else{
      return false
    }
  };

  const create = async() => {
    const mailvalid = mailValidate(userInfo[t("authorize.email")] || "")
    if(!mailvalid || !userInfo[t("authorize.email")]) {
      return setErrorMail(t("authorize.errors.notMail"))
    }else if(Object.values(userInfo)?.length < 4){
      setMessage(t("authorize.errors.emptyfield"))
    }else{
    setLoad(true)
      await createNewCashier(
      {
        firstName:userInfo[t("authorize.first")], 
        lastName:userInfo[t("authorize.last")], 
        email:userInfo[t("authorize.email")], 
        password:userInfo[t("authorize.password")]
      }).then((user)=>{
        // setLoad(false)
        if(user?.response?.status === 405) {
          setMessage(t("settings.dublicatemail"))
        }else if(user?.response?.status === 400) {
          setMessage(t("dialogs.empty"))
        }else if(user?.response?.status === 401){
          logOutFunc()
        }else if(user?.response?.status === 408){
          limitOver()
        }else if(user?.status === 200){
          setCashierUserName(user.data)
          setRegister(!register)
        }
      })
    }
    setLoad(false)
  };
  
  const handleChangeInput = (e) => {
    setErrorMail()
    setMessage()
		setUserInfo({
			...userInfo,
			[e.target.name]:( e.target.value).trim(),
		})
	};
  
  const handleClose = () => {
    setOpenCashierDail(false)
    setMessage()
  };

  return (
    <>
      <Dialog
        open={!!openCashierDial}
        TransitionComponent={Transition}
        keepMounted
        fullWidth
        maxWidth="sm"
        onClose={handleClose}
      >
        <DialogTitle style={{display:"flex",justifyContent:"space-between"}}>
          {t("dialogs.newcashier")}
          <Button onClick={()=>handleClose()}>
            <CloseIcon />
          </Button>
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{color:"blue"}}>
            {t("dialogs.required")}
          </DialogContentText>
          <Divider style={{margin:"20px",backgroundColor:"gray"}}/>
          <Box 
            style={{
              display:"flex",
              flexDirection: "column",
              gridGap:"20px",
              alignItems:"center", 
              justifyContent:"center"
            }}
          >
            <TextField
                variant="outlined"
                style={{
                  width: "80%", 
                }}
                name={inputArr[0]} 
                value={userInfo?.field}
                label={inputArr[0]}
                onChange={(e)=>handleChangeInput(e)} 
              />
              <TextField
                variant="outlined"
                style={{
                  width: "80%", 
                }}
                name={inputArr[1]} 
                value={userInfo?.field}
                label={inputArr[1]}
                onChange={(e)=>handleChangeInput(e)} 
              />
              <div style={{
                width: "80%", 
                padding: 0,
                margin: 0,
                }}
              >
                <TextField
                  style={{
                    width: "100%", 
                    padding: 0,
                    margin: 0,
                  }}
                  error={errorMail}
                  variant="outlined"
                  name={inputArr[2]} 
                  value={userInfo?.field}
                  label={inputArr[2]}
                  onChange={(e)=>{ 
                    handleChangeInput(e)
                  } }
                />
                <p style={{fontSize:"75%", color:"red"}}>{errorMail}</p>
              </div>
              <TextField
              variant="outlined"
              style={{
                width: "80%", 
                justifySelf: "center"
              }}
              name={inputArr[3]} 
              value={userInfo?.field}
              label={inputArr[3]}
              onChange={(e)=>handleChangeInput(e)} 
            />
          
          </Box>
          {message &&
          <div style={{alignContent:"center"}}>
              <SnackErr type="error"  message={message} close={setMessage}/>
          </div>
            }
        </DialogContent>
        <Button 
          variant="contained" 
          style={{backgroundColor:"#FFA500", margin:"20px"}} 
          onClick={create}
        >
          {t("buttons.create")}
        </Button>
      </Dialog>
      <Dialog open={!!load}>
        <Loader />
      </Dialog>
        <InfoDialog 
          t={t}
          name={userInfo[t("authorize.first")]}
          surname={userInfo[t("authorize.last")]} 
          userName={cashierUserName}
          password={userInfo[t("authorize.password")]}
          setCashierUserName={setCashierUserName}
          handleClose={handleClose}
        />
    </>
  );
}

export default memo(NewCashier);
