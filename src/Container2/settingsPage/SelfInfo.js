import { Alert, Avatar, BottomNavigation, Button, Card, Divider, Snackbar } from "@mui/material";
import React from "react";
import { memo } from "react";
import AddIcon from '@mui/icons-material/Add';
import styles from "./index.module.scss";
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";
import addUserNumber, { addUserAdress, addUserEmail, updateUserPassword } from "../../services/user/userInfoQuery";
import AddNewClientInfo from "../dialogs/AddNewClientInfo";

const SelfInfo = ({client, removefunc, setClient, t}) => {
  const [inputLabels, setInputLabels] = useState()
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [message, setMessage] = useState();
  const [dialogName, setDialogName] = useState("");
  const [type,setType] = useState();

  const addfunc = async (data) => {

    setMessage("")
    if(dialogName === "phone") {
      addUserNumber({id:0,phoneNumber:data[t("settings.newPhone")]})
      setClient({
        ...client,
        phone:[...client.phone,{id:0,phoneNumber:data[t("settings.newPhone")]}]
      })
    }else if(dialogName === "address") {
      addUserAdress( {
        city: data[t("authorize.city")],
        street: data[t("authorize.street")],
        block: data[t("authorize.block")], 
        build: data[t("authorize.build")],
        })
      setClient({
        ...client,
        address:[
          ...client.address,
          {
          city: data[t("authorize.city")],
          street: data[t("authorize.street")],
          block: data[t("authorize.block")], 
          build: data[t("authorize.build")],
          }
        ]
      })
        
    }else if(dialogName === "emails") {
      addUserEmail({id:0,emailTitle:data[t("settings.newEmail")]})
      setClient({
        ...client,
        emails:[...client.emails,{id:0,emailTitle:data[t("settings.newEmail")]}]
      })
    }else if(dialogName === "password") {
      if((data[t("settings.changepassword")] === ""||
        data[t("settings.changepassword")] === undefined) ||
        (data[t("settings.confirmpassword")] === "" ||
        data[t("settings.confirmpassword")] === undefined)
      ){
        setType("error")
        setMessage(t("dialogs.empty"))
        setTimeout(()=>{
          setMessage("")
        },3000)
        return
      }else if(data[t("settings.changepassword")] !== data[t("settings.confirmpassword")]){
        setType("error")
        setMessage(t("dialogs.mismatch"))
        setTimeout(()=>{
          setMessage("")
        },3000)
        return
      }else{
         await updateUserPassword({"password":`${data[t("settings.changepassword")]}`}).then((resp) => {
          setMessage(resp)
          setType("success")
          setMessage(t("dialogs.done"))
        })
      }
    } 
    setTimeout(()=>{
      setMessage("")
      // setOpenAddDialog(false)
      setType("")
      setInputLabels()
    },3000)
  };

  const addClientInfo = async(name) => {
    setDialogName(name)
    if(name === "phone") {
      setInputLabels([t("settings.newPhone")])
    }else if(name === "address") {
      setInputLabels([t("authorize.city"), t("authorize.street"), t("authorize.block"), t("authorize.build")])
    }else if(name === "emails") {
      setInputLabels([t("settings.newEmail")])
    }else if(name === "password") {
      setInputLabels([t("settings.changepassword"), t("settings.confirmpassword")])
    }
    setOpenAddDialog(true)
  };

  return (
    <>
      <h4>{t("settings.information")}</h4>
      <div className={styles.settingsCont_info}>
        <Card className={styles.settingsCont_info_name}>
          <div className={styles.settingsCont_info_name_header}>
            <h4 >{t("settings.phone")}</h4> 
            <Avatar 
              sx={{ "&:hover": { bgcolor: "green" }}}
              onClick={()=>{
                addClientInfo("phone")
                setOpenAddDialog(true)
              }}  
            >
              <AddIcon />
            </Avatar>
          </div>
            <Divider />
          <div >
            { client?.phone && client?.phone.map((item,index) => (
              <div className={styles.settingsCont_info_item} key={index} >
                <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}} >
                  ({item?.phoneNumber.slice(0, 3)}) {
                  item?.phoneNumber.slice(3, 5)}-{item?.phoneNumber.slice(5, 7)}-{item?.phoneNumber.slice(7,9)}
                  <Avatar 
                    sx={{ 
                      width:30,
                      height:30,
                      marginLeft: "15px"
                    }}
                    onClick={()=>removefunc(item.id,"phone")}
                  >
                    <DeleteIcon fontSize="small"/>
                  </Avatar>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className={styles.settingsCont_info_name}>
        <div className={styles.settingsCont_info_name_header}>

          <h4>{t("settings.address")}</h4> 
          <Avatar
            sx={{ "&:hover": { bgcolor: "green" }}}
            onClick={()=>{
              addClientInfo("address")
              setOpenAddDialog(true)
            }} 
          >
            <AddIcon />
          </Avatar>
          </div>
          <Divider />
          <div className={styles.info_items}>
              <div className={styles.settingsCont_info_item} style={{fontSize:"90%"}}>
                <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}} >
                  {client?.address[0].city} / {client?.address[0].street}
                  <span>{" "}</span>
                  {client?.address[0].block}, {client?.address[0].build}
                  <Avatar sx={{ 
                    width:30,
                    height:30,
                    marginLeft: "15px"}}
                    onClick={()=>removefunc(client?.address[0].id,"address")}
                  >
                    <DeleteIcon fontSize="small"/>
                  </Avatar>
                </div>
              </div>
          </div>
        </Card>
        <Card className={styles.settingsCont_info_name}>
        <div className={styles.settingsCont_info_name_header}>
          <h4>{t("settings.email")}</h4>
          <Avatar 
            sx={{ "&:hover": { bgcolor: "green" }}}
            onClick={()=>{
              addClientInfo("emails")
              setOpenAddDialog(true)
            }}
          >
            <AddIcon />
          </Avatar>
          </div>
        <div className={styles.info_items}>
            { client?.emails && client?.emails.map((item,index) => (
              <div className={styles.settingsCont_info_item} key={index}>
                <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}} >
                  {item?.emailTitle}
                <Avatar sx={{
                  width:30,
                  height:30,
                  marginLeft: "15px"
                }}
                  onClick={()=>removefunc(item.id,"email")}
                  >
                    <DeleteIcon fontSize="small"/>
                  </Avatar>
                  </div>
              </div>
            ))}
          </div>
        </Card>
        {inputLabels && 
          <AddNewClientInfo 
            t={t}
            message={message}
            setMessage={setMessage}
            openAddDialog={openAddDialog}
            setOpenAddDialog={setOpenAddDialog}
            label={inputLabels} 
            addfunc={addfunc} 
            setInputLabels={setInputLabels}
            dialogName={dialogName}
            type={type}
          />
        }
      </div>
        <Button 
          sx={{margin: 5}}
          onClick={()=>addClientInfo("password")}
          >
          {t("settings.changepassword")}
        </Button>
        <Snackbar open={message} autoHideDuration={6000} onClose={()=>setMessage()}>
        <Alert onClose={()=>setMessage()} severity="info" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  )
};

export default memo(SelfInfo);
