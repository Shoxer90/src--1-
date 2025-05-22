import { memo } from "react";
import styles from "./index.module.scss";

 const BankButton = ({
  title, 
  paymentType, 
  icon, 
  createActiveBtn, 
  myTitle,
  activeBtn}) => {

  const activeStyle={
    transform: "scale(1.15)",
    boxShadow: "0 4px 12px rgba(63, 182, 138, 0.85)"
  }

  return (
    <div className={styles.payItem} style={activeBtn === paymentType? activeStyle: null} onClick={()=>createActiveBtn(paymentType)}>
      {/* {title === "Idram" ? <img src="/IDram.jpg" alt={title} style={{width:"98%", height:"99%",objectFit:"contain"}} /> : ""}
      {title === "TelCell" ? <img src="/TellCell.jpg" alt={title} style={{width:"98%",height:"99%",objectFit:"contain"}} />: ""}
      {title === "FastShift" ? <img src="/TellCell.jpg" alt={title} style={{width:"98%",height:"99%",objectFit:"contain"}} />: ""}  */}
      
      {myTitle ? <img src="/4.png" alt={title} style={{width:"98%",height:"95%",objectFit:"contain"}} />:
      <img src={icon} alt={title} style={{width:"98%",height:"95%",objectFit:"contain"}} />}


       {/* {title === "Idram" ? <img src={icon} alt={title} style={{height: "22px"}} /> : ""}
      {title === "TelCell" ? <img src={icon} alt={title} style={{height: "50px"}} />: ""}
      {title === "FastShift" ? <img src={icon} alt={title} style={{height: "50px"}} />: ""}
      {myTitle ? <img src={icon} alt={title} style={{height: "28px"}} />: ""} */}
    </div>
  )

};
export default memo(BankButton);
