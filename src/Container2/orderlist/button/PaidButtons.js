import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import ActionMessage from "../../dialogs/ActionMessage";

import { Button, ButtonGroup, TextField } from "@mui/material";
import { printOrderReceipt } from "../../../services/pay/pay";

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

const PaidButtons = ({recLink}) => {
  const {t} = useTranslation();
  const [mail, setMail] = useState("");
  const [message, setMessage] = useState("");
  const [loadReceipt,setLoadReceipt] = useState(false);

  const seeReciept = async() => {
    const a = document.createElement("a");
    a.href = recLink;
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
        disabled={loadReceipt}
      >
        {loadReceipt ? "Loading ...": t("basket.seeReciept2")}
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
          href={`mailto:${mail}?subject=${recLink}`}
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
