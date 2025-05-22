import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import ActionMessage from "../../dialogs/ActionMessage";

import { Button, ButtonGroup, TextField } from "@mui/material";

const paidBtnStyle = {
  display:"flex",
  flexDirection:"column"
};

const btnStyle={
  background: "#3FB68A",
  fontSize:"14px",
  width:"100%",
  marginTop:"10px"
};

const PaidButtons = ({recieptLink}) => {
  const {t} = useTranslation();
  const [mail, setMail] = useState("");
  const [message, setMessage] = useState("");

  const seeReciept = () => {
    const a = document.createElement("a");
    a.href = recieptLink;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  };

  return (
    <div style={paidBtnStyle}>
      <div>
        <h6>
          {t("basket.paymentstatus")}
        </h6>
      </div>

      <Button
        variant="contained"
        style={btnStyle}
        onClick={seeReciept}
      >
        {t("basket.seeReciept2")}
      </Button>

      <ButtonGroup sx={{pt:3}}>
        <TextField 
          value={mail}  
          size="small" 
          onChange={(e)=>setMail(e.target.value)} 
          placeholder={t("settings.email")}
        />
        <Button
          variant="contained"
          size="small"
          color="primary"
          target="_top"
          rel="noopener noreferrer"
          href={`mailto:${mail}?subject=${recieptLink}`}
          onClick={()=> setMail("")}
        >
          {t("basket.sendViaMail")}
        </Button>
      </ButtonGroup>

      { message &&
        <ActionMessage 
          setMessage={setMessage}
          type=" " 
          message={message} 
        />
      }
    </div>
  )
};

export default memo(PaidButtons);
