import { useEffect, useState } from 'react';
import { Button, useMediaQuery, useTheme, Box, Dialog } from '@mui/material'
import { useTranslation } from 'react-i18next';
import CustomerInputs from './CustomerInputs';
import ConfirmDialog from '../../Container2/dialogs/ConfirmDialog';
import ProductTableInvoice from './productInvoice/index';
import ServiceTableInvoice from './serviceInvoice/index';
import { ArrowBackIos } from '@mui/icons-material';
import { saleProductFromBasket } from '../../services/pay/pay';
import Loader from '../../Container2/loading/Loader';
import ProductTableAct from './productAct/index';
import ActServiceTableInvoice from './serviceAcrt/index';
import SnackErr from '../../Container2/dialogs/SnackErr';
import { useLocation } from 'react-router-dom';
import { numberSpacing } from '../../modules/numberSpacing';
import { useSuccessSound } from '../../modules/PlaySound';
import InvoiceDrafts from "./drafts/index"
import { getInvoiceTableDataByName } from '../../services/invoice/customerData';


const initialInvoiceInfo = {
    "isInvoice": true,
    "invoiceInfo": {
      "behalfOf": 0,
      "sourceCountryId": "8c961171-8f04-32ac-8dd0-baf0903d22e5",
      "sourceCountry": "Երևան",
      "sourceRegionId": null,
      "sourceCommunityId": null,
      "sourceResidenceId": null,
      "sourceStreet": null,
      "invoiceSubType": 0,
      "destinationCountryId": "8c961171-8f04-32ac-8dd0-baf0903d22e5",
      "destinationCountry": "Երևան",
      "destinationRegionId": null,
      "destinationCommunityId": null,
      "destinationResidenceId": null,
      "destinationStreet": null,
      "items": [
        {
          "dealType": null,
          "goodCode": "string",
          "name": "string",
          "vatRate": 0,
          "withoutVat": 0
        }
      ],
      
    }
  }

