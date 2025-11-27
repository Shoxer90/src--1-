import { memo } from 'react';
import ProductTableItem from './ProductTableItem';
import { useTranslation } from 'react-i18next';
import { numberSpacing } from '../../../modules/numberSpacing';
import { IconButton, Tooltip } from '@mui/material';
import AddShoppingCartTwoToneIcon from '@mui/icons-material/AddShoppingCartTwoTone';
import { useNavigate } from 'react-router-dom';

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
                
const ProductTableInvoice = ({basketContent, totalPrice, deleteBasketItem , setOpenBasket, closeInvoiceDialog, changeCountOfBasketItem}) => {
  const {t} = useTranslation();
  const navigate = useNavigate();

  const columnNames = [{
    title:t("history.number"),
    key:"1",
    width: "30px",
  },
  {
    title: t("productinputs.typeurl1"),
    key:"2",
    width: "120px",
  },
  {
    title: t("productinputs.name"),
    key:"3",
    width: "180px",
  },
  {
    title: t("productinputs.measure"),
    key:"4",
    width: "80px",
  },{
    title: t("productinputs.count"),
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
    title: t("history.transactionType"),
    key:"8",
    width: "150px",
  },{
    title:t("basket.totalndiscount2"),
    key:"9",
    width: "100px",
  // },{
  //   title:"Տարա*",
  //   key:"10",
  //   width: "80px",
  // },{
  //   title:"Այդ թվում ակց. հարկի գումար",
  //   key:"11",
  //   width: "120px",
  },{
    title:t("productinputs.code"),
    // title:"Ներքին կոդ/բառկոդ",
    key:"12",
    width: "120px",
  },{
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
  }]

  return (
    <div style={{ 
      marginTop: '30px', 
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      {/* <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '24px',
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h2 style={{ 
            margin: 0, 
            marginBottom: '8px',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Ապրանքառից (առաքիր) ապրանքների քանակի և կենտրական եռակա գումարի հաշվառք
          </h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            Առկա է հետագծելիության եռակա արդյունք
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{
            padding: '8px 12px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            ↑
          </button>
          <button style={{
            padding: '8px 12px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            ✎
          </button>
        </div>
      </div> */}

      {/* Table */}
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
            <ProductTableItem 
              basketContent={basketContent} 
              deleteBasketItem={deleteBasketItem}
              changeCountOfBasketItem={changeCountOfBasketItem}
            />
          </table>
        </div>
        <div style={{display:'flex', justifyContent:"end", margin:"5px 10px",}}>
          <Tooltip title={t("mainnavigation.newproduct")}>
            <IconButton sx={{color:"green"}} onClick={()=> {
              closeInvoiceDialog()
              setOpenBasket(false)
              navigate("/")
            }}>
              <AddShoppingCartTwoToneIcon />
            </IconButton>
          </Tooltip>
        </div>

        {/* Info Message */}
        {/* <div style={{ 
          marginTop: '16px',
          padding: '5px 12px',
          backgroundColor: '#e6f7ff',
          border: '1px solid #91d5ff',
          borderRadius: '4px',
          fontSize: '11px',
          color: '#0050b3',
          opacity: '0.8'
        }}>
          * Տարա սյունակը լրացնում է այն դեպքում, երբ տարան չի ծառայում:
        </div> */}

        {/* Summary */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          marginTop: '16px' 
        }}>
          <span style={{
            padding: '8px 24px',
            fontSize: '16px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            cursor: 'default'
          }}>
            {t("basket.recieptPrice")} {numberSpacing(totalPrice)}{t("units.amd")}
          </span>
        </div>
        </div>
    </div>
  );
};


export default memo(ProductTableInvoice);