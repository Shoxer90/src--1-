import { Button, DialogContent } from "@mui/material";
import React, { memo, useRef } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";
import GetAppIcon from "@mui/icons-material/GetApp";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { getProductsRemainderExcel } from "../../../services/excel/excel";
import { saveAs } from "file-saver";

const UpdateRemainderExcelDialog = ({ onSelectFile }) => {
  const { t } = useTranslation();
  const ref = useRef();

  const fileReader = async () => {
    await getProductsRemainderExcel(1).then((resp) => {
      saveAs(new Blob([resp], { type: "application/octet-stream" }), "StoreXProductsRemainder.xlsx");
    });
  };

  return (
    <div className={styles.excelSection}>
      <DialogContent dividers className={styles.excelLoaderContent}>
        <div className={styles.excelLoaderContent_item}>
          <p>{t("mainnavigation.remainderUpdateText1")}</p>
          <Button
            variant="contained"
            sx={{ backgroundColor: "green", fontSize: "70%", textTransform: "capitalize" }}
            onClick={fileReader}
          >
            <GetAppIcon />
            {t("mainnavigation.downloadRemainderForm")}
          </Button>
        </div>
        <div onClick={() => ref.current.click()} className={styles.excelLoaderContent_item}>
          <p>{t("mainnavigation.remainderUpdateText2")}</p>
          <Button
            variant="contained"
            sx={{ backgroundColor: "green", fontSize: "60%", textTransform: "capitalize" }}
          >
            <label htmlFor="remainder-file-input" style={{ cursor: "pointer" }}>
              <FileUploadIcon />
              {t("mainnavigation.uploadRemainderForm")}
            </label>
            <input
              ref={ref}
              id="remainder-file-input"
              type="file"
              style={{ display: "none", cursor: "pointer" }}
              onChange={onSelectFile}
              accept=".xls,.xlsx"
            />
          </Button>
        </div>
      </DialogContent>
    </div>
  );
};

export default memo(UpdateRemainderExcelDialog);
