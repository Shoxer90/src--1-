import { Button } from "@mui/material";
import { useState } from "react";

export const  EMARK = () => {
    const [barcode, setBarcode] = useState("");

  const connectSerial = async () => {
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });

      const reader = port.readable.getReader();
      let decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;
        setBarcode((prev) => prev + decoder.decode(value));
      }

      reader.releaseLock();
    } catch (error) {
      console.error("Serial connection error:", error);
    }
  };

  return (
    <Button variant="contained" size="large" onClick={connectSerial} sx={{m:5}}>
        Connect scan
    </Button>
  )
    
}
