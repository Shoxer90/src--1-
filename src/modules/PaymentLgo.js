import { memo } from "react";

const divStyle = {
  display:"flex",
  flexFlow:"row nowrap",
  alignItems:"center",
  gap: "3px", 
  marginLeft: "0px",
  marginRight: "30px"
}
// new
const master = {
  height: "18px",
}
const visa = {
  height: "15px",
}
const arca = {
  height: "13px",
}

const PaymentLogo = () => {
  return(
    <span style={divStyle}>
      <img src="/visaNew.png" alt="visaNew" style={visa} />
      <img src="/master2New.png" alt="masterNew" style={master} />
      <img src="/arcaNew.png" alt="arcaNew" style={arca} />
    </span>
  )
};

export default memo(PaymentLogo);


