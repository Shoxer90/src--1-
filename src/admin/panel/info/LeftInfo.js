import { memo } from "react";

import { useTranslation } from "react-i18next";

import styles from "./index.module.scss";

const LeftInfo = ({customerInfo}) => {
  const {t} = useTranslation();
  return (
    <div className={styles.info_left}>
        <div className={styles.info_left_logo}>
          <img 
            // src={`/${customerInfo?.store?.logo}`}
            src="/storeXLogo.jpg"
            alt="customerLogo"
          />
          <div className={styles.info_left_logo_id}>ID {customerInfo?.store?.id}</div>
        </div>
        <h4>{customerInfo?.store?.legalName}</h4>
        <h5>{customerInfo?.director?.firstName} {customerInfo?.director?.lastName}</h5>
        <div>{t("authorize.tin")} <span style={{fontWeight: 700}}>{ customerInfo?.store?.tin || ""}</span> </div>
        <div>{t("authorize.phone")} <span style={{fontWeight: 700}}>{ customerInfo?.director?.phoneNumber?.length<8? `+374${customerInfo?.director?.phoneNumber}`  : customerInfo?.director?.phoneNumber}</span> </div>
        <div>{t("authorize.email")} <span style={{fontWeight: 700}}>{customerInfo?.director?.email}</span></div>
        <div>{t("authorize.taxType")}{" "}
        <span style={{fontWeight: 700}}>
          {customerInfo?.store?.taxRegime === 1 && t("productinputs.nds")}
          {customerInfo?.store?.taxRegime === 2 && t("productinputs.ndsNone")} 
          {customerInfo?.store?.taxRegime === 3 && t("productinputs.tax3")}
          {customerInfo?.store?.taxRegime === 7 && t("productinputs.tax7")}
        </span>
        </div>
    </div>
  )
};
 
export default memo(LeftInfo);
