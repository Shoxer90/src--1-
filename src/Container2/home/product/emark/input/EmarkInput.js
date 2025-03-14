import { Button, TextField } from "@mui/material";
import { memo, useEffect, useRef, useState } from "react";
import useDebonce from "../../../../hooks/useDebonce";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";
import FileUploadIcon from '@mui/icons-material/FileUpload';


const EmarkInput = () => {
  const {t} = useTranslation();
  const ref = useRef();
	const [barcode, setBarcode] = useState("");
  const [barcodeARR, setBarcodeARR] = useState([
    // "skizb",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg",
		// "0104850008980752211a_Lxm:2Em2i?\u001d93nlwg","verj"	
  ]);
  // const [barcodeARR, setBarcodeARR] = useState("");
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
        console.log("stic mtav stex")
        // setBarcode((prev) => prev + decoder.decode(value));
        // console.log( String.fromCharCode(...value),"BARCODE")
      }
      reader.releaseLock();
    } catch (error) {
    }
  };

  const replaceGS = (code) => {
    // const input = code ; 
    // const output = input.replace(/\x1d/g, "\\u001d");  
    setBarcodeARR([
      code,
      ...barcodeARR,
      // output,
    ])
    setBarcode("")
  };

	const readExcel = (e) => {
    console.log(e,"e")

      const promise = new Promise((resolve,reject) => {
          
      const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(e.target.files[0]);
  
        fileReader.onload=(e) => {
          const bufferArray = e.target.result;
          const wb = XLSX.read(bufferArray,{type:"buffer"});
          const wsName = wb.SheetNames[0];
          const ws = wb.Sheets[wsName] ;
          const data = XLSX.utils.sheet_to_json(ws)
          console.log(data,"data")
          resolve(data)
        };
        fileReader.onerror = (error) => {
          reject(error)
        }
      })
      
      promise.then((res) => {
      console.log(res,"EXCEL RES")
      
    })
  }

	useEffect(() => {
		debounceEmark && replaceGS(debounceEmark)
	}, [debounceEmark]);

	// useEffect(() => {
	// 	localStorage.setItem("emarkList", JSON.stringify(barcodeARR))
	// }, [barcodeARR]);
	// useEffect(() => {
	// 	setBarcodeARR(localStorage.getItem("emarkList"))
	// 	localStorage.setItem("emarkList", JSON.stringify(barcodeARR))
	// }, []);

	console.log(barcodeARR, "ARr barcode");

	return(
		<>
		<div style={{display:"flex", flexFlow:"row", padding:"10px"}}>
			<div style={{display:"flex", flexFlow:"column", padding:"10px",gap:"15px"}}>
				<Button variant="contained" size="large" onClick={connectSerial} >
					Connect Scanner 
				</Button>
				<TextField 
					style={{marginBottom:"10px",width:"250px"}}
					size="small"
					variant="outlined"
					name="emark" 
					value={barcode}
					// label="EMARK"
					placeholder="click here for starting scan"
					onChange={(e)=>{
						setBarcode(e.target.value)
					}} 
				/>

				OR
        <Button
          variant="contained" 
          sx={{backgroundColor:"green",fontSize:"60%",textTransform: "capitalize"}}
          onClick={()=>ref?.current.click()}
        >
          <label htmlFor="file-input" style={{cursor:"pointer"}}>
            <FileUploadIcon />
            {t("emark.popBtn2")}
          </label>
          <input 
            ref={ref}
            type="file" 
            style={{display:"none",cursor: "pointer"}}
            onChange={(e)=>readExcel(e)}
            accept=".xls,.xlsx"
          />
        </Button>
				

			</div>
			<div>
					<div style={{display:"flex",flexFlow:"row",justifyContent:"space-around", fontSize:"90%"}}>
						<div>
							{barcodeARR && barcodeARR.map((item,index) => {
								if(index<=24){
									return <div key={index} style={{marginLeft:"15px"}}>
										<span style={{color:"grey",fontWeight:700}}>{barcodeARR?.length-index}.</span>
									 {item}
									</div>
								}
							})}
						</div>
						<div >
							{barcodeARR && barcodeARR.map((item,index) => {
								if(index > 24 && index <= 49){
									return <div key={index} style={{marginLeft:"15px"}}>
									<span style={{color:"grey",fontWeight:700}}>{barcodeARR?.length-index}.</span>
								 {item}
								</div>
								}
							})}
						</div>
						<div>
							{barcodeARR && barcodeARR.map((item,index) => {
								if(index > 49){
									return <div key={index} style={{marginLeft:"15px"}}>
									<span style={{color:"grey",fontWeight:700}}>{barcodeARR?.length-index}.</span>
								 {item}
								</div>
								}
							})}
						</div>
					</div>
			
			</div>
		</div>
			<Button 
      style={{
        position:"fixed", 
        bottom:0,
        width:"100dvw",  
        display:"flex",
        justifyContent: "center"
      }}
      variant="contained" sx={{m:2 }}>
				Save E-mark list
			</Button>
		</>
	)
};

export default memo(EmarkInput);
