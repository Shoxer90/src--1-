import { Button, Dialog, DialogContent, DialogTitle, Divider } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReverceConditionsPrepayment from "./ReverceConditionsPrepayment";

const ReversePrepaymentDialog = ({open, close, item, biteRev, allRev}) => {
  const {t} = useTranslation();
  const [message, setMessage] = useState("");
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
  };

  const errStyle = {
    ...inputStyle,
    border:'solid red 2px',
    color: "red"
  }

  const handleChangeInput = (e) => {
    if(item?.total - (reverseData?.cashAmount + reverseData?.cardAmount) < 0 
    && e.target.value > reverseData[e.target.name]) return
    setMessage("")
    const valid =/^\d+(\.\d{0,2})?$/;
    const text = e.target.value; 
    const isValid = valid.test(text);
    if((isValid && e.target.value <= item[e.target.name]) || e.target.value=== "") {
      if(e.target.value[`${e.target.value}`.length - 1] === "."){
        setReversedata({
          ...reverseData,
          [e.target.name]: e.target.value
        })
      }else{
        setReversedata({
          ...reverseData,
          [e.target.name]: +e.target.value
        })
      }
    } else if(isValid && e.target.value > item[e.target.name]){
      setReversedata({
        ...reverseData,
        [e.target.name]: +e.target.value
      })
      setMessage(`${t("history.prepaymentReverse2")} ${item[e.target.name]} ${t("units.amd")}`)
    }
  };

  const reverse = () => {
    if(reverseData?.cashAmount === item?.cashAmount && reverseData?.cardAmount === item?.cardAmount) {
      allRev(reverseData)
    }else{
      biteRev(reverseData)
    }
  };

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
    <Dialog
      open={open}
      maxWidth="md"
    >
      <DialogTitle style={{display: "flex", justifyContent: "space-between",textAlign:"center"}}>
        <div>
          {t("history.prepaymentReverse")}
        </div>
        <CloseIcon style={{}} onClick={close} />
      </DialogTitle>
      <Divider color="black" />
      <DialogContent style={{display:"flex", flexFlow:"column",alignItems:"center", width:"100%"}}>
        <h6 style={{margin:"10px 5px"}}>
          {t("history.prepaymentReverse2")}
        </h6>
        <div style={{fontSize:"80%"}}>
          (
            <span>{item?.cashAmount && `${t("history.cash").toLowerCase()} ${item?.cashAmount} ${t("units.amd")}`}</span> /
            <span style={{marginLeft:"7px"}}>{item?.cardAmount && `${t("history.card").toLowerCase()} ${item?.cardAmount} ${t("units.amd")}`}</span>
          )
        </div>
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
        <h6 
          style={{
            textDecoration:"line",
            color:(reverseData?.cashAmount === item?.cashAmount && reverseData?.cardAmount === item?.cardAmount)? "darkgrey": "green",
            cursor:"pointer"
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
        </h6>

        <div>
          <Button 
            variant="contained"
            onClick={close}
            sx={{m:1, background:"grey"}}
          >
            {t("buttons.cancel")}
          </Button>
          <Button 
            sx={{m:1}}
            variant="contained"
            onClick={reverse}
            disabled={disable}
          >
            {reverseData?.cashAmount === item?.cashAmount && reverseData?.cardAmount === item?.cardAmount ? ` ${t("basket.reverseAll2")}` : t("buttons.reverse") }
          </Button>
        </div>
      </DialogContent>

    </Dialog>
  )
};

export default memo(ReversePrepaymentDialog);
