import React, { useEffect, useState } from "react";

const PaymentRedirector = () => {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const paymentUrl = "https://storextest.payx.am/basket?saleId=6cb06e985b7809d19732eef1bb103096443d9742";

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const inApp = /instagram|fbav|telegram/.test(ua);
    setIsInAppBrowser(inApp);
  }, []);

  const handleOpen = () => {
    window.open(paymentUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Переход на оплату</h2>

      {!isInAppBrowser ? (
        <>
          <p>
            Вы открыли сайт через встроенный браузер (Instagram или Telegram). Возможно, ссылка оплаты не откроется.
          </p>
          <p>
            Пожалуйста, нажмите на <strong>три точки</strong> вверху и выберите <strong>«Открыть в браузере»</strong>.
          </p>
          <button
            onClick={handleOpen}
            style={{
              marginTop: 20,
              padding: "10px 20px",
              fontSize: "16px",
              borderRadius: "8px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
            }}
          >
            Открыть ссылку вручную
          </button>
        </>
      ) : (
        <>
          <p>Вы будете перенаправлены на страницу оплаты.</p>
          <button
            onClick={handleOpen}
            style={{
              marginTop: 20,
              padding: "10px 20px",
              fontSize: "16px",
              borderRadius: "8px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
            }}
          >
            Перейти к оплате
          </button>
        </>
      )}
    </div>
  );
};

export default PaymentRedirector;
