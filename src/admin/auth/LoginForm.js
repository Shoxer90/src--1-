import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom";

import { Button, Dialog, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useLoginMutation } from "../../store/admin/adminApi";

import Loader from "../../Container2/loading/Loader";
import SnackErr from "../../Container2/dialogs/SnackErr";

import styles from "./index.module.scss";
import { useDispatch } from "react-redux";
import { setPaginationPath } from "../../store/pagination/paginationSlice";

const initialLoginData = {
  username:"admin",
  password:"useradmin",
  isLastVersion:true
}

const AdminLoginForm = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [seePass,setSeePass] = useState(false);
  const [message, setMessage] = useState({m:"", t:""});
  const [loginData, setLoginData] = useState(initialLoginData)
  const [login, {isLoading}] = useLoginMutation();

  const logInToAdminPage = async () => {
    try{
      await login(loginData).unwrap()
      dispatch(setPaginationPath({
        path:`/admin/stores?page=1`
      }))
      return navigate("/admin/stores?page=1")
    }catch(err){
      localStorage.removeItem("authAdmin")
      return setMessage({
        m:err?.data?.message,
        t:"error"
      })
    }
  };

  const handleChangeInput = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    })
  };

  useEffect(() => {
    setLoginData(initialLoginData)
  }, [])

  return (
    <div className={styles.form}>
      <FormControl sx={{m:1}} variant="outlined">
        <InputLabel>{t("authorize.username")}</InputLabel>
        <OutlinedInput
          name="username"
          size="small"
          onChange={handleChangeInput}
          value={loginData?.username}
          label={t("authorize.username")}
        />
      </FormControl>
  
      <FormControl sx={{m:1}} variant="outlined">
        <InputLabel>{t("authorize.password")}</InputLabel>
        <OutlinedInput
          type={seePass ? 'text' : 'password'}
          size="small"
          value={loginData?.password}
          onChange={handleChangeInput}
          label={t("authorize.password")}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={()=>setSeePass(!seePass)}>
                {seePass ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <Button
        type="submit"
        variant="contained"
        style={{
          width: "80%",
          margin:"5px",
          alignSelf:"center",
          backgroundColor:"#3FB68A",
          textTransform: "capitalize",
        }}
        onClick={logInToAdminPage} 
      >
        {t("buttons.signIn")}
      </Button>

      <Dialog open={isLoading}>
        <Loader />
      </Dialog>
      <Dialog open={!!message?.m}>
        <SnackErr message={message?.m} type={message?.t} close={setMessage} />
      </Dialog>
    </div>
  )
};

export default memo(AdminLoginForm);