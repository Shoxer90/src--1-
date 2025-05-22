import { memo, useState } from "react";
import { Button, Dialog, Divider } from "@mui/material";
import ConfirmDialog from "../../Container2/dialogs/ConfirmDialog";
import { readNotificationsPush } from "../../services/notifications/notificatonRequests";
import styles from "../index.module.scss";
 import CreditScoreIcon from '@mui/icons-material/CreditScore';   //payment successed
 import ReceiptIcon from '@mui/icons-material/Receipt'; //invoice
import AnnouncementIcon from '@mui/icons-material/Announcement';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'; //sms
import PersonIcon from '@mui/icons-material/Person';
import { createDateFormat } from "../../admin/modules/variables";
import IconMaker from "../../modules/IconMaker";
import { useTranslation } from "react-i18next";
import Reciept from "../../Container2/historyPage/newHdm/receipt";
import { taxCounting } from "../../modules/modules";
import { hdm_generate } from "../../services/user/hdm_query";
import Loader from "../../Container2/loading/Loader";

const notifCardStyle = {
  display:"flex",
  flexFlow:"row nowrap",
  justifyContent:"space-between",
  padding:"1px 8px",
  cursor:"pointer",
  alignItems:"center",
};

const notifIcon = {
  margin:"3px",
};

const NotificationItem = ({
  id,
  message,
  title, 
  status,
  createdAt,
  setNotifTrigger,
  notifTrigger,
  logOutFunc,
  notificationType,
  setNotifIdArr,
  notifIdArr,
  choose,
  setChoose,
  data
}) => {
  const {t} = useTranslation();
  const [openAll,setOpenAll] = useState(false);
  const [openHDM,setOpenHDM] = useState(false);
  const [load,setLoad] = useState(false);
  const [taxCount,setTaxCount] = useState(0);
  const [saleData, setSaleData] = useState([]);

  const recieptData = data && JSON.parse(data);

  const notifText = {
    display:"flex",
    justifyContent:"space-around",
    flexFlow:"column nowrap",
    fontWeight:  !status ? 700: 400,
    width:"240px"
  };
  
  const handleClick = () => {
    if(notificationType === 0) {
     return readNotificationsPush(id).then((res) => {
        setNotifTrigger(!notifTrigger)
        return openCloseHDM()
      })
    }
    if(!status) {
      readNotificationsPush(id)
      setNotifTrigger(!notifTrigger)
    }
    setOpenAll(!openAll)
  };

  const closeNotif = () => {
    setOpenAll(!openAll)
  };

  const openCloseHDM = async(id) => {
    if(!status) {
      readNotificationsPush(id)
      setNotifTrigger(!notifTrigger)
    }
    setLoad(true)
    hdm_generate(recieptData?.saleDetail?.id).then((resp) => {
      setLoad(false)
      if(resp?.res?.printResponse){
        const tax = taxCounting(recieptData?.saleDetail?.printResponseInfo?.items)
        setTaxCount(tax)
        setSaleData(resp)
        setOpenHDM(true)
      }else if(resp === 401){
        logOutFunc()
      }
    })
  };
  
  return (
    <>
      <div style={notifCardStyle}>
        <div>
          {notificationType === 0 ?<IconMaker
            setNotifIdArr={setNotifIdArr}
            notifIdArr={notifIdArr}
            choose={choose}
            setChoose={setChoose}
            id={id}
            isOpen={status}
            color={`linear-gradient(90deg,rgba(42, 123, 155,${status?0.3: 1} ) 0%, rgba(87, 199, 133,${status?0.3: 1}) 50%, rgba(237, 221, 83, ${status?0.3: 1}) 100%)`}
            size="35px"
            icon={<CreditScoreIcon fontSize="small" sx={{color:"white"}}/>}
          />:""}
      
          {notificationType === 1 ?<IconMaker
            setNotifIdArr={setNotifIdArr}
            notifIdArr={notifIdArr}
            choose={choose}
            setChoose={setChoose}
            id={id}
            isOpen={status}
            color={`linear-gradient(90deg,rgba(38, 61, 97, ${status?0.3: 1}) 28%, rgba(76, 141, 181,${status?0.3: 1}) 75%, rgba(135, 185, 214, ${status?0.3: 1}) 92%)`}
            size="35px"
            icon={<PersonIcon fontSize="small" sx={{color:"white"}}/>}
          />:""}
      
          {notificationType === 3 ?<IconMaker
            setNotifIdArr={setNotifIdArr}
            notifIdArr={notifIdArr}
            choose={choose}
            setChoose={setChoose}
            id={id}
            isOpen={status}
            color={`linear-gradient(90deg,rgba(91, 186, 151, ${status?0.3: 1}) 57%, rgba(242, 178, 39, ${status?0.3: 1}) 100%)`}
            size="35px"
            icon={<ReceiptIcon fontSize="small" sx={{color:"white"}}/>}
          />:""}

          {notificationType === 2 ?<IconMaker
            setNotifIdArr={setNotifIdArr}
            notifIdArr={notifIdArr}
            setChoose={setChoose}
            choose={choose}
            isOpen={status}
            id={id}
            color={`linear-gradient(90deg,rgba(242, 144, 7, ${status?0.3: 1}) 0%, rgba(245, 178, 34, ${status?0.3: 1}) 50%)`}
            size="35px"
            icon={<AnnouncementIcon fontSize="small" sx={{color:"white"}}/>}
          />:""}

           {notificationType === 4 ?<IconMaker
            setNotifIdArr={setNotifIdArr}
            notifIdArr={notifIdArr}
            setChoose={setChoose}
            choose={choose}
            isOpen={status}
            id={id}
            color={`linear-gradient(90deg,rgba(242, 144, 7, ${status?0.3: 1}) 0%, rgba(245, 178, 34, ${status?0.3: 1}) 50%)`}
            size="35px"
            icon={<MarkEmailReadIcon fontSize="small" sx={{color:"white"}}/>}
          />:""}
        </div>

        <div style={notifText} onClick={handleClick}>

          <div style={{display:"flex",flexFlow:"row nowrap", justifyContent:"space-between",textAlign:"start", alignContent:"center"}}>
            <div style={{fontSize:"75%",fontWeight:800, color:status? "grey":"black"}}>{title}</div>
            <div style={{textAlign:"right", fontSize:"60%", padding:"0px"}}>{createDateFormat(createdAt,0,1)}</div>
          </div>

          <span style={{fontSize:"70%", fontWeight:status ? 400 : 800}}>
            {message.length < 70 ? message:` ${message.slice(0,65)}..(${t("menubar.more")})`}
          </span>
            <div style={{display:"flex", justifyContent:"right", margin:"5px 10px", fontSize:"60%"}}>
              { notificationType === 0  ? 
                <Button 
                  onClick={openCloseHDM}
                  variant="contained" 
                  style={{background:"#F69221", height:"20px",textTransform: "capitalize"}}
                >   
                  {t("basket.seeReciept") }
                </Button> :""
              }
            </div>
        </div>

      </div>
      <Divider color="black" sx={{mt:0.5}} />
      <ConfirmDialog 
        question={message}
        func={closeNotif}
        title={title}
        open={openAll}
        close={closeNotif}
        content={" "}
        nobutton={true}
      />
      { openHDM &&
        <Reciept
          setOpenHDM={setOpenHDM}
          taxCount={taxCount}
          saleData={saleData}
          openHDM={openHDM}
          date={recieptData?.saleDetail?.date}
          userName={recieptData?.saleDetail?.cashier?.fullName}
    
        />
      } 
    

      <Dialog open={load}> <Loader /> </Dialog>
    </>
  )  
};

export default memo(NotificationItem);
