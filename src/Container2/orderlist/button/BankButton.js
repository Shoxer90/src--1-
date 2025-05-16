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
      {title === "Idram" ? <img src="/IDram.jpg" alt={title} style={{height: "22px"}} /> : ""}
      {title === "TelCell" ? <img src="/TellCell.jpg" alt={title} style={{height: "50px"}} />: ""}
      {myTitle ? <img src="/4.png" alt={title} style={{height: "28px"}} />: ""}
    </div>
  )

};
export default memo(BankButton);
