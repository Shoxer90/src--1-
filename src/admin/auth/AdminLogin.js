import { memo } from "react";
import { useTranslation } from "react-i18next";

import LoginForm from "./LoginForm";

import styles from "./index.module.scss";

const AdminLogin = () => {
  const {t} = useTranslation();

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginPage_content}>
        <h1>{t("authorize.login")}</h1>
        <LoginForm />
      </div>
    </div>
  )
};

export default memo(AdminLogin);