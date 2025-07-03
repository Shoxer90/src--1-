import { memo } from "react";

const divStyle = {
  display:"flex",
  flexFlow:"row nowrap",
  alignItems:"center",
  gap: "3px", 
  width:"40%",
  marginLeft: "0px",
  marginRight: "30px"
}

const master = {
  // height: "18px",
  height: "14px",
}
const visa = {
<<<<<<< HEAD
  height: "14.5px",
=======
  // height: "15px",
  height: "11px",
>>>>>>> 6b7c59e216853be088432cff0183f2663a6fa3a7
}
const arca = {
  // height: "13px",
  height: "9px",
}

const PaymentLogo = () => {
  return(
    <div style={divStyle}>
      <img src="/visaNew.png" alt="visaNew" style={visa} />
      <img src="/master2New.png" alt="masterNew" style={master} />
      <img src="/arcaNew.png" alt="arcaNew" style={arca} />
    </div>
  )
};

export default memo(PaymentLogo);


