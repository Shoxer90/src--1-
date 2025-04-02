import { memo } from "react";

const divStyle = {
  display:"flex",
  flexFlow:"row nowrap",
  alignItems:"center",
  gap: "3px", 
  width:"60%"
}

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
    <div style={divStyle}>
      <img src="/visaNew.png" alt="visaNew" style={visa} />
      <img src="/master2New.png" alt="masterNew" style={master} />
      <img src="/arcaNew.png" alt="arcaNew" style={arca} />
    </div>
  )
};

export default memo(PaymentLogo);


