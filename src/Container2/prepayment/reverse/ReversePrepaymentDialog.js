import { Button, Dialog, DialogContent, DialogTitle, Divider } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReverceConditionsPrepayment from "./ReverceConditionsPrepayment";
import ConfirmDialog from "../../dialogs/ConfirmDialog";

const ReversePrepaymentDialog = ({open, close, item, biteRev, allRev}) => {
  const {t} = useTranslation();
  const [message, setMessage] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [disable, setDisable] = useState();
  const [reverseData, setReversedata] = useState({
    cashAmount: 0,
    cardAmount: 0,
    products: [],
    saleDetailId: item?.id
  });


  const inputStyle={
    border:'solid grey 2px',
    borderRadius: "4px",
    padding: "4px 6px",
    margin:"4px",
    height:"22px"
  };

  const errStyle = {
    ...inputStyle,
    border:'solid red 2px',
    color: "red"
  };

  const handleChangeInput = (e) => {
    if(e.target.value > item[e.target.name]) return
    setMessage("")
    const valid =/^\d*\.?(?:\d{1,2})?$/
    const text = e.target.value; 
    const isValid = valid.test(text);
    if(isValid || e.target.value === "") {
      setReversedata({
        ...reverseData,
        [e.target.name] : e.target.value === 0  ||
          e.target.value === "0" || 
          e.target.value[e.target.value.length -1]==="." 
        ? e.target.value : +e.target.value ,
      })
    }else if(isValid && e.target.value > item[e.target.name]){
      setReversedata({
        ...reverseData,
        [e.target.name]: +e.target.value
      })
      setMessage(`${t("history.prepaymentReverse2")} ${item[e.target.name]} ${t("units.amd")}`)
    }
  };

  const reverse = () => {
    if(reverseData?.cashAmount === item?.cashAmount && reverseData?.cardAmount === item?.cardAmount) {
      setConfirmMessage(t("history.allPrepReverse"))
    }else{
      biteRev(reverseData)
    }
  };

  const reverseAllReciept = () => {
    setConfirmMessage("")
    allRev(reverseData)
  }

  const disableBtn = () => {
    (reverseData?.cashAmount > item?.cashAmount || reverseData?.cardAmount > item?.cardAmount) ||
      (!reverseData?.cashAmount && !reverseData?.cardAmount) ?
      setDisable(true) : 
    setDisable(false)
  };

  useEffect(() => {
    disableBtn()
  }, [reverseData]);

  return (
    <Dialog open={open} maxWidth="md">
      <DialogTitle style={{display: "flex", justifyContent: "space-between",textAlign:"center"}}>
        <div>
        {t("history.prepaymentReverse")}
        </div>
        <CloseIcon onClick={close} />
      </DialogTitle>
      <Divider color="black" />
      <DialogContent style={{display:"flex", flexFlow:"column",alignItems:"center", width:"100%"}}>
        <h5 style={{margin:"10px 5px"}}>
          <div> {t("history.checkNum")} {item?.recieptId} </div>
        </h5>
        <ReverceConditionsPrepayment 
          handleChangeInput={handleChangeInput}
          item={item}
          reverseData={reverseData}
          errStyle={errStyle}
          inputStyle={inputStyle}
        />
        <div style={{color:"red",fontSize:"85%",height:"30px", padding:"10px", margin:"10px 5px"}}>
         {message}
        </div>
        <h6>
          {t("history.forReverse")} {+reverseData?.cashAmount + reverseData?.cardAmount} {t("units.amd")}
        </h6>
        <div>
          <Button 
            variant="contained"
            onClick={close}
            sx={{m:1,textTransform: "capitalize", background:"grey"}}
          >
            {t("buttons.cancel")}
          </Button>
          <Button
          variant="contained"
          style={{
            textDecoration:"line",
            background:(reverseData?.cashAmount === item?.cashAmount && reverseData?.cardAmount === item?.cardAmount)? "darkgrey": "green",
            cursor:"pointer",
            textTransform: "capitalize"
          }} 
          onClick={()=>{
            setReversedata({
              ...reverseData,
              cardAmount: item?.cardAmount,
              cashAmount: item?.cashAmount,
            })
            setMessage("")
          }}
        >
          {t("basket.reverseAll")} 
        </Button>
          <Button 
            sx={{m:1,textTransform: "capitalize"}}
            variant="contained"
            onClick={reverse}
            disabled={disable}
          >
            {t("buttons.reverse") }
          </Button>
        </div>
      </DialogContent>
      <ConfirmDialog
        func={reverseAllReciept}
        open={confirmMessage}
        close={setConfirmMessage}
        content={confirmMessage}
      /> 
    </Dialog>
  )
};

export default memo(ReversePrepaymentDialog);
