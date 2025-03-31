import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from "@mui/material";
import { getDataByTin } from "../../../../services/auth/auth";

import styles from "./index.module.scss";

const Step1 = ({
  setInfoDialog, 
  setLoader,
  setMessage,
  saveUserDataForEhdm,
  newUser, 
  setNewUser,
  user
}) => {
  const {t} = useTranslation();

  const [submitClick, setSubmitClick] = useState(false);
  const taxtType = [
    {
      id: 1,
      name: t("productinputs.nds"),
    },  {
      id: 2,
      name: t("productinputs.ndsNone"),
    },  {
      id: 3,
      name: t("productinputs.tax3"),
    },  {
      id: 7,
      name: t("productinputs.tax7"),
    },
  ];

  const handleChange = (e) => {
    setSubmitClick(false)
    setInfoDialog({
      isOpen: false,
      message:"",
      type:"",
    })
    setNewUser({
      ...newUser,
      [e.target.name]:e.target.value
    })
  };
    
  const limitChar = (e,val) => {
    const text = e.target.value;  
      const valid = /^[0-9]*$/;
    if(valid.test(text) &&  text.length <= val) {
      setNewUser({
        ...newUser,
        [e.target.name]: e.target.value,
      
      })
      if(e.target.name === "tin") {
        setNewUser({
          ...newUser,
          [e.target.name]: e.target.value,
          legalName: "",
          legalAddress: ""
        })
        if(text.length === 8) {
          setLoader(true)
          getDataByTin(e.target.value).then((res) => {
            setLoader(false)
            if(res?.response?.status === 400) {
              setInfoDialog({isOpen: true, message:res?.response?.data?.message, type:"error"})
            }else{
              setNewUser({
                ...newUser,
                tin: e.target.value,
                legalName: res?.data?.legalName,
                legalAddress: res?.data?.legalAddress
              })
            }
          })
        }
      }
    }
  };
  
  const completeRegistration = () => {
    setSubmitClick(true)
    if(
      newUser?.legalAddress &&
      newUser?.tin &&
      newUser?.legalName &&
      newUser?.taxRegime
    ) {
      saveUserDataForEhdm({
        ...newUser,
        tradeName: user?.tradeName,
        isRegisteredForEhdm: true
      })
    
    }else{
      setMessage({type:"error", message:t("authorize.errors.allInputEmpty"), isOpen:"true"})
    }
  };
  

  return (
    <div className={styles.update_card}>
        <h6>{t("authorize.completeEhdmAuth")}</h6>
    <TextField sx={{m:.6}} 
      autoComplete="off"
      inputProps={{
        style: {
          height: "30px",
          width:"70%",
          padding:"1px 10px",
          margin: "10px"
        }
      }}
      error={(!newUser?.tin && submitClick)|| (newUser?.tin && newUser?.tin?.length !==8)}
      name="tin"
      value={newUser?.tin}
      placeholder={`${t("authorize.tin")} (8 ${t("productinputs.symb")}) *`} 
      onChange={(e)=>limitChar(e,8)}     
      />
      <span style={{color:"black", textAlign:"start", margin:"10px"}}>
        <div>
          <span 
            style={{
              fontWeight:700,
              color:(submitClick && !newUser?.legalName) ? "red": "black"
            }}
          >{`${t("authorize.legalName")} *`}</span>
          <span>{newUser?.legalName}</span>
        </div>
        <div>
          <span 
            style={{
              fontWeight:700,
              color:(submitClick && !newUser?.legalAddress) ? "red": "black"
            }}
            >
            {`${t("authorize.legalAddress")} *`}
            </span>
          <span>{newUser?.legalAddress}</span>
        </div>
      </span>
      {/* <FormControl sx={{ width: "50%", margin:"10px"}}>
        <Select
          error={!newUser?.taxRegime && submitClick}
          size="small"
          name="taxRegime"
          value={newUser?.taxRegime}
          onChange={(e)=>handleChange(e)}
          displayEmpty
          renderValue={(value) => (value ? newUser?.taxRegime : `${t("authorize.taxType") } *`)} 
        >
          {taxtType && taxtType.map((item, index) => (
            <MenuItem 
              key={item?.id} 
              value={item?.id}
            >
              {item?.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}
      <h6 
        style={{
          textAlign:"start",
          padding:"0px",
          marginLeft:"25px",
          color:!newUser?.taxRegime && submitClick ? "red": "black"
        }}
      >
        {`${t("authorize.taxType") } *`}
      </h6>
      <FormControl sx={{color:"black"}}>
        <RadioGroup
          name="taxRegime"
          value={newUser?.taxRegime}
          onChange={(e)=>handleChange(e)}
        >
        {taxtType && taxtType.map((item) => (
          <FormControlLabel sx={{ p:0,ml:2}} value={item?.id} control={<Radio />} label={item?.name} />
        ))}
        </RadioGroup>
      </FormControl>

      <Button 
          sx={{
            textTransform: "capitalize",
            padding:"2px 20px"
          }}
          variant="contained" 
          onClick={completeRegistration}
        >
          {t("buttons.submit")}    
      </Button>
    </div>
  )
};

export default memo(Step1);
