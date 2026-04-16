  import { memo, useEffect, useState } from 'react';
  import { useTranslation } from 'react-i18next';
  import { numberSpacing } from '../../../modules/numberSpacing';
  import { IconButton, Tooltip } from '@mui/material';
  import { useNavigate } from 'react-router-dom';
  import AddShoppingCartTwoToneIcon from '@mui/icons-material/AddShoppingCartTwoTone';
  import ServiceTableItem from './ServiceTableItem';
  
  const actionButtonStyle = {
    padding: '4px 8px',
    margin: '0 2px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px'
  };
  
  const headerStyle = {
    padding: '12px 8px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '13px',
    borderBottom: '2px solid #f0f0f0',
    backgroundColor: '#fafafa'
  };
                  
const ServiceTableInvoice = ({
    basketContent, 
    deleteBasketItem , 
    changeCountOfBasketItem,
    paymentInfo,
    invoicePaymentInfo,
    setInvoicePaymentInfo,
    printInvoice,
    setNewTotal
  }) => {
  
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [isService, setIsService] = useState(); 
    const [tableContent, setTableContent] = useState([]);
    // const [newTotal, setNewTotal] = useState(0)
  
    const columnNames = [{
      title:t("history.number"),
      key:"1",
      width: "30px",
    },
    {
      title: t("invoice.serviceName"),
      key:"2",
      width: "200px",
    },
    {
      title: t("productinputs.measure"),
      key:"4",
      width: "80px",
    },
    {
      title: t("invoice.totalVolume"),
      key:"5",
      width: "80px",
    },{
      title: t("productinputs.countPcs"),
      key:"6",
      width: "80px",
    },{
      title:  `${t("productinputs.discount")} (%)`, 
      key:"7",
      width: "80px",
    },{
      title:t("basket.totalndiscount2"),
      key:"9",
      width: "100px",
    },
    {
      title: t("invoice.taxRate"),
      key:"8.1",
      width: "100px",
    },
    {
      title: t("invoice.taxAmount"),
      key:"8.1",
      width: "100px",
    },
    {
      title: t("history.transactionType"),
      key:"8",
      width: "150px",
    }
    , {
      title:t("basket.recieptPrice"),
      key:"12",
      width: "120px",
    },
    {
      title:" ",
      key:"13",
      width: "20px",
      render: (text, record) => {
        return {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          children: [
            <button
              // onClick={() => handleCopyRow(record)}
              style={actionButtonStyle}
              title="Copy"
            > Edit</button>
          ]
        }
      }
    }];
   const filterProdsServices = async() => {
    const isService = await JSON.parse(localStorage.getItem("isServiceSale"));
    let filteredContent = [];
    let invoiceItems = []
    let totalFiltered = 0
    basketContent.map((item) => {
      if(isService &&  item?.type.includes(".")) {
          filteredContent.push(item)
          invoiceItems.push({
            "dealType": item?.dep === 1 ? null : 1,
            "goodCode":  item?.barCode,
            "name": item?.name,
            "vatRate": item?.dep === 1 ? 1 : 0,
            "withoutVat": item?.dep === 1 ? 0 : 1
          })
          totalFiltered += item?.count * item?.discountedPrice
      }else if(!isService && !item?.type.includes(".")) {
        filteredContent.push(item)
         invoiceItems.push({
            "dealType": item?.dep === 1 ? null : 1,
            "goodCode":  item?.barCode,
            "name": item?.name,
            "vatRate": item?.dep === 1 ? 1 : 0,
            "withoutVat": item?.dep === 1 ? 0 : 1
          })
        totalFiltered += item?.count * item?.discountedPrice
      }
    })
    setTableContent(filteredContent)
    setInvoicePaymentInfo({
      ...invoicePaymentInfo,
      sales:filteredContent?.map(item => ({id: item?.id, count: item?.count})),
      invoiceInfo: {
        ...invoicePaymentInfo.invoiceInfo,
        items: invoiceItems
      }
    })
    setNewTotal(totalFiltered)
    // localStorage.setItem("saleData", JSON.stringify(invoicePaymentInfo))
  }
  
    useEffect(() => {
      filterProdsServices()
    },[basketContent]);

  useEffect(() => {
  }, [invoicePaymentInfo]);
  
    return (
      <div style={{marginTop: '10px', fontFamily: 'Arial, sans-serif'}}>
        <div style={{display:"flex", justifyContent:"flex-start",fontWeight:600,fontSize:"120%",margin:"5px 0px",color:"#308ac5"}}>
          {t("invoice.tableTitle2")}
        </div>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
            }}>
              <thead>
                <tr style={{ backgroundColor: '#fafafa' }}>
                  {columnNames.map(col => (<th key={col.key} style={{...headerStyle, width: col.width}}>{col.title}</th>))}
                </tr>
              </thead>
              <ServiceTableItem 
                tableContent={tableContent}
                deleteBasketItem={deleteBasketItem}
                changeCountOfBasketItem={changeCountOfBasketItem}
                invoicePaymentInfo={invoicePaymentInfo}
              />
            </table>
          </div>
  
          <div style={{display:'flex', justifyContent:"end", margin:"5px 10px",}}>
            <Tooltip title={t("mainnavigation.newproduct")}>
              <IconButton sx={{color:"green"}} onClick={()=>navigate("/")}>
                <AddShoppingCartTwoToneIcon />
              </IconButton>
            </Tooltip>
          </div>
  
          {/* Summary */}
          {/* <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
          cursor:"pointer",
            marginTop: '16px' ,
          }}>
            <span 
              onClick={()=> {
                printInvoice({
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
              cursor: 'default'
            }}>
              {t("basket.recieptPrice")} {numberSpacing(newTotal)}{t("units.amd")}
            </span>
          </div> */}
          </div>
      </div>
    );
  };
  
  
  export default memo(ServiceTableInvoice);
  