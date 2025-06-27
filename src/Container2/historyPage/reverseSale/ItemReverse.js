import { memo, useEffect } from "react";
import QrCode2Icon from '@mui/icons-material/QrCode2';
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";
import { Divider } from "@mui/material";

const ItemReverse = ({
  photo, 
  brand, 
  name, 
  count, 
  recieptId,
  discountedPrice,
  unit,
  isChecked,
  quantity,
  emarks,
  reverseContainer,
  setReverseContainer,
  checkedProduct,
  totalCounter,
}) => {
 const {t} = useTranslation();

  const handleChange = (e) => {
    let isValid = false;
    const data = e.target.value;
    setReverseContainer(reverseContainer.map((item) => {
        if(item?.recieptId === recieptId && +e.target.value <= +count){
        if(unit === "հատ"){
          const needSymb = /^[0-9]*$/;
          isValid = needSymb.test(data)
          if(isValid || e.target.value === "") {
            return{
              ...item,
              [e.target.name]: Math.ceil(+e.target.value)
            }
          }else{
            return item
          }
        }else{
          const needSymb = /^\d+(\.\d{0,3})?$/
          isValid = needSymb.test(data)
          if(isValid || e.target.value === "") {
            if (e.target.value[`${e.target.value}`.length - 1] === "."){
              return {
                ...item,
                [e.target.name]: e.target.value
              }
            }else{ 
              return{
                ...item,
                [e.target.name]: Math.round(+e.target.value * 100) / 100
              }
            }
          }else if (e.target.value === "0" || e.target.value === "."){
            return {
              ...item,
              [e.target.name]: "0."
            }
          }
          return item
        }
      }else{
        return item
      }
    }))
  };

  useEffect(() => {
    totalCounter()
  },[reverseContainer]);

  return(
    <div style={{display:"flex", flexFlow:"column"}}>
      <label className={styles.radioDialog}>
        <span style={{display:"flex",alignItems:"center"}}>
          <input 
            type="checkbox" 
            name="isChecked"
            onChange={(e)=>checkedProduct(recieptId, e.target.name, e.target.checked)}
            checked={isChecked || false}
          />
          <img src={photo || "/default-placeholder.png"} alt="prod" />
          <span style={{fontWeight:600, marginLeft:"5px"}}>{brand} {name}</span>
        
          {emarks.length ? 
          <div style={{alignItems:"center", color:"green"}}><QrCode2Icon fontSize="xsmall" sx={{ml:1, mb:.5}} /><>×{emarks.length}</></div>:''
          }
        </span>
        <label className={styles.reverse_quantity}>
          <span style={{alignContent:"center",marginRight:"10px"}}>{count} {t(`units.${unit}`)} × {discountedPrice} {t("units.amd")}</span>
          <input
            className={styles.reverse_quantity_input}
            autoComplete="off"
            name="quantity"
            value={quantity}
            onChange={(e)=>handleChange(e)}
          />
          <span style={{minWidth:"60px"}}>
            {t(`units.${unit}`)}
          </span> 
        </label>
      </label> 
      <Divider color="black" sx={{m:0, p:0}} />
    </div>
  )
};

export default memo(ItemReverse);
