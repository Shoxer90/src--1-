import { memo } from "react";
import styles from "./index.module.scss";

 const BankButton = ({
  title, 
  paymentType, 
  icon, 
  createActiveBtn, 
  activeBtn}) => {

  const activeStyle={
    transform: "scale(1.15)",
    boxShadow: "0 4px 12px rgba(63, 182, 138, 0.85)"
  }

  return (
    <div className={styles.payItem} style={activeBtn === paymentType? activeStyle: null} onClick={()=>createActiveBtn(paymentType)}>
      {title === "Idram" ? <img src="/IDram.jpg" alt={title} style={{height: "22px"}} /> : ""}
      {title === "TelCell" ? <img src="/TellCell.jpg" alt={title} style={{height: "50px"}} />: ""}
      <div style={{display:"flex", flexFlow:"column"}}>
      {title === "Arca" ? <img src="/4.png" alt={title} style={{height: "28px"}} />: ""}
      {/* {title === "Arca" ? <img src="/6.png" alt={title} style={{height: "28px"}} />: ""} */}

        {/* {title === "Arca" ?<img src="/card_icon.png" alt?={title} style={{height: "40px", padding:"3px", objectFit:"contain"}} />: ""}
        {title === "Arca" ?<img src="/multicard.jpg" alt={title} style={{height: "10px"}} />: ""} */}
      </div>
    </div>
  )

};
export default memo(BankButton);
