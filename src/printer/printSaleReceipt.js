import { printReceipt } from './printReceipt';
import { mapSaleResponseToOrder } from './mapSaleResponseToOrder';

/**
 * Печатает чек по ответу API после успешной продажи (режим ehdmMode === 2).
 */
export async function printSaleReceipt(result, shopName) {
  const order = mapSaleResponseToOrder(result, shopName);
  if (!order) {
    return { success: false, skipped: true };
  }

  return printReceipt(order);
}
