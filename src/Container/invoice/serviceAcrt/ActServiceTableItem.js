import { memo, useEffect, useState } from 'react';
import ConfirmDialog from '../../../Container2/dialogs/ConfirmDialog';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'antd';
import { IconButton } from '@mui/material';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { getInvoiceTableDataByName } from '../../../services/invoice/customerData';

const cellStyle = {
  padding: '8px',
  fontSize: '13px'
};

const inputStyle = { 
  width: '100%',
  padding: '4px 8px',
  border: '1px solid #d9d9d9',
  borderRadius: '4px',
  fontSize: '13px'
};

const selectStyle = {
  width: '100%',
  padding: '4px 8px',
  border: '1px solid #d9d9d9',
  borderRadius: '4px',
  fontSize: '13px',
  backgroundColor: 'white'
};

const ActServiceTableItem = ({
  tableContent,
  deleteBasketItem,
  changeCountOfBasketItem,
  invoicePaymentInfo
}) => {
  const {t} = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const [activeProd, setActiveProd] = useState({
    id:"",
    isEmark: false,
    barCode:""
  });
  const [dealTypes, setDealTypes] = useState([]); 
  const [taxType, setTaxType] = useState([]); 

  const getSaleTypes = async() => {
    const data = await getInvoiceTableDataByName("DealType", !!invoicePaymentInfo?.invoiceInfo?.invoiceType);
    if(data?.length) {
      setDealTypes(data)
    }
  };

   const getTaxTypes = async() => {
    const data = await getInvoiceTableDataByName("VatRate", !!invoicePaymentInfo?.invoiceInfo?.invoiceType);
    if(data?.length) {
      setTaxType(data)
    }
  }

  const removeOneProduct = async() => {
    deleteBasketItem(activeProd.id, activeProd?.isEmark, activeProd?.barCode)
    setOpenDialog(false)
  };

  useEffect(() => {
    getSaleTypes()
    getTaxTypes()
  },[])


  return (
    <>
    <tbody>
     {tableContent.map((record, index) => (
        <tr key={record.key} style={{ 
          borderBottom: '1px solid #f0f0f0',
          transition: 'background-color 0.2s'
        }}>
          <td style={cellStyle}>{index + 1}</td>
          {/* Name */}
          <td style={cellStyle}>
            <input
              type="text"
              value={`${record.name} ${record?.brand}`}
              // value={record.name}
              style={inputStyle}
              readOnly
            />
          </td>

          {/* Type */}
          <td style={cellStyle}>
            <input
              type="text"
              value={record.measure}
              style={inputStyle}
              readOnly
            />
          </td>

          {/* Quantity */}
          <td style={cellStyle}>
            <input
              type="number"
              value={record.count}
              onChange={(e) =>changeCountOfBasketItem(record.id, e.target.value)}
              style={inputStyle}
            />
          </td>

          {/* Price */}
          <td style={cellStyle}>
            <input
              type="number"
              value={record?.price}
              // value={record?.dep===1 ? record.price - Math.round(record?.price * 0.1667): record.price }
              // value={record?.dep===1 ? record.discountedPrice - Math.round(record?.discountedPrice * 0.1667): record.discountedPrice }
              style={inputStyle}
              readOnly
            /> 
          </td>

          {/* Discount */}
          <td style={cellStyle}>
            <input
              type="number"
              value={record.discount}
              min="0"
              max="100"
              style={inputStyle}
              readOnly
            />
          </td>

         
          <td style={cellStyle}>
            <input
              value={
              //   record.dep===1 ?
              //  (record.discountedPrice*record.count - record.count * (record.discountedPrice * 0.1667)).toFixed(2):
                  record.discountedPrice*record.count
              }
              style={inputStyle}
              readOnly
            />
          </td>
         
          <td style={cellStyle}>
            {!(record?.dep === 1) ?<select
                value={record?.dep===1 ? " " : 1}
                style={selectStyle}
                disabled={true}
              >
                {dealTypes && dealTypes.map((type) => <option value={type?.id} selected={1}>{type?.title}</option>  )}
              </select>:  <input
                value=" "
                style={{...inputStyle}}
                readOnly
              />}
            </td>
    

          {/* Actions */}
          <td style={{...cellStyle, textAlign: 'center'}}>
             <Tooltip title={t("buttons.remove")}>
              <IconButton 
                onClick={() =>   {
                  setOpenDialog(true)
                  setActiveProd({id:record.id, isEmark: record.isEmark, barCode: record.barCode})
                }}
                sx={{ color: '#ff4d4f' }}
              >
                <DeleteTwoToneIcon />
              </IconButton>
            </Tooltip>
          </td>
        </tr>
      ))}
    </tbody>
      <ConfirmDialog
        question={t("basket.removeoneprod")}
        func={removeOneProduct}
        title={t("settings.remove")}
        open={openDialog}
        close={setOpenDialog}
        content={" "}
        t={t}
      />
    </>
  )
}

export default memo(ActServiceTableItem);
