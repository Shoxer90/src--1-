
export const baseUrl = "https://storex.payx.am/api/";

export const option = () => {
  const  option = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    }}
  return option
};

export const CASH_LIMIT = +300000
export const columnNames = [{
  title: "history.number",
  id: 0,
  key: "id",
  checked:  true
},{
  title: "history.date",
  id: 1,
  key: "date",
  checked:  true
},{
  title: "history.checkNum",
  id: 2,
  key: "recieptId",
  checked:  true
},{
  title: "history.total",
  id: 3,
  key: "total",
  checked:  true
},{
  title: "history.cash",
  id: 4,
  key: "cashAmount",
  checked:  true
},{
  title: "history.card",
  id: 5,
  key: "cardAmount",
  checked:  true
},{
  title: "basket.useprepayment",
  id: 6,
  key: "prepaymentAmount",
  checked:  true
},{
  title: "basket.discount",
  id: 7,
  key: "additionalDiscount",
  checked:  true
},{
  title: "history.type",
  id: 17,
  key: "saleType",
  checked:  true
},{
  title: "basket.partner",
  id: 14,
  key: "partnerTin",
  checked:  true
},{
  title: "settings.cashier",
  id: 15,
  key: "cashier",
  checked:  true
},

];

