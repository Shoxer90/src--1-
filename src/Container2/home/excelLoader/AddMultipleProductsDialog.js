import { Button, DialogActions, DialogContent } from '@mui/material';
import React from 'react'
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from "./index.module.scss";
import GetAppIcon from '@mui/icons-material/GetApp';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { getExcelEmptyForm} from '../../../services/excel/excel';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';
import MeasureCorrect from './MeasureCorrect';


const AddMultipleProductsDialog = ({readExcel, uploadFile, createMultipleProds}) => {
  const {t} = useTranslation();
  const navigate = useNavigate();

// download excel
  const fileReader = async() => {
    await getExcelEmptyForm().then((resp) => {
      saveAs(new Blob([resp], {type: 'application/octet-stream'}), `StoreXEmptyForm.xlsx`)
    })
  };

  return (
    <div>
      <h5>{t("mainnavigation.multipleproduct")}</h5>
     {!uploadFile &&
        <DialogContent dividers className={styles.excelLoaderContent}>
          <div className={styles.excelLoaderContent_item}>
            <p>{t("mainnavigation.multipleProductText1")}</p>
            <Button variant="contained" sx={{backgroundColor:"green",fontSize:"70%"}} onClick={fileReader} >
              <GetAppIcon />
              {t("mainnavigation.downloadform")}
            </Button>
          </div>
          <div className={styles.excelLoaderContent_item}>
            <p>{t("mainnavigation.multipleProductText2")}</p>
            <MeasureCorrect t={t}/>
            <Button
              variant="contained" 
              sx={{backgroundColor:"green",fontSize:"60%"}} 
            >
              <label htmlFor="file-input">
                <FileUploadIcon />
                {t("mainnavigation.uploadform")}
              </label>
              <input 
                id="file-input" 
                type="file" 
                style={{display:"none"}} 
                onChange={(e)=>readExcel(e)}
                accept=".xls,.xlsx"
              />
            </Button>
          </div>
        </DialogContent>
      }
      <DialogActions>
        {uploadFile && 
          <Button variant="contained" style={{margin:"2px 20px",background:"green"}} onClick={createMultipleProds}>
            {t("buttons.createMultiProds")}
          </Button>
        }
        <Button autoFocus style={{margin:"2px 20px"}} onClick={()=>navigate("/")}>
          {t("buttons.cancel")}
        </Button>
      </DialogActions>
    </div>
  )
}

export default memo(AddMultipleProductsDialog);
