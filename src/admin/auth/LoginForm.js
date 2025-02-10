import { memo, useEffect, useState } from "react";

import styles from "./index.module.scss";
import { Button, Dialog, TextField } from "@mui/material";
import { useTranslation } from "react-i18next"
import { useLoginMutation } from "../../store/admin/adminApi";
import Loader from "../../Container2/loading/Loader";
import SnackErr from "../../Container2/dialogs/SnackErr";
import { useNavigate } from "react-router-dom";

const initialLoginData = {
  username:"admin",
  password:"useradmin",
  isLastVersion:true
}

const AdminLoginForm = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();

  const [seePass,setSeePass] = useState(false);
  const [message, setMessage] = useState({m:"", t:""});
  const [loginData, setLoginData] = useState(initialLoginData)

  const [login, {isLoading}] = useLoginMutation();



  const logInToAdminPage = async () => {
    try{
      await login(loginData).unwrap()
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
      <TextField
        autoComplete="false"
        className={styles.form_item}
        sx={{color:"white"}}
        type="text"
        name="username"
        onChange={handleChangeInput}
        value={loginData?.username}
        placeholder={t("authorize.username")}
      />
      <TextField
        autoComplete="false"
        className={styles.form_item}
        type={seePass? "text" : "password"}
        name="password"
        onChange={handleChangeInput}
        value={loginData?.password}
        placeholder={t("authorize.password")}
      />

      <Button 
        onClick={()=>logInToAdminPage()} 
        variant="contained"
      >
         {t("authorize.login")}
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
