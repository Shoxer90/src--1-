import { memo, useState } from "react";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";
import PaymentConfirm from "../paymentDialog/PaymentConfirm";
import { Button, Dialog, Divider } from "@mui/material";
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import ConfirmDialog from "../../../dialogs/ConfirmDialog";
import Loader from "../../../loading/Loader";
import { formatNumberWithSpaces } from "../../../../modules/modules";

const Step3 = ({
  setPayData,
  payData,
  content,
  activateEhdm,
  price,
  loader,
  user,
  payForCompleteEhdmRegistration
}) => {
  const {t} = useTranslation();
  const [method,setMethod] = useState(1);
  const [openBankInfo,setOpenBankInfo] = useState();

  const langEnum = () => {
    let lang = localStorage.getItem("lang") || localStorage.getItem("i18nextLng")
    switch(lang) {
    case 'ru':
      return "rus"
    case 'eng':
      return "eng"
    default:
      return "arm"
    }
  };
  
	return (
		<div className={styles.update_card}>
      <p style={{fontSize:"110%", fontWeight: 600}}>
        {t("settings.employeeCall")}
      </p>

      <div className={styles.subscription_item} >
        <label style={{display:"flex",justifyContent:"space-between"}}>
          <h6 style={{margin:"10px"}}>{`${t("settings.register")} ${t("settings.ETRM")}`}</h6>
          <h6 style={{margin: "10px"}}>
            {formatNumberWithSpaces(price)} {t("units.amd")}
          </h6>
        </label>
      </div>
      <div style={{margin:"20px 10px"}}>
      <PaymentConfirm
        cardArr={content?.cards}
        setPayData={setPayData}
        payData={payData}
        content={content}
        method={method}
        setMethod={setMethod}
        activateEhdm={activateEhdm}
      />
      </div>

      <Divider color="black" />
{/* SKSEL ESTEXIC */}
    <Button 
      color="success" 
      variant="outlined" 
      startIcon={<HomeRepairServiceIcon color="success" />}
      sx={{width:"100%",textTransform: "capitalize"}}
      onClick={()=>setOpenBankInfo(true)}
    >
      {t("cardService.bankTransfer")}
    </Button>
    <Button
      variant="contained"
      onClick={payForCompleteEhdmRegistration}  
      sx={{m:2,background:"#3FB68A",textTransform: "capitalize"}}
      disabled={payData?.attach === undefined && payData?.cardId === undefined }
    >
      {t("basket.totalndiscount")} { price} ֏ 
    </Button>

    {loader && 
      <Dialog open={!!loader}>
        <Loader close={!loader} />
      </Dialog>
    }
    <ConfirmDialog
      t={t} 
      func={()=>setOpenBankInfo(false)} 
      open={openBankInfo}
      close={setOpenBankInfo}
      question={<strong>{user?.paymentMessage[langEnum()]}</strong>}
      nobutton={true}
    />
      </div>
    )
  };

export default memo(Step3);
