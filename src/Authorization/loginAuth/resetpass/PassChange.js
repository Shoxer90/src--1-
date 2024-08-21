import { Button, Dialog, FilledInput, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import validator from "validator";
import { updateUserPassword } from "../../../services/user/userInfoQuery";
import { useNavigate } from "react-router-dom";
import SnackErr from "../../../Container2/dialogs/SnackErr";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const PassChange = ({token}) => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [password, setPassword] = useState({password:"", confirmPassword:""});
  const [message, setMessage] = useState();
  const [errorMessage, setErrorMessage] = useState({ok:false, message:""})
  const [errMessage, setErrMessage] = useState({type:"", message:""});
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  
  const handleClickShowPassword = () => setShowPassword((show) => !show);


  const changePassword = async() => {
    if(!password?.password?.length || !password?.confirmPassword?.length) {
      setMessage({type:"error", message: t("authorize.errors.emptyfield")})
      return
    }else if(password?.password !== password?.confirmPassword){
      setMessage({type:"error", message: t("dialogs.mismatch")})
      return
    }else if(!errorMessage?.ok) {
      setMessage({message: t("dialogs.novalidatepass"),type:"error"})
      return
    }
    else{
      token && await updateUserPassword({"password":password?.password}, token).then((res) => {
        if(res.status === 200){
          setMessage({type:"success", message: t("dialogs.done")})
          setTimeout(() => {
          setMessage({})
          navigate("/") 
          },4000)
        }else if(res === 401){
            setMessage({type:"error",message:t("dialogs.deprecated")})
          }
        else{
          setMessage({type:"error", message: t("dialogs.wrong")})
        }
      })
    }
  }

  const passValidator = (value) => {
    if (validator.isStrongPassword(value, { 
      minLength: 8, minLowercase: 1, 
      minUppercase: 1, minNumbers: 1, minSymbols: 1 
    })) { 
      setErrorMessage({ok:true, message:<div style={{color:"green"}}>{t("dialogs.validatepass")}</div>}) 
    } else { 
      setErrorMessage({ok:false,message:<div style={{color:"red"}}>{t("dialogs.novalidatepass")}</div>}) 
    } 
  };
  
  useEffect(() => {
    if(password?.confirmPassword){
      if(password?.password !== password?.confirmPassword) {
        setErrMessage({type:"error",message:t("dialogs.mismatch")})
      }else if(password?.password === password?.confirmPassword){
        setErrMessage({})
      }
    }
  }, [password?.confirmPassword]);

  useEffect(() => {
    password?.password && passValidator(password?.password)
  }, [password?.password]);

  return(
    <div style={{margin:"10px auto",display:'flex',flexFlow:"column"}}>
       <TextField
          error={!errorMessage?.ok}
          size="small"
          style={{margin:"10px"}}
          placeholder={t("authorize.newpassword")}
          type="password"
          name="password"
          onChange={(e)=>setPassword({...password,[e.target.name]:e.target.value})}
          InputProps={{
            endAdornment: <InputAdornment position="end">
              <span onClick={()=> setMessage({message:t("dialogs.passSuccess"),type:"success"})} style={{fontWeight:700,color:"green", fontSize:"130%", cursor:"pointer"}}>?</span>
            </InputAdornment>
          }}
          helperText={<span style={{minHeight:"40px"}}>{password?.password?.length ? errorMessage?.message : " "}</span>}
        />

        <TextField
          error={(password?.confirmPassword && password?.password !== password?.confirmPassword) || errMessage?.message}
          size="small"
          style={{margin:"10px"}} 
          type="password"
          placeholder={t("settings.confirmpassword")}
          name="confirmPassword"
          onChange={(e)=>setPassword({...password,[e.target.name]:e.target.value})}
          helperText={password?.confirmPassword && password?.password !== password?.confirmPassword ? <span style={{color:"red"}}>{errMessage?.message}</span> : ""}

        />
{/* With eye icon */}
{/* <FormControl sx={{ m: 1, width: "60%" }} variant="outlined" size="small">
          <InputLabel htmlFor="outlined-adornment-password">{t("authorize.newpassword")}</InputLabel>
          <OutlinedInput
            type={showPassword ? 'text' : 'password'}
            name="password"
            onChange={(e)=>setPassword({...password,[e.target.name]:e.target.value})}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={()=>setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
                <span onClick={()=> setMessage({message:t("dialogs.passSuccess"),type:"success"})} style={{fontWeight:700,color:"green",marginLeft:"20px", fontSize:"130%", cursor:"pointer"}}>?</span>

              </InputAdornment>
            }
            label={t("authorize.newpassword")}
          />
          <FormHelperText id="outlined-weight-helper-text">
            {<span style={{minHeight:"40px"}}>{password?.password?.length ? errorMessage?.message : " "}</span>}
          </FormHelperText>
        </FormControl>
        <FormControl sx={{ m: 1, width: "60%" }} variant="outlined" size="small">
          <InputLabel htmlFor="outlined-adornment-password">{t("authorize.newpassword")}</InputLabel>
          
          <OutlinedInput
            type={showPassword2 ? 'text' : 'password'}
            name="confirmPassword"
            onChange={(e)=>setPassword({...password,[e.target.name]:e.target.value})}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={()=>setShowPassword2(!showPassword2)}
                  edge="end"
                >
                  {showPassword2 ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label={t("authorize.newpassword")}
             

          />
          <FormHelperText id="outlined-weight-helper-text">
            {password?.confirmPassword && password?.password !== password?.confirmPassword ? <span style={{color:"red"}}>{errMessage?.message}</span> : ""}
          </FormHelperText>
        </FormControl>
        <h1>{password?.password}</h1>
        <h2>{password?.confirmPassword}</h2> */}
{/* With eye icon */}

         <Button
          variant="contained"
          onClick={changePassword}
          style={{margin:"30px", backgroundColor:"#3FB68A",alignSelf:"center"}}
        >
          {t("buttons.submit")}
        </Button>
        {message?.message && 
        <Dialog open={Boolean(message?.message)} onClose={()=>setMessage({})}>
          <SnackErr  type={message?.type} close={setMessage} message={message?.message} />
            
        </Dialog>}
    </div>

  )
};

export default memo(PassChange);
