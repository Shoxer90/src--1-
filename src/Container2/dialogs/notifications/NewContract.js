import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SignNewContract } from "../../../services/user/getUser";
import { setMessage } from "../../../store/messages/messageSlice";
import { useDispatch, useSelector } from "react-redux";
import SnackErr from "../SnackErr";
import Loader from "../../loading/Loader";

const NewContract = ({
  func,
  data,
  open,
  contractLink,
}) => {

  const {t} = useTranslation();
	const dispatch = useDispatch()
	
  const [isLoad, setIsLoad] = useState(false);
  const [dataForNotification, setDataForNotification] = useState([]);
	const message = useSelector((state) => state?.message)

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

	const submitNewContract = async() => {
		setIsLoad(true)
		await SignNewContract().then((res) => {
		setIsLoad(false)
		if(res?.status === 200) {
				dispatch(setMessage({type:"success", text:t("dialogs.done")}))
        func()
			}else{
				dispatch(setMessage({type:"error", text:res?.data?.message}))
        func()
			}
		})
	}

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
      </DialogTitle>

      <DialogContent dividers>
        <div>{dataForNotification?.text}</div> 
        {/* <div>{dataForNotification?.text}</div>  */}
				<a href={contractLink}>{t("updates.seeContract")}</a>
      </DialogContent>

      <DialogActions>
        <Button 
          onClick={submitNewContract}
          variant="contained" 
          sx={{background:"#3FB68A",margin:"10px auto",width:"60%",textTransform: "capitalize"}}
        >
          {dataForNotification?.button}
        </Button>

				<Dialog open={!!message?.text}>
					<SnackErr message={message?.text} type={message?.type} close={()=>dispatch(setMessage({text:"",type:""}))}/>
				</Dialog>

				<Dialog>
					<Loader open={isLoad}/>
				</Dialog>
      </DialogActions>
    </Dialog>
  )
};

export default memo(NewContract);

