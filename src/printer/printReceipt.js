const PRINTER_SERVICE_URL =
  process.env.REACT_APP_PRINTER_URL || 'http://127.0.0.1:3001';

export async function printReceipt(order) {
  try {
    const response = await fetch(`${PRINTER_SERVICE_URL}/print-receipt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ошибка печати чека');
    }

    return { success: true };
  } catch (err) {
    console.error('Не удалось распечатать чек:', err.message);
    return { success: false, error: err.message };
  }
}
