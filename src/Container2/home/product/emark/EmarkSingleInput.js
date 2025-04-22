import { Button, TextField } from "@mui/material";
import * as XLSX from "xlsx";
import { memo, useEffect, useRef, useState } from "react";
import useDebonce from "../../../hooks/useDebonce";

const EmarkSingleInput = () => {
  
  const {ref} = useRef();
  const [barcode, setBarcode] = useState("");
  const [barcodeARR, setBarcodeARR] = useState("");
  const debounceEmark = useDebonce(barcode, 20);
  const connectSerial = async () => {
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });

      const reader = port.readable.getReader();
      let decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        setBarcode((prev) => prev + decoder.decode(value));
      }
      reader.releaseLock();
    } catch (error) {
    }
  };

  const replaceGS = (code) => {
    const input = code ; 
    const output = input.replace(/\x1d/g, "\\u001d");  
    setBarcodeARR([
      output,
      ...barcodeARR
    ])
    setBarcode("")
  };

  const readExcel = (e) => {

        const promise = new Promise((resolve,reject) => {
            
        const fileReader = new FileReader();
          fileReader.readAsArrayBuffer(e.target.files[0]);
    
          fileReader.onload=(e) => {
            const bufferArray = e.target.result;
            const wb = XLSX.read(bufferArray,{type:"buffer"});
            const wsName = wb.SheetNames[0];
            const ws = wb.Sheets[wsName] ;
            const data = XLSX.utils.sheet_to_json(ws)
            resolve(data)
          };
          fileReader.onerror = (error) => {
            reject(error)
          }
        })
        
        promise.then((res) => {
        //  const arr = [];
        //  const barcodeList = []
        //  res.forEach(prod => {
        //   prod?.["Ներքին կոդ , Բարկոդ / Internal code , Barcode / Внутренний код , Штрих-код *"] && barcodeList.push(prod?.["Ներքին կոդ , Բարկոդ / Internal code , Barcode / Внутренний код , Штрих-код *"])
        //   return arr.push({
        //     "id": 0,
        //     "type": `${prod?.["ԱՏԳ ԱԱ կոդ կամ ԱԴԳՏ դասակարգիչ / LP FEA code or PCTA classifier / ПП ВЭД код или КПВД классификатор *"]}` || "",
        //     "dep":  prod?.["ԱԱՀ - ով չհարկվող / Excluding VAT / Без учета НДС"] ? 2 : 0,
        //     "name": prod?.["Ապրանքի անվանումը (50 նիշ) / Product Name (50 Symbols) / Название товара (50 символа) *"] || "",
        //     "brand": prod?.["Ապրանքանիշ / Brand / Бренд"] || "",
        //     "measure": prod?.["Չափման միավոր / Measure / Мера *"],
        //     "otherLangMeasure": "",
        //     "photo": "",
        //     "barCode":  prod?.["Ներքին կոդ , Բարկոդ / Internal code , Barcode / Внутренний код , Штрих-код *"] || "",
        //     "remainder": +prod?.["Ապրանքի քանակը / Product Count / Количество товара"] || 0,
        //     "purchasePrice": +(prod?.[" Ապրանքի ինքնարժեք / Purchase price / Закупочная цена "])?.toFixed(2) || +(prod?.["Ապրանքի ինքնարժեք / Purchase price / Закупочная цена"])?.toFixed(2) || 0,
        //     "price": +(prod?.[" Վաճառքի գին / Product price / Цена продукта * "])?.toFixed(2)|| +(prod?.["Վաճառքի գին / Product price / Цена продукта *"])?.toFixed(2)|| 0,
        //     "discountedPrice": 0,
        //     "discount": 0,
        //     "discountType": 0,
        //     "lastUpdate": new Date().toJSON(),
        //     "isFavorite": false,
        //     "comment":  "",
        //     "category": 0,
        //     "description":  "",
        //     "__rowNum__": prod?.__rowNum__,
        //     "keyWords": [{
        //       "id": 0,
        //       "keyWord": ""
        //     }],
        //   })
        // })
        // setUploadFile(arr)
       
      })

    // const reader = new FileReader();
    // reader.readAsArrayBuffer(file);
  
    // reader.onload = (e) => {
    //   const data = e.target.result;
    //   const workbook = XLSX.read(data, { type: "binary" });
  
    //   // Получаем первый лист
    //   const sheetName = workbook.SheetNames[0];
    //   const sheet = workbook.Sheets[sheetName];
  
    //   // Преобразуем лист в массив JSON-объектов
    //   const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
    // };
  }


  const downLoadExcelData = (event) => {
    const file = event.target.files[0];
    if (file) {
      readExcel(file);
    }
  }
  
  useEffect(() => {
    ref?.current.focus()
    debounceEmark && replaceGS(debounceEmark)
  }, [debounceEmark]);


  return (
    <>
    <Button variant="contained" size="large" onClick={connectSerial}>
      Connect for Emark
    </Button>

    <TextField 
      type="file" 
      onChange={(event)=>readExcel(event)}
    />

    <TextField 
      ref={ref}
      style={{marginBottom:"10px",width:"250px"}}
      size="small"
      variant="outlined"
      name="emark" 
      value={barcode}
      label="EMARK"
      placeholder="click for input qrs"
      onChange={(e)=>{
        setBarcode(e.target.value)
      }} 
    />
    </>
)
};

export default memo(EmarkSingleInput);
