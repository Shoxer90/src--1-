import React,{ useEffect, useRef, useState } from 'react';
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
import ReceiptPartners from './ReceiptPartners';
import ReceiptItem from './ReceiptItem';
import ReceiptFooter from './ReceiptFooter';
import styles from "./index.module.scss";
import ReceiptFiscal from './ReceiptFiscal';
import { useTranslation } from 'react-i18next';

const Reciept = ({ 
  setOpenHDM, 
  taxCount,
  saleData, 
  openHDM, 
  date, 
  totalPrice,
  userName,
}) => {
  const {t} = useTranslation();
  const componentRef = useRef();

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [buildedData, setBuildData] = useState({ });
  
  const handleClickOpen = () => {
    setOpen(!open);
  };

  const buildRecData = () => {
    let synthData = {
      dep1:{
        total: 0,
        prod: [],
        amount: 0
      },
      dep2:{
        total: 0,
        prod: [],
        amount: 0
      },
      dep3:{
        total: 0,
        prod: []
      },
      dep7:{
        total: 0,
        prod: []
      },
    }
    saleData?.res?.printResponseInfo?.items.forEach((item) => {
      if(item?.dep === 1) {
        synthData = {
          ...synthData,
          dep1:{
            prod: [...synthData?.dep1?.prod, item],
            total: synthData?.dep1?.total + (item?.totalWithTaxes - item?.totalWithoutTaxes),
            amount: +synthData?.dep1?.amount + item?.totalWithTaxes
          }
        }
      }else if(item?.dep === 2) {
        synthData = {
          ...synthData,
          dep2:{
            prod: [...synthData?.dep2?.prod, item],
            total: 0,
            amount: +synthData?.dep2?.amount + item?.totalWithTaxes
          }
        }
      }else if(item?.dep === 3) {
        synthData = {
          ...synthData,
          dep3:{
            prod: [...synthData?.dep3?.prod, item],
            amount: +synthData?.dep2?.amount + item?.totalWithTaxes

          }
        }
      }else if(item?.dep === 7) {
        synthData = {
          ...synthData,
          dep7:{
            prod: [...synthData?.dep7?.prod, item],
            // total: synthData?.dep7?.total + (item?.totalWithTaxes - item?.vat/100)
          }
        }
      }
    })
    setBuildData(synthData)
  }


  useEffect(() => {
    buildRecData()
  }, []);

  return (
    <Dialog
      sx={{ height:'auto', padding:"10px"}}
      maxWidth="xs"
      open={openHDM && buildedData && saleData}
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
      <Divider sx={{bgcolor:"black"}} />
      <DialogContent className={styles.receipt} ref={componentRef}>
        <ReceiptPartners 
          partner={saleData?.res}
          userName={userName}
          date={date}
          taxCount={taxCount}
          saleData={saleData}
          buildedData={buildedData}
        />
          {saleData?.res?.printResponseInfo?.receiptType !== 3 ?
          <>
            { buildedData?.dep1?.prod?.length ? 
              <>
                <span style={{fontWeight:600}}>
                  <div>Բաժին 1</div>
                  <div>/ԱԱՀ-ով հարկվող/ = {(buildedData?.dep1?.amount).toFixed(2)} դրամ </div>
                  <div>Որից ԱԱՀ = {(buildedData?.dep1?.total).toFixed(2)} դրամ</div>
                  </span>
                <div style={{display:"flex", border:"dashed black 1px", width:"100%"}}></div>

                {buildedData?.dep1?.prod?.map((product,i) => {
                  return <ReceiptItem key={product?.goodCode} {...product} i={i} />
                })}
              </>:""
            }
            { buildedData?.dep2?.prod?.length ? 
              <>
                <div style={{display:"flex", border:"dashed black 1px", width:"100%"}}></div>

                <span style={{fontWeight:600}}>
                  <div>Բաժին 2</div>
                  <div>/ԱԱՀ-ով չհարկվող/ = {(buildedData?.dep2?.amount).toFixed(2)} դրամ</div>
                  <div>Որից ԱԱՀ = {(buildedData?.dep2?.total).toFixed(2)} դրամ</div>
                  </span>
                <div style={{display:"flex", border:"dashed black 1px", width:"100%"}}></div>

                {buildedData?.dep2?.prod?.map((product,i) => {
                  return <ReceiptItem key={product?.goodCode} {...product} i={i} />
                })}
              </> : ""
            }
            { buildedData?.dep3?.prod?.length  ? 
              <>
                <div>
                  <div>/Շրջ․ հարկվող/ = {buildedData?.dep3?.amount.toFixed(2)} դրամ</div>
                  <div>Որից ԱԱՀ = 0 դրամ  </div>
                </div>

                {buildedData?.dep3?.prod?.map((product,i) => {
                  return <ReceiptItem key={product?.goodCode} {...product} i={i} />
                })}
              </> : ""
            }
            { buildedData?.dep7?.prod?.length  ? 
              <>
                <div> /Միկրոձեռնարկատեր/ = {buildedData?.dep7?.amount ? buildedData?.dep7?.amount?.toFixed(2): 0} դրամ </div>
                <div>Որից ԱԱՀ = 0 դրամ  </div>
                {buildedData?.dep7?.prod?.map((product,i) => {
                  return <ReceiptItem key={product?.goodCode} {...product} i={i} />
                })}
              </> : ""
            }
          </>
        :
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
