import React, { memo } from "react";

const TermsConditionsLink = ({t}) => {

  return (
    <span style={{fontSize:"85%", color:"grey"}}>
      <span>{t("authorize.beforeRegister")}</span>
      <a href="https://storex.payx.am/Contract-for-Accept-StoreX-Arm.pdf" target="_blank">{t("authorize.beforeRegisterTerms")}</a>
    </span>
  )
};

export default memo(TermsConditionsLink);
