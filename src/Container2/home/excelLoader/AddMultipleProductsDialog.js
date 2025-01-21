import { Button, DialogActions, DialogContent } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from "./index.module.scss";
import GetAppIcon from '@mui/icons-material/GetApp';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { getExcelEmptyForm} from '../../../services/excel/excel';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';
import MeasureCorrect from './MeasureCorrect';
import VatCorrect from './VatCorrect';
import ConfirmDialog from '../../dialogs/ConfirmDialog';
import BarCodeCorrect from './BarCodeCorrect';


const AddMultipleProductsDialog = ({
  readExcel, 
  uploadFile, 
  createMultipleProds,
  setCurrentPage
}) => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const ref = useRef();
  const [openConfirm, setOpenConfirm] = useState(0);

// download excel
  const fileReader = async() => {
    await getExcelEmptyForm().then((resp) => {
      saveAs(new Blob([resp], {type: 'application/octet-stream'}), `StoreXEmptyForm.xlsx`)
    })
  };

  const handleSubmit = () => {
    createMultipleProds()
    setOpenConfirm(0)
  };

  return (
    <div>
      <h5>{t("mainnavigation.multipleproduct")}</h5>
      {!uploadFile &&
        <DialogContent dividers className={styles.excelLoaderContent}>
          <div className={styles.excelLoaderContent_item}>
            <p>{t("mainnavigation.multipleProductText1")}</p>
            <MeasureCorrect t={t}/>
            <BarCodeCorrect t={t}/>
            <VatCorrect t={t} />
            <Button variant="contained" sx={{backgroundColor:"green",fontSize:"70%",textTransform: "capitalize"}} onClick={fileReader} >
              <GetAppIcon />
              {t("mainnavigation.downloadform")}
            </Button>
          </div>
          <div onClick={() => ref.current.click()} className={styles.excelLoaderContent_item}>
            <p>{t("mainnavigation.multipleProductText2")}</p>
            <Button
              variant="contained" 
              sx={{backgroundColor:"green",fontSize:"60%",textTransform: "capitalize"}}
            >
              <label htmlFor="file-input" style={{cursor:"pointer"}}>
                <FileUploadIcon />
                {t("mainnavigation.uploadform")}
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
        </DialogContent>
      }
      <DialogActions>
        {uploadFile && 
          <Button 
            variant="contained" 
            style={{margin:"2px 20px",background:"green",textTransform: "capitalize"}} 
            onClickCapture={()=> setOpenConfirm(1)}
          >
            {t("buttons.createMultiProds")}
          </Button>
        }
        <Button 
          variant="contained"
          style={{margin:"2px 20px",textTransform: "capitalize"}} 
          onClickCapture={()=> setOpenConfirm(2)}
        >
          {t("buttons.cancel")}
        </Button>
      </DialogActions>

      <ConfirmDialog 
        question={openConfirm===1?t("dialogs.excelAddProds"): t("dialogs.excelCancelList")}
        func={openConfirm===1? handleSubmit : ()=> {
          setCurrentPage(1)
          navigate("/")}
        }
        title={openConfirm===1?t("buttons.submit"): t("buttons.cancel")}
        open={Boolean(openConfirm)}
        close={setOpenConfirm}
        t={t}
      />
    </div>
  )
};

export default memo(AddMultipleProductsDialog);
