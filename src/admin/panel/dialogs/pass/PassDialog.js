import { Button, Dialog, DialogContent, DialogTitle, Divider, TextField } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CloseIcon from '@mui/icons-material/Close';
import styles from "./index.module.scss";

const PassDialog = ({open, close,func})=> {
  const {t} = useTranslation();
  const [data,setData] = useState({});

  useEffect(()=> {
    setData({
      login: "admin",
      password: ""
    })
  }, [])

  return (
    <Dialog
      open={open}
      onClose={close}
      
    >
      <DialogTitle className={styles.header}>
        <span>{t("authorize.passwordConform")}</span>
        <CloseIcon onClick={close} />
      </DialogTitle>
      <DialogContent className={styles.component}>

      <Divider />
      <TextField 
        sx={{m:.6, width:"80%"}}
      
        autoComplete="off"
        name="password"
        type="password"
        value={data?.password}
        placeholder={`${t("authorize.password")} *`} 
        onChange={(e)=>setData({
          ...data,
          [e.target.name]: e.target.value
        })}
      />
      <div>
      <Button
            variant="contained"
            style={{
              textTransform: "capitalize",
              margin:"10px"
            }}
            onClick={close}
            >
            {t("buttons.cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={func}
            disabled={!data?.password}
            sx={{textTransform: "capitalize", }}
            >
            {t("buttons.submit")}
          </Button>
            </div>
      </DialogContent>
    </Dialog>
  )
};

export default memo(PassDialog);
