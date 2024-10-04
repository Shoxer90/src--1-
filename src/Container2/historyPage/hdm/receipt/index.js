import React,{ useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  Divider,
} from '@mui/material';

import ActionMessage from '../../../dialogs/ActionMessage';
import SharePage from './SharePage';
import ReceiptHeader from './ReceiptHeader';
import ReverseBtn from './ReverseBtn';
import ReceiptPartners from './ReceiptPartners';
import ReceiptItem from './ReceiptItem';
import ReceiptFooter from './ReceiptFooter';
import styles from "./index.module.scss";
import ReceiptFiscal from './ReceiptFiscal';

const Reciept = ({ 
  setOpenHDM, 
  taxCount,
  saleData, 
  openHDM, 
  date, 
  totalPrice,
  t,  
  userName,
  reverseButton,
  dialogManage
}) => {
  
  const componentRef = useRef();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  
  const handleClickOpen = () => {
    setOpen(!open);
  };

  return (
    <Dialog
      sx={{ height:'auto'}}
      maxWidth="xs"
      open={openHDM && saleData}
    >
      {message &&
        <ActionMessage 
          setMessage={setMessage}
          type=" " 
          message={message} 
       />
      }
      <DialogActions sx={{justifyContent:"space-between"}}>
        <ReceiptHeader 
          saleData={saleData} 
          componentRef={componentRef}
          handleClickOpen={handleClickOpen}
          setMessage={setMessage}
          t={t}
        />
        <Button  variant="text" onClick={()=>setOpenHDM(false)}  sx={ { borderRadius: 38,width: 5 } }>
          <CloseIcon />
        </Button>
      </DialogActions>

      {reverseButton && 
        <ReverseBtn dialogManage={dialogManage} t={t} />
      }
      <Divider sx={{bgcolor:"black"}} />
      <DialogContent className={styles.receipt} ref={componentRef}>
        <ReceiptPartners 
          partner={saleData?.res}
          userName={userName}
          date={date}
          taxCount={taxCount}
        />
        {saleData?.res?.printResponseInfo?.receiptType !== 3 ?
          saleData?.res?.printResponseInfo?.items && saleData?.res?.printResponseInfo?.items.map((product, i) => {
           
          return  <ReceiptItem key={i} {...product} i={i} />
          }) :
          <div style={{ margin:"10px",display:'flex',justifyContent:"center"}}>
            <span>Կանխավճար  {saleData?.res?.printResponseInfo?.totalAmount.toFixed(2)}</span>
          </div>
        }
        <Divider style={{margin:1,backgroundColor:"gray"}}/>
        <ReceiptFooter  receiptInfo={saleData?.res?.printResponseInfo} />
        <ReceiptFiscal data={saleData?.res} />
        <SharePage
          t={t}
          open={open}
          setOpen={setOpen}
          recieptId={saleData?.res?.recieptId}
          handleClickOpen={handleClickOpen}
          setMessage={setMessage}
        />
      </DialogContent>
    </Dialog>
  )
}

export default Reciept;
 