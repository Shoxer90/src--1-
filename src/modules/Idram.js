import { memo } from "react";
const logoStyle={
  position:"relative",
  
}
const hiddenContent = {
  position:"absolute",
  top:"5px",
  left:"10px",
  zIndex:"-10",

}
const IdramPay = () => {
  return (
    <div>
      <img src="https://www.idram.am/assets/icons/logo.svg" alt="idaramLogo" type="submit"/>
      <form action="https://banking.idram.am/Payment/GetPayment" method="POST">
        <input type="hidden" name="EDP_LANGUAGE" value="EN" />
        <input type="hidden" name="EDP_REC_ACCOUNT" value="100000114" />
        <input type="hidden" name="EDP_DESCRIPTION" value="Order description"/>
        <input type="hidden" name="EDP_AMOUNT" value="1900" />
        <input type="hidden" name="EDP_BILL_NO" value ="1806" />
        <input type="submit" value="submit" />
      </form>
    </div>
  )
};

export default memo(IdramPay);
