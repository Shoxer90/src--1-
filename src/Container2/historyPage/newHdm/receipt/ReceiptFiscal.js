import { QRCodeSVG } from "qrcode.react";
import React, { memo } from "react";

import styles from "./index.module.scss";

const ReceiptFiscal = ({data}) => {
  return (
    <div>
      <div style={{border:"dashed black 1px", width:"100%",margin:0}}></div>
      <div className={styles.receiptFooter}>
        {data?.printResponse?.fiscal ?  
          <span>Ֆիսկալ {data?.printResponse?.fiscal}</span> :  
          <span> Կտրոն - անդորրագրի համար  {data?.recieptId}</span>
        }
      </div>
      <div style={{border:"dashed black 1px", width:"100%"}}></div>     
      <div className={styles.receiptFooter} style={{marginTop:"5px",alignSelf:"center"}}>
        {data?.printResponse?.qr && 
          <QRCodeSVG value={data?.printResponse?.qr} size={100}/>
        }
      </div>
        </div>
  )
};

export default memo(ReceiptFiscal);
