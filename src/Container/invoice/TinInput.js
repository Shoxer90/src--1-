import { Dialog, TextField } from '@mui/material';
import { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { getDataByTin } from '../../services/auth/auth';
import Loader from '../../Container2/loading/Loader';
import SnackErr from '../../Container2/dialogs/SnackErr';

const TinInput = ({
  paymentInfo,
  setPaymentInfo,
  validTin, 
  setValidTin,
  isReqTin
}) => {
  const {t} = useTranslation();
  const [loading, setIsLoad] = useState(false)
  const [infoDialog,setInfoDialog] = useState({
    isOpen: false,
    message:"",
    type:"info",
  })

   const [customer, setCustomer] = useState({
    legalAddress:"",
    legalName: "",
    tin:""
  });

  const getCustomerByTin = async(tin) => {
    setIsLoad(true)
        getDataByTin(tin).then((res) => {
          setIsLoad(false)
          if(res?.response?.status === 400) {
             setCustomer({
              tin: tin,
              legalName:"",
              legalAddress: ""
            })
            setValidTin(false)
            return setInfoDialog({isOpen: true, message:res?.response?.data?.message,type:"error"})
          }else{
            setValidTin(true)

            return setCustomer({
              tin: tin,
              legalName: res?.data?.legalName,
              legalAddress: res?.data?.legalAddress
            })
          }
        })
  }
  
  const limitChar = (e,val) => {
    setValidTin(false)
    setCustomer({
      ...customer,
      legalName: "",
      legalAddress: ""
    })
    const text = e.target.value;  
      const valid = /^[0-9]*$/;
    if(valid.test(text) &&  text.length <= val) {
      setPaymentInfo({
        ...paymentInfo,
        "partnerTin": e.target.value
      })
      if(text.length === 8) {
        return getCustomerByTin(e.target.value)
      }
    }
  };

  useEffect(() => {
   paymentInfo?.partnerTin?.length === 8 && getCustomerByTin(paymentInfo?.partnerTin) 

  }, []);

  return (
    <div>
      <Dialog open={loading}><Loader /></Dialog>
      <TextField sx={{m:.6}} 
        autoComplete="off"
        inputProps={{
          style: {
            height: "26px",
            padding:"1px 10px"
          }
        }}
        error={isReqTin && (!paymentInfo?.partnerTin?.length || paymentInfo?.partnerTin?.length !==8 )&& !validTin}
        value={paymentInfo?.partnerTin}
        placeholder={`${t("authorize.tin")} (8 ${t("productinputs.symb")}) *`} 
        onChange={(e)=>limitChar(e,8)}     
      />

      <span style={{color:"black", textAlign:"start", margin:"10px"}}>
        <div>
          <span style={{fontWeight:700}}>{`${t("authorize.legalName")} *`}</span>
          <span>{customer?.legalName}</span>
        </div>
        <div>
          <span style={{fontWeight:700}}>{`${t("authorize.legalAddress")} *`}</span>
          <span>{customer?.legalAddress}</span>
        </div>
      </span>
      {infoDialog?.message &&
        <Dialog open={infoDialog?.isOpen} onClose={()=>setInfoDialog({isOpen: false, message:"",type:"info"})}>
          <SnackErr type={infoDialog?.type} message={infoDialog?.message}  close={()=>setInfoDialog({isOpen: false, message:"",type:"info"})}/>
        </Dialog>
      }
    </div>
  )
}

export default memo(TinInput);
