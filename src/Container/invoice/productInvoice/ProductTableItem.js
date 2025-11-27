import { memo, useState } from 'react';
import ConfirmDialog from '../../../Container2/dialogs/ConfirmDialog';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'antd';
import { IconButton } from '@mui/material';

import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

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

const ProductTableItem = ({basketContent, deleteBasketItem, changeCountOfBasketItem}) => {
  const {t} = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const [activeProd, setActiveProd] = useState({
    id:"",
    isEmark: false,
    barCode:""
  });
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      code: '5402 Թելեր՝ հա.',
      name: 'fanta',
      type: 'հատ',
      quantity: 3,
      price: 10,
      discount: 0,
      supplier: 'Հարևան հա.',
      tax: 30,
      minStock: '',
      barcode: '',
      productCode: '',
    }, {
      key: '2',
      code: '',
      name: '',
      type: '',
      quantity: '',
      price: '',
      discount: 0,
      supplier: '',
      tax: 30,
      minStock: '',
      barcode: '',
      productCode: '',
    },
  ]);

  const handleInputChange = (key, field, value) => {
    const newData = dataSource.map(item =>
      item.key === key ? { ...item, [field]: value } : item
    );
    setDataSource(newData);
  };

  const removeOneProduct = async() => {
    deleteBasketItem(activeProd.id, activeProd?.isEmark, activeProd?.barCode)
    setOpenDialog(false)
  };
  
  return (
    <tbody>
     {basketContent.map((record, index) => (
        <tr key={record.key} style={{ 
          borderBottom: '1px solid #f0f0f0',
          transition: 'background-color 0.2s'
        }}>
          <td style={cellStyle}>{index + 1}</td>
          
          {/* Code Column */}
          {/* <td style={cellStyle}>
            {record.code ? (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 8px',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                fontSize: '12px',
                maxWidth: '100%'
              }}>
                {record.type}
                <button
                  onClick={() => handleClearCode(record.key)}
                  style={{
                    marginLeft: '8px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#999'
                  }}
                >
                  ×
                </button>
              </span>
            ) : (
              <select
                value={record.code}
                onChange={(e) => handleInputChange(record.key, 'code', e.target.value)}
                style={selectStyle}
              >
                <option value="">Ընտրել</option>
                <option value="5402 Թելեր՝ հա.">5402 Թելեր՝ հա.</option>
                <option value="5403 Թելեր՝ կգ.">5403 Թելեր՝ կգ.</option>
              </select>
            )}
          </td> */}
          <td style={cellStyle}>
            <input
              type="text"
              value={record.type}
              style={inputStyle}
              readOnly
            />
          </td>

          {/* Name */}
          <td style={cellStyle}>
            <input
              type="text"
              value={record.name}
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
              style={{...inputStyle, width: '80px'}}
            />
          </td>

          {/* Price */}
          <td style={cellStyle}>
            <input
              type="number"
              value={record.price}
              style={{...inputStyle, width: '80px'}}
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
              style={{...inputStyle, width: '70px'}}
              readOnly
            />
          </td>

          <td style={cellStyle}>
            <select
              value={record.dep}
              style={selectStyle}
              disabled
            >
              <option value={1}>{t("productinputs.nds")}</option>
              <option value={2}>{t("productinputs.ndsNone")}</option>
              <option value={3}>{t("productinputs.tax3")}</option>
              <option value={7}>{t("productinputs.tax7")}</option>
            </select>
          </td>
          <td style={cellStyle}>
            <input
              type="number"
              value={record.discountedPrice*record.count}
              style={{...inputStyle, width: '70px'}}
              readOnly
            />
          </td>

          {/* Min Stock */}
          {/* <td style={cellStyle}>
            <input
              type="text"
              value={record.minStock}
              onChange={(e) => handleInputChange(record.key, 'minStock', e.target.value)}
              style={{...inputStyle, width: '80px'}}
            />
          </td> */}

          {/* Barcode */}
          {/* <td style={cellStyle}>
            <input
              type="text"
              value={record.barcode}
              onChange={(e) => handleInputChange(record.key, 'barcode', e.target.value)}
              style={inputStyle}
              readOnly
            />
          </td> */}

          {/* Product Code */}
          <td style={cellStyle}>
            <input
              type="text"
              value={record.barCode}
              style={inputStyle}
              readOnly
            />
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
      <ConfirmDialog
        question={t("basket.removeoneprod")}
        func={removeOneProduct}
        title={t("settings.remove")}
        open={openDialog}
        close={setOpenDialog}
        content={" "}
        t={t}
      />
    </tbody>
  )
}

export default memo(ProductTableItem);
