import React, { memo, useEffect, useState } from 'react';

import * as XLSX from "xlsx";
import ExcelRow from './ExcelRow';
import styles from "./index.module.scss";
import { Dialog, Divider } from '@mui/material';
import AddMultipleProductsDialog from './AddMultipleProductsDialog';
import { createProductList, getAllAdgCode } from '../../../services/products/productsRequests';
import Loader from '../../loading/Loader';
import SnackErr from '../../dialogs/SnackErr';
import { useNavigate } from 'react-router-dom';
import { t } from 'i18next';

const PasteExcelToReact = ({logOutFunc, setCurrentPage}) => {
  const navigate = useNavigate();
  const [uploadFile,setUploadFile] = useState();
  const [isLoad,setIsLoad] = useState();
  const [message,setMessage] = useState({m:"",t:""});
  const [rowStatus,setRowStatus] = useState({});
  const [barCodes,setBarCodes] = useState([]);
  const [allAdgs, setAllAdgs] = useState([]);
  
  const readExcel = (e) => {
    // console.log(e,"e")
   setIsLoad(true)
    const promise = new Promise((resolve,reject) => {
        
    const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(e.target.files[0]);

      fileReader.onload=(e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray,{type:"buffer"});
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName] ;
        const data = XLSX.utils.sheet_to_json(ws)
        // console.log(data,"data")
        resolve(data)
      };
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
    
    promise.then((res) => {
     const arr = [];
     const barcodeList = []
     res.forEach(prod => {
      prod?.["Ներքին կոդ , Բարկոդ / Internal code , Barcode / Внутренний код , Штрих-код *"] && barcodeList.push(prod?.["Ներքին կոդ , Բարկոդ / Internal code , Barcode / Внутренний код , Штрих-код *"])
      return arr.push({
        "id": 0,
        "type": `${prod?.["ԱՏԳ ԱԱ կոդ կամ ԱԴԳՏ դասակարգիչ / LP FEA code or PCTA classifier / ПП ВЭД код или КПВД классификатор *"]}` || "",
        "dep":  prod?.["ԱԱՀ - ով չհարկվող / Excluding VAT / Без учета НДС"] ? 2 : 0,
        "name": prod?.["Ապրանքի անվանումը (50 նիշ) / Product Name (50 Symbols) / Название товара (50 символа) *"] || "",
        "brand": prod?.["Ապրանքանիշ / Brand / Бренд"] || "",
        "measure": prod?.["Չափման միավոր / Measure / Мера *"],
        "otherLangMeasure": "",
        "photo": "",
        "barCode":  prod?.["Ներքին կոդ , Բարկոդ / Internal code , Barcode / Внутренний код , Штрих-код *"] || "",
        "remainder": +prod?.["Ապրանքի քանակը / Product Count / Количество товара"] || 0,
        "purchasePrice": +(prod?.[" Ապրանքի ինքնարժեք / Purchase price / Закупочная цена "])?.toFixed(2) || +(prod?.["Ապրանքի ինքնարժեք / Purchase price / Закупочная цена"])?.toFixed(2) || 0,
        "price": +(prod?.[" Վաճառքի գին / Product price / Цена продукта * "])?.toFixed(2)|| +(prod?.["Վաճառքի գին / Product price / Цена продукта *"])?.toFixed(2)|| 0,
        "discountedPrice": 0,
        "discount": 0,
        "discountType": 0,
        "lastUpdate": new Date().toJSON(),
        "isFavorite": false,
        "comment":  "",
        "category": 0,
        "description":  "",
        "__rowNum__": prod?.__rowNum__,
        "keyWords": [{
          "id": 0,
          "keyWord": ""
        }],
      })
    })
    setUploadFile(arr)
   
    setIsLoad(false)
  })
  };

  const checkRowStatus = async(obj, row) => {
    const rowObjToArr = Array.from(Object.values(obj))
    if(rowObjToArr.includes(false)) {
      setRowStatus({
        ...rowStatus,
        [row]:false,
      })
    }else{
      setRowStatus({
        ...rowStatus,
        [row]:true,
      })
    }
  };


  const confirmExcelList = async(res) => {
    createProductList(res).then((res)=> {
      setIsLoad(false)
      if(res === 200){
        setMessage({m: t("dialogs.done"),t: "success"})
      }else if(res === 401){
        logOutFunc()
      }else{
        setMessage({m: t("dialogs.wrong"),t: "error"})
        return
      }
      setMessage({m: t("dialogs.done"),t: "success"})
    })
  };

  const createMultipleProds = async() => {
    setIsLoad(true)
    let statusArray = Array.from(Object.values(rowStatus));
    if(statusArray.includes(false)) {
      setIsLoad(false)
      setMessage({m: t("cardService.wrongCeil"),t: "error"})
    }else{
      confirmExcelList(uploadFile)
    }
  };

  const closeWindowAndReload = () => {
    setMessage({m:"",t:""})
    navigate("/")
    window.location.reload(false);
  };

  useEffect(() => {
    !allAdgs.length && getAllAdgCode().then((res) => {
      setAllAdgs(res)
    })
  }, []);

  return (
    <div style={{marginTop:"100px"}}>
      <Dialog open={!!isLoad}>
        <Loader close={()=>setIsLoad(false)}/>
      </Dialog>
      {message &&
        <Dialog open={Boolean(message?.m)}>
          <SnackErr message={message?.m} close={message?.t==="success" ? closeWindowAndReload: setMessage} type={message?.t} />
        </Dialog>
      }
      <AddMultipleProductsDialog 
        uploadFile={uploadFile}
        setUploadFile={setUploadFile}
        readExcel={readExcel}
        createMultipleProds={createMultipleProds}
        setCurrentPage={setCurrentPage}
      />
      <Divider sx={{bc:"green",w:2}}/>
      <form autoComplete="off">

      {
        uploadFile &&
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col"> N </th>
              <th scope="col">
                <div>{`${t("productinputs.code")} *`}</div>
                <a style={{fontSize:"65%",padding:"1px"}} 
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.petekamutner.am/Content.aspx?itn=tsOSNewCCM#:~:text=%D5%80%D5%80%20%D5%AF%D5%A1%D5%BC%D5%A1%D5%BE%D5%A1%D6%80%D5%B8%D6%82%D5%A9%D5%B5%D5%A1%D5%B6%2011.11.2014%D5%A9,%D5%AF%D5%B8%D5%A4%D5%A5%D6%80%D5%AB%20%D5%A1%D5%B6%D5%BE%D5%A1%D5%B6%D5%B4%D5%A1%D5%B6%20%D6%81%D5%A1%D5%B6%D5%AF" >
                  {t("productinputs.typeurl1")}
                </a>
                </th>
              <th scope="col">{`${t("productinputs.name")} max 50 ${t("productinputs.symb")}*`}</th>
              <th scope="col">{t("productinputs.brand")}</th>
              <th scope="col">{t("productinputs.count")}</th>
              <th scope="col">{`${t("productinputs.measure")} *`}</th>
              <th scope="col">{t("productinputs.purchase")}</th>
              <th scope="col">{`${t("productinputs.price")} (${t("units.min")} 1 ${t("units.amd")})*`}</th>
              <th scope="col">{`${t("productinputs.barcode")} *`}</th>
              <th scope="col">{t("productinputs.ndsNone")}</th>
            </tr>
          </thead>
          {uploadFile.map((prod,index) => {
            return <tbody autoComplete="off">
              <ExcelRow
                prod={prod} 
                key={index+1} 
                inputValue={uploadFile}
                setInputValue={setUploadFile}
                checkRowStatus={checkRowStatus}
                row={index+1}
                t={t}
                setBarCodes={setBarCodes}
                barCodes={barCodes}
                allAdgs={allAdgs}
              />
            </tbody>
          })}
        </table>
      }
      </form>
    </div>
  );
}

export default memo(PasteExcelToReact);
