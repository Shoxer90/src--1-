import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import DraftsIcon from '@mui/icons-material/Drafts';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

import { Checkbox, Dialog, Divider, FormControl, Input, Switch } from "@mui/material";
import DateRangeIcon from '@mui/icons-material/DateRange';

import styles from "./index.module.scss";
import RangeDatePicker from "../../modules/RangeDatePicker";
import { useDispatch, useSelector } from "react-redux";
import ConfirmDialog from "../../Container2/dialogs/ConfirmDialog";
import { setReserveIds } from "../../store/notification/notificationSlice";
import { useReadNotificationMutation, useRemoveNotificationListMutation } from "../../store/notification/notificationApi";
import Loader from "../../Container2/loading/Loader";

const HeaderNotification = ({
  initDate, 
  setInitDate,
  changeFunction,
  setChoose,
  choose,
  notifIdArr, 
  setNotifIdArr,
  setNotifTrigger,
  notifTrigger,

  notifications,
  setNotifications,
}) => {
  const {t} = useTranslation();
  const reserve = useSelector(state=> state?.notification?.idReserve);
  const dispatch = useDispatch();
  const [createReaded, readed] = useReadNotificationMutation();
  const [deleteNots, deleted] = useRemoveNotificationListMutation();
  
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [filterUnRead, setFilterUnRead] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);

  const createRemoveReadList = (bool) => {
    if(bool) {
      setNotifIdArr(reserve)
    }else{
      setNotifIdArr([])
    }
    setChoose(bool)
  };

  const operationsWithNotifications = (oper) => {
    if(choose && notifIdArr) {
      if(oper === "remove") {
        setOpenConfirm(true)

      }else if(oper === "read") {
        createReaded(notifIdArr).then((res) => {
          if(res) {
            setChoose(false)
            setNotifTrigger(!notifTrigger)
            setNotifIdArr([])
          }
        })
      }
    }else{
      setMessage(t("info.chooseNotifs"))
      setTimeout(() => {
        setMessage(``)

      }, 2000)
    }
  };

  const filterUnreadMessages = () => {
    let unreadNots= []
    let reserveId = []
    notifications.forEach(perDay => {
      let od=[]
      perDay?.list?.forEach((item) => {
        if(item?.status === false) {
          reserveId.push(item?.id)
          od.push(item)
          return item
        }
      })
      if(od?.length) {
        return unreadNots.push({
          list:od, 
          dateTime:perDay?.dateTime
        })
      }
    });
    setNotifications(unreadNots)
    dispatch(setReserveIds(reserveId))
  }

  const handleRangeUnread = (bool) => {
    setChoose(false)
    setNotifIdArr([])
    if(bool) {
      filterUnreadMessages()
    }else{
      setNotifTrigger(!notifTrigger)
    }
    setFilterUnRead(bool)
  }

  const removeNots = async() => {
   deleteNots(notifIdArr).then((res) => {
     setNotifTrigger(!notifTrigger)
     setChoose(false)
     setOpenConfirm(false)
    })
    // setNotifIdArr([])
  };
   
  useEffect(() => {
    handleRangeUnread(false)

  }, [])


  return (
    <div className={styles.header}>
      <div className={styles.header_firstRow}>
        <h6>{t("menubar.notificationsTitle")}</h6>
        <span>
          <span onClick={()=>operationsWithNotifications("remove")} className={styles.hovertext} data-hover={t("buttons.remove")}>
            <DeleteIcon sx={{m:.4, color: notifIdArr.length? "red": 'lightgrey'}} fontSize="small" />
          </span>
          <span onClick={()=>operationsWithNotifications("read")} className={styles.hovertext} data-hover={t("menubar.markRead")}>
            <DraftsIcon sx={{m:.4,color: notifIdArr.length? "green": 'lightgrey'}} fontSize="small" />
          </span>
        </span>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",color:"grey",fontWeight:600, fontSize:"80%",  marginTop:"15px"}}>
        {initDate?.startDate && initDate?.endDate && 
          <span> {new Date(initDate?.startDate).toLocaleDateString("en-GB")} - {new Date(initDate?.endDate).toLocaleDateString("en-GB")} </span>
        }
        <span className={styles.hovertext} data-hover={t("history.filterbydate")}>
          <DateRangeIcon 
            fontSize="small" 
            style={{margin:"1px", color:"lightgrey"}}
            onClick={()=>setOpenDatePicker(true)}
          />
        </span>
      </div>  
      <Divider color="black" />
{/* search for notification */}
      {/* <FormControl style={{width:"100%"}} variant="standard" size="small">
        <Input
          placeholder={t("buttons.search")}
          endAdornment={
            <SearchIcon onClick={()=>console.log("search")}  style={{cursor:"pointer",color:"lightgrey"}} /> 
          }
        />
      </FormControl> */}
      <div style={{display:"flex", justifyContent:"space-between"}}>

        <span 
          style={{
            margin:"10px 0px",
            fontSize:"70%",

            fontWeight:600, 
            alignContent:"center"
            }}
          >
           <Checkbox checked={choose && (reserve?.length === notifIdArr?.length) } size="small" onChange={(e)=>createRemoveReadList(e.target.checked)}/>{t("history.selectAll")}
        </span>
        <span style={{margin:"10px 0px", fontSize:"70%", fontWeight:600, alignContent:"center"}}>
          {t("menubar.unReaded")} <Switch checked={filterUnRead} size="small" onChange={(e)=>handleRangeUnread(e.target.checked)}/>
        </span>

      </div>
      <span style={{color:"red", fontSize:"70%"}}>
        {message ? message :""}
      </span>
      
      <RangeDatePicker 
        setOpenDatePicker={setOpenDatePicker}
        openDatePicker={openDatePicker}
        initDate={initDate}
        setInitDate={setInitDate}
        changeFunction={changeFunction}
      />  
       <ConfirmDialog 
        title={""}
        func={removeNots}
        question={t("menubar.removeAll")}
        open={openConfirm}
        close={setOpenConfirm}
        content={" "}
        t={t}
      />
      <Dialog open={isLoading}>
        <Loader />
      </Dialog>

    </div>
  )
};

export default memo(HeaderNotification);
