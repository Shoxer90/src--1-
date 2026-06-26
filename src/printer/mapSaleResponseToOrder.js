function buildPaymentMethod(info) {
  const parts = [];

  if (info?.cashAmount > 0) {
    parts.push(`Առձեռն ${info.cashAmount.toFixed(2)}`);
  }
  if (info?.cardAmount > 0) {
    parts.push(`Անկանխիկ ${info.cardAmount.toFixed(2)}`);
  }
  if (info?.prePayment > 0) {
    parts.push(`Կանխավճար ${info.prePayment.toFixed(2)}`);
  }

  return parts.length ? parts.join(', ') : undefined;
}

/**
 * Преобразует ответ API продажи в формат для термопринтера AXIOM.
 */
export function mapSaleResponseToOrder(result, shopName) {
  const info = result?.res?.printResponseInfo;
  const fiscal = result?.res?.printResponse;

  if (!info || typeof info.totalAmount !== 'number') {
    return null;
  }

  const base = {
    shopName: shopName || fiscal?.commercial_name || fiscal?.taxpayer || 'ՄԱԳԱԶԻՆ',
    address: fiscal?.commercial_address || fiscal?.address,
    tin: fiscal?.tin,
    sn: fiscal?.sn,
    crn: fiscal?.crn,
    fiscal: fiscal?.fiscal,
    qr: fiscal?.qr,
    paymentMethod: buildPaymentMethod(info),
  };

  if (info.receiptType === 3) {
    return {
      ...base,
      items: [{ name: 'Կանխավճար', qty: 1, price: info.totalAmount }],
      total: info.totalAmount,
    };
  }

  if (!Array.isArray(info.items) || !info.items.length) {
    return null;
  }

  return {
    ...base,
    items: info.items.map((item) => ({
      name: `${item.goodName || ''}${item.brand || ''}`.trim() || item.goodCode || 'Ապրանք',
      qty: item.quantity ?? 1,
      price: item.price ?? 0,
      total: item.totalWithTaxes ?? item.price ?? 0,
      unit: item.unit,
    })),
    total: info.totalAmount,
  };
}