const InVoiceMainDialog = ({
  setPaymentInfo,
  paymentInfo,
  user,
  totalPrice, 
  deleteBasketItem,
  changeCountOfBasketItem,
  basketContent,
  setBasketContent,
  loadBasket,
  setBasketGoodsqty
}) => {
  const playSuccess = useSuccessSound();
  const [behalfOfArr,setBehalfOfArr] = useState([]);

  const {t} = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [isService, setIsService] = useState(false);
  const [isLoading, setLoading]= useState(false);
  const [message, setMessage] = useState({
    type: "",
    message: ""
  });
  const [openAttention, setOpenAttention] = useState(false);
  const [invoicePaymentInfo, setInvoicePaymentInfo] = useState(initialInvoiceInfo);
  const [newTotal, setNewTotal] = useState(0);
  const [title, setTitle] = useState("");

  const cancelOperation = async() => {
    setPaymentInfo({
      ...paymentInfo,
      invoiceInfo: {},
      isInvoice: false
    })
    localStorage.removeItem("saleData")
  };

console.log("invoicePaymentInfo", invoicePaymentInfo);

  const printValidation = (obj) => {
    if(!invoicePaymentInfo?.invoiceInfo?.buyerHasNoTin && !invoicePaymentInfo?.partnerTin) {
      return setMessage({
        type: "error",
        message: t("invoice.enterBuyerTin")
      })
    }else if(!isService && (
      !invoicePaymentInfo?.invoiceInfo?.sourceCountryId ||
      !invoicePaymentInfo?.invoiceInfo?.sourceRegionId ||
      !invoicePaymentInfo?.invoiceInfo?.sourceCommunityId ||
      !invoicePaymentInfo?.invoiceInfo?.sourceResidenceId ||
      !invoicePaymentInfo?.invoiceInfo?.sourceStreet ||
      !invoicePaymentInfo?.invoiceInfo?.destinationCountryId ||
      !invoicePaymentInfo?.invoiceInfo?.destinationRegionId ||
      !invoicePaymentInfo?.invoiceInfo?.destinationCommunityId ||
      !invoicePaymentInfo?.invoiceInfo?.destinationResidenceId ||
      !invoicePaymentInfo?.invoiceInfo?.destinationStreet 
      )) {
      return setMessage({
        type: "error",
        message: t("invoice.fillAllAdressFields")
      })
    }else if(obj?.sales?.length === 0) {
      return setMessage({
        type: "error",
        message: t("invoice.emptyProducts")
      })
    }else{
      obj?.sales?.forEach((item)=>{
        if(!item.count || item.count <= 0) {
          return setMessage({
            type: "error",
            message: t("invoice.notAvailCount")
          })
        }
      })
    }
    printInvoice(obj)
  }

  const printInvoice = async(saleData) => {
    setLoading(true)
    saleProductFromBasket({...paymentInfo, ...saleData}).then((res)=>{
      setLoading(false)
      if(res?.status === 400 || res?.status === 500) {
        return  setMessage({
          message: res?.data?.message,
          type: "error"
        }) 

      }else{
        playSuccess();
        cleanOnlyInvoiceSales(saleData)
        setInvoicePaymentInfo(initialInvoiceInfo)
        localStorage.removeItem("saleData")
        window.open(res?.link, '_blank', 'noopener,noreferrer');
      }
    })
  }

  const cleanOnlyInvoiceSales = async(saleData) => {
    const salesIdsSet = new Set(saleData.sales.map(item => item.id))
    const cleanedBasket = await basketContent.filter(
      item => !salesIdsSet.has(item.id)
    );

    localStorage.setItem("bascket1", JSON.stringify(cleanedBasket))
    setBasketContent(cleanedBasket)
    loadBasket(cleanedBasket)
  }

  const getFromLocalStorage = () => {
    const data = localStorage.getItem("saleData");
    if(data) {
      setInvoicePaymentInfo({
        ...JSON.parse(data)
      })
    }
  };

  const getBehalfOfFunc = () => {
    getInvoiceTableDataByName("InvoiceBehalfOf",!!invoicePaymentInfo?.invoiceInfo?.invoiceType).then((res) => {
      if(res?.length && Array.isArray(res)) {
        return setBehalfOfArr(res)
      }else{
      }
    })
  }

  useEffect(() => {
    getFromLocalStorage()
  }, []);

  useEffect(() => {
    localStorage.setItem("saleData", JSON.stringify(invoicePaymentInfo))
  }, [invoicePaymentInfo, isService]);

  useEffect(() => {
    getBehalfOfFunc()
  }, []);

  return (
    isLoading ? 
    <Dialog open={isLoading}>
      <Loader />
    </Dialog>:
    <div style={{paddingTop:"70px", minWidth: fullScreen ? "100%":"500px", margin:"10px"}}>
      <div style={{display:"flex",alignItems:"center", justifyContent:"start",marginBottom:"10px"}}>
        <h5>{t("settings.createInvoice")}</h5>
      </div>

  { !title ?
    <div style={{display:"flex",justifyContent:"space-around",marginBottom:"20px", gap:"20px", color:"grey"}}>

      <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
        <h5 id="invoiceType0">{t("invoice.mainType1")}</h5>
        <Button
          variant='outlined'
          name={t("invoice.subTypeProd1")}
          onClick={(e)=>{
            setTitle(e.target.name)
            setIsService(false)
            setInvoicePaymentInfo({

              ...invoicePaymentInfo,
              invoiceInfo: {
                ...invoicePaymentInfo.invoiceInfo,
                sourceCountryId: "8c961171-8f04-32ac-8dd0-baf0903d22e5",
                destinationCountryId: "8c961171-8f04-32ac-8dd0-baf0903d22e5",
                invoiceType: 0,
                invoiceSubType: 0
              }
            })
            localStorage.setItem("isServiceSale",false)
          }}
          >
          {t("invoice.subTypeProd1")}
        </Button>
        <Button
          variant='outlined'
          name={t("invoice.subTypeServ1")}
         onClick={(e)=>{
            setTitle(e.target.name)
            setIsService(true)
            setInvoicePaymentInfo({
              ...invoicePaymentInfo,
              invoiceInfo: {
                ...invoicePaymentInfo.invoiceInfo,
                sourceCountryId: null,
                destinationCountryId: null,
                invoiceType: 0,
                invoiceSubType: 2
              }
            })
            localStorage.setItem("isServiceSale",true)
          }}
          
        >
          {t("invoice.subTypeServ1")}
        </Button>

      </div>
        <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
        <h5>{t("invoice.mainType2")}</h5>
        <Button
          variant='outlined'
          name={t("invoice.subTypeProd2")}
          onClick={(e)=>{
            setTitle(e.target.name)
            setIsService(false)
            setInvoicePaymentInfo({
              ...invoicePaymentInfo,
              invoiceInfo: {
                ...invoicePaymentInfo.invoiceInfo,
                sourceCountryId: "8c961171-8f04-32ac-8dd0-baf0903d22e5",
                destinationCountryId: "8c961171-8f04-32ac-8dd0-baf0903d22e5",
                invoiceType: 1,
                invoiceSubType: 6
              }
            })
            localStorage.setItem("isServiceSale",false)
          }}
        >
          {t("invoice.subTypeProd2")}
        </Button>
        <Button
          variant='outlined'
          name={t("invoice.subTypeServ2")}
          onClick={(e)=>{
            setTitle(e.target.name)
            setIsService(true)
            setInvoicePaymentInfo({
              ...invoicePaymentInfo,
              invoiceInfo: {
                ...invoicePaymentInfo.invoiceInfo,
                sourceCountryId: null,
                destinationCountryId: null,
                invoiceType: 1,
                invoiceSubType: 7
              }
            })
            localStorage.setItem("isServiceSale",true)
          }}
        >
          {t("invoice.subTypeServ2")}
        </Button>

      </div>
    </div>:
    <Box>
    <div style={{display:"flex", alignItems:"center", marginBottom:"20px", color:"grey",fontSize:"18px"}}>
      <ArrowBackIos fontSize="small" style={{cursor:"pointer", marginRight:"10px"}} onClick={()=>setTitle("")} />
      {title}
    </div>
     <div style={{display:"flex", justifyContent:"flex-start",fontWeight:600,fontSize:"120%",marginBottom:"15px",color:"#308ac5"}}>
      {!invoicePaymentInfo?.invoiceInfo?.invoiceType ? t("invoice.invoiceType") : t("invoice.invoiceType2")}
    </div>
   
    <CustomerInputs 
      setPaymentInfo={setPaymentInfo}
      paymentInfo={paymentInfo}
      user={user}
      invoicePaymentInfo={invoicePaymentInfo}
      setInvoicePaymentInfo={setInvoicePaymentInfo}
      isService={isService}
      behalfOfArr={behalfOfArr}
    />
    {
      invoicePaymentInfo?.invoiceInfo?.invoiceSubType === 0 &&
      <ProductTableInvoice
        basketContent={basketContent}
        deleteBasketItem={deleteBasketItem} 
        invoicePaymentInfo={invoicePaymentInfo}
        setInvoicePaymentInfo={setInvoicePaymentInfo}
        changeCountOfBasketItem={changeCountOfBasketItem}
        printInvoice={printInvoice}
        setNewTotal={setNewTotal}
      /> 
    } 
    {
       invoicePaymentInfo?.invoiceInfo?.invoiceSubType === 2 &&
      <ServiceTableInvoice
        basketContent={basketContent}
        deleteBasketItem={deleteBasketItem} 
        invoicePaymentInfo={invoicePaymentInfo}
        setInvoicePaymentInfo={setInvoicePaymentInfo}
        changeCountOfBasketItem={changeCountOfBasketItem}
        printInvoice={printInvoice}
        setNewTotal={setNewTotal}

      />
    }
    {
      invoicePaymentInfo?.invoiceInfo?.invoiceSubType === 6 &&
      <ProductTableAct
        basketContent={basketContent}
        deleteBasketItem={deleteBasketItem} 
        invoicePaymentInfo={invoicePaymentInfo}
        setInvoicePaymentInfo={setInvoicePaymentInfo}
        changeCountOfBasketItem={changeCountOfBasketItem}
        printInvoice={printInvoice}
        setNewTotal={setNewTotal}

      /> 
    } 
    {
      invoicePaymentInfo?.invoiceInfo?.invoiceSubType === 7 &&
      <ActServiceTableInvoice
        basketContent={basketContent}
        deleteBasketItem={deleteBasketItem} 
        invoicePaymentInfo={invoicePaymentInfo}
        setInvoicePaymentInfo={setInvoicePaymentInfo}
        changeCountOfBasketItem={changeCountOfBasketItem}
        printInvoice={printInvoice}
        setNewTotal={setNewTotal}

      /> 
    } 
         <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          marginTop: '16px' ,
          cursor:"pointer"
        }}>
          <span 
            onClick={()=> {
              printValidation({
                ...paymentInfo,
                ...invoicePaymentInfo,
                cardAmount: newTotal,
              })
          }}
          style={{
            padding: '8px 24px',
            fontSize: '16px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            marginBottom:"20px"
          }}>
            {t("basket.recieptPrice")} {numberSpacing(newTotal)}{t("units.amd")}
          </span>
        </div>
    </Box>
  }
    {title ? "":<InvoiceDrafts behalfOfArr={behalfOfArr} setBehalfOfArr={setBehalfOfArr} /> }
    <ConfirmDialog
      open={openAttention}
      close={()=>setOpenAttention(false)}
      func={cancelOperation}
      content={t("settings.cleanInvoiceData")}
    />
    <Dialog open={!!message?.message}>
      <SnackErr message={message?.message} type={message?.type} close={setMessage} />
    </Dialog>
</div>)
}

export default InVoiceMainDialog