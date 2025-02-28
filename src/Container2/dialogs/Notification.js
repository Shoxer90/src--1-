import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { memo, useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { cleanNotifications } from "../../services/user/getUser";
import { useTranslation } from "react-i18next";

const Notification = ({
  func,
  data,
  setData,
  open,
}) => {
  const {t} = useTranslation();
  const [dataForNotification, setDataForNotification] = useState([]);
  const [openButtonSubmit, setOpenButtonSubmit] = useState("");

  const langEnum = () => {
    let lang = localStorage.getItem("lang") || localStorage.getItem("i18nextLng")
    switch(lang) {
    case 'ru':
      setContent("rus");
      break;
    case 'eng':
      setContent("eng");
      break;
    default:
      setContent("arm");
    }
  };

  const setContent = (str) => {
    let obj = {};
    data.forEach((item) => {
      if(item?.id === 1) {
        return obj.title = item[`${str}`]
      }else  if(item?.id === 2) {
        return obj.text = item[`${str}`]
      }else  if(item?.id === 3) {
        return obj.button = item[`${str}`]
      }
    })
    setDataForNotification(obj)
  };

  useEffect(() => {
    langEnum()
  }, []);

  return(
    <Dialog
      open={!!open}
      maxWidth="sm"
      style={{fontWeight:600}}
    >
      <DialogTitle style={{justifyContent:"space-between",display:"flex",padding:"10px 10px",alignItems:"center"}}>
        <span>{dataForNotification?.title}</span>
        <CloseIcon onClick={func} />
      </DialogTitle>

      <DialogContent dividers>
        <div >{dataForNotification?.text}</div> 
        <label>
          <input 
            style={{margin:"15px 10px 0 0"}}
            type="checkbox" 
            onChange={(e)=>setOpenButtonSubmit(e.target.checked)} 
            value={openButtonSubmit}
           />
          <span onClick={(e)=>setOpenButtonSubmit(e.target.checked)} >{dataForNotification?.button}</span>
        </label>
      </DialogContent>

      <DialogActions>
        <Button 
          disabled={!openButtonSubmit} 
          onClick={()=>{
            cleanNotifications(openButtonSubmit)
            setData([])
            window.location.reload(true);
          }}
          variant="contained" 
          sx={{background:"#3FB68A",margin:"10px auto",width:"60%",textTransform: "capitalize"}}
        >
          {t("buttons.ok")}
        </Button>
      </DialogActions>
    </Dialog>
  )
};

export default memo(Notification);
