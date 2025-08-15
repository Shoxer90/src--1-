import { memo, useState } from "react";

import styles from "../index.module.scss";
import { useTranslation } from "react-i18next";
import SnackErr from "../../../Container2/dialogs/SnackErr";
import ConfirmDialog from "../../../Container2/dialogs/ConfirmDialog";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@mui/material";

const PayButtons = ({
  paymentInfo, 
  handleOpenPhoneDialog,
  multiSaleProducts, 
  blockTheButton,
  totalPrice,
  singleClick,
  setSingleClick,
  setOpenBasket,
  saleMode,
  limitedUsing,
  setOpenDialog,
  cleanEmarks,
}) => {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const [message, setMessage] = useState();
  const [openConfirm, setOpenConfirm] = useState();

  const checkSaleMode = (type) => {
    if(saleMode === 2){
      if(limitedUsing) {
        setMessage(t("dialogs.changeEhdmModeForCashiere"))
      }else{
        setMessage(t("dialogs.changeEhdmMode"))
        setOpenConfirm(true)
      }
    }else{
      multiSaleProducts(type)
    }
  };

  const confirmForNavigate = () => {
    setOpenBasket(false)
    setMessage("")
    setOpenConfirm(false)
    return navigate("/setting/user")
  };


  const buttonBlock = {
    opacity: "0.3",
    border:"red",
    pointerEvents:"none"
  };

  const payMiddleWare = (operation) => {
    const isLsQr = JSON.parse(localStorage.getItem("emarkList"))
    if(paymentInfo?.isPrepayment && !cleanEmarks && isLsQr?.length) {
      setOpenDialog(true)
    }else{
      payBySaleType(operation)
    }
  };

  const payBySaleType = (operation) => {
    if(!singleClick?.pointerEvents) {
      setSingleClick(buttonBlock)
      
      switch (operation) {
        case 1:
          checkSaleMode(1)
          break;
        case 4:
          checkSaleMode(4)
          break;
        case 5:
          handleOpenPhoneDialog()
          break;
      }
    }else{
    }
  }

  return(
    <div 
      className={styles.bask_container_body_footer_icons}
      style={blockTheButton ? buttonBlock : null}
    >
      <span
        style={
        (totalPrice && paymentInfo?.cashAmount && paymentInfo?.cardAmount<=0) ||
          (totalPrice === paymentInfo?.prePaymentAmount && paymentInfo?.prePaymentAmount) ? null :buttonBlock
        }
      >
        <img
          src="/image/cash.png"
          alt="cash pay"
          onClick={()=>payMiddleWare(1)}
        />
        <div>
          {t("history.cash")}
        </div>
      </span>
      <span style={(totalPrice && paymentInfo?.cardAmount) ? null :buttonBlock}>
        <img
          src="/image/card.png"
          alt="card pay"
          onClick={()=>payMiddleWare(1)}
        />  
        <div>
          {t("history.card")}
        </div>
      </span>
      <span style={!paymentInfo?.cardAmount ? buttonBlock : null}>
        <img
          src="/image/qr.png"
          alt="pay by QR"
          onClick={()=>payMiddleWare(4)}
        />
        <div>
          QR
        </div>
      </span>
      <span style={!paymentInfo?.cardAmount ? buttonBlock : null}>
        <img
          src="/image/sms.png"
          alt="sms link"
          onClick={()=>payMiddleWare(5)}
        />
        <div>
          SMS
        </div>
      </span>
      <span  style={!paymentInfo?.cardAmount ? buttonBlock : null}>
        <img 
          src="/image/link.png"
          alt="url" 
          onClick={()=> {
            if(!singleClick?.pointerEvents) {
              setSingleClick(buttonBlock)
              localStorage.setItem("fromQRpay", true)
              checkSaleMode(4)
            }
          }}
        />
        <div>
          Link
        </div>
      </span>
      <Dialog open={!openConfirm && !!message}>
          <SnackErr type="error" message={message} close={setMessage} />
      </Dialog>
      <ConfirmDialog
        func={confirmForNavigate}
        open={openConfirm}
        close={()=>{
          setSingleClick({})
          setOpenConfirm(false)
          setMessage("")
        }}
        content={message}
      />
    </div>
  )
};

export default memo(PayButtons);
