export const buildSalePaymentPayload = (paymentInfo, totalPrice, prepayment = 0) => {
  const payable = +(totalPrice - (prepayment || 0)).toFixed(2);
  const cardInput = +paymentInfo?.cardAmount || 0;
  const cashInput = +paymentInfo?.cashAmount || 0;
  const cardAmount = Math.min(cardInput, payable);
  const cashAmount = Math.min(cashInput, Math.max(0, payable - cardAmount));
  const { changeAmount, ...rest } = paymentInfo;

  return {
    ...rest,
    cardAmount,
    cashAmount,
  };
};
