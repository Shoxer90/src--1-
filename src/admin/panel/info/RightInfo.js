import { memo, useState } from "react";
import styles from "./index.module.scss";
import { Button } from "@mui/material";
import PassDialog from "../dialogs/pass/PassDialog";
import { createDateFormat } from "../../modules/variables";

const o =  {
  "director": {
      // "id": 1846,
      // "email": "bebevdvdv",
      "businessAddress": " ",
      // "phoneNumber": "99494499",
      "city": " ",
      "country": "b fbbfvfjix",
      "zipCode": " ",
      "firstName": "  db",
      "lastName": "bndbbdb",
      "isInDate": false,
      "days": 0,
      "showPaymentPage": true,
      "isRegisteredInEhdm": false,
      "activeServiceType": 1,
      "contractLink": "",
      "nextPaymentDate": "0001-01-01T00:00:00",
      // "cashiersMaxCount": 0,
      "confirmation": false,
      "registrationCode": "",
      "isActive": true,
      "status": 0,
      "agreementDate": "",
      "agreementNo": "",
      "completedRegistration": true,
      // "regDate": "2025-02-19T15:09:49.352872Z"
  },
  "store": {
      "id": 1590,
      // "legalName": "sbbd dbsidn ",
      // "logo": "https://storex.payx.am/standartlogo.jpg",
      "legalAddress": "bvrvekfod  ",
      "city": "b3bev f    r",
      // "tin": "62820660",
      "zipCode": "nnrbbfbdnn",
      "status": false,
      "taxRegime": 0,
      "merchantXExist": false,
      "merchantType": 0,
      "directorId": 1846,
      // "bankInformation": {
      //     "externalPaymentType": 1,
      //     "tidApi": "",
      //     "tidPassword": " ",
      //     "clientId": "",
      //     "bankName": "",
      //     "sphere": ""
      // }
  }
}


const RightInfo = ({customerInfo}) => {

  const [isOpenPassDialog, setIsOpenPassDialog] = useState(false);
  const [openHidingInfo, setOpenHidingInfo] = useState(false);

  const setOpenBankInfo = (pass) => {
    setOpenHidingInfo(true)
    setIsOpenPassDialog(false)
  }

  return (
    <div className={styles.right_info}>
      

      <Button
        variant="contained"
        onClick={()=> {
          !openHidingInfo? setIsOpenPassDialog(true): setOpenHidingInfo(false)
        }}
      >
        {openHidingInfo ? "Hide Info" : "More Info"}
      </Button>
      <PassDialog
        open={isOpenPassDialog}
        close={()=> setIsOpenPassDialog(false)}
        func={setOpenBankInfo}
      />
      {
        openHidingInfo &&
        <>
          <h5>More Info</h5>

        <div style={{display:'flex', flexFlow:"column"}}>
         <div> cashiers max count {customerInfo?.director?.cashiersMaxCount}</div> 
         <div> registrated at {createDateFormat(customerInfo?.director?.regDate)}</div> 
         {customerInfo?.director?.contractLink && <a href={customerInfo?.director?.contractLink} target="_blank"> contractLink </a> }
         <h5>Bank</h5>
         <div> externalPaymentType {customerInfo?.store?.bankInformation?.externalPaymentType}</div> 
         <div>tidApi {customerInfo?.store?.bankInformation?.tidApi || "no info"}</div> 
         <div>tidPassword {customerInfo?.store?.bankInformation?.tidPassword || "no info"}</div> 
         <div>clientId {customerInfo?.store?.bankInformation?.clientId || "no info"}</div> 
         <div>bankName {customerInfo?.store?.bankInformation?.bankName || "no info"}</div> 
         <div>sphere {customerInfo?.store?.bankInformation?.sphere || "no info"}</div> 
        </div>
        </>
      }


    </div>
  )
};
 
export default memo(RightInfo);
