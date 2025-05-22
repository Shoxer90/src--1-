import { useTranslation } from "react-i18next";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const PaymentRedirector = () => {
  const {t} = useTranslation()

  const handleOpen = () => {
    // window.open(paymentUrl, "_blank", "noopener,noreferrer");
    const a = document.createElement("a");
    a.href = window.location.href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  };

  return (
    <div style={{ padding: 20, marginTop:"60px"}}>
      <h2>{t("basket.openInMobile1")}</h2>
        <>
          <p>
            {t("basket.openInMobile2")}
          </p>
          <p>
            {t("basket.openInMobile3")} <strong>{t("basket.openInMobile4")} "<MoreHorizIcon />" </strong>{t("basket.openInMobile5")}<strong>{t("basket.openInMobile6")}</strong>.
          </p>
        </>
    </div>
  );
};

export default PaymentRedirector;
