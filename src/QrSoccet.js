import { useEffect, useState } from "react";
import { SignalRProvider, useSignalR } from "react-signalr";

export const QrSoccet = () => {
  const [qrCode, setQrCode] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("Waiting for QR scan...");

  const { connection } = useSignalR({
    url: "https://your-backend-url/paymentHub", // Replace with your backend SignalR hub URL
    options: {
      accessTokenFactory: () => "your-auth-token", // Optional, add if your hub requires authentication
    },
  });

  // Listen for payment updates
  useEffect(() => {
    if (connection) {
      connection.on("ReceivePaymentUpdate", (status) => {
        setPaymentStatus(status);
      });

      return () => {
        connection.off("ReceivePaymentUpdate");
      };
    }
  }, [connection]);

  const handleQrCodeScan = (code) => {
    setQrCode(code);
    setPaymentStatus("QR Code scanned. Waiting for payment confirmation...");
    connection?.send("NotifyPaymentUpdate", code)
      .catch((error) => console.error("Error notifying payment update:", error));
  };

return (
  <div>
    <h1>Payment Signaler</h1>
    <p>Status: {paymentStatus}</p>
    {!qrCode ? (
      <button onClick={() => handleQrCodeScan("SampleQRCode123")}>
        Simulate QR Scan
      </button>
    ) : (
      <p>QR Code: {qrCode}</p>
    )}
  </div>
);
};
