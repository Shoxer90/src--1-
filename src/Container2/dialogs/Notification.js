import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { memo, useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { cleanNotifications } from "../../services/user/getUser";

const Notification = ({
  t,
  func,
  data,
  setData,
  open,
}) => {
   const [dataForNotification, setDataForNotification] = useState([]);
   const [openButtonSubmit, setOpenButtonSubmit] = useState("");


  const langEnum = () => {
    let lang = localStorage.getItem("lang") || localStorage.getItem("i18nextLng")
    switch(lang) {
    case 'ru':
      setContent("rus");
      break;
    case 'en':
      setContent("eng");
      break;
    default:
      setContent("arm");
    }
  };

  const setContent = (str) => {
    const arrTitle = ["title", "text", "button"];
    let obj = {};
    data.forEach((item, index) => (
      obj[arrTitle[index]] = item[`${str}`]
    ))
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
          }}
          variant="contained" 
          sx={{background:"#3FB68A",margin:"10px auto",width:"60%"}}
        >
          {t("buttons.ok")}
        </Button>
      </DialogActions>
    </Dialog>
  )
};

export default memo(Notification);