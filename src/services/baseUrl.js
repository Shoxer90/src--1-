
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
  title: "basket.discount",
  id: 4,
  key: "additionalDiscount",
  checked:  true
},{
  title: "history.type",
  id: 17,
  key: "saleType",
  checked:  true
},
// {
//   title: "history.vat",
//   id: 5,
//   key: "1",
//   checked:  true
// },{
//   title: "history.cash",
//   id: 6,
//   key: "2",
//   checked:  true
// },{
//   title: "history.card",
//   id: 7,
//   key: "3",
//   checked:  true
// },{
//   title: "history.transactionType",
//   id: 8,
//   key: "4",
//   checked:  true
// },{
//   title: "history.prepaymentRedemption",
//   id: 9,
//   key: "5",
//   checked:  true
// },{
//   title: "history.partialPayment",
//   id: 10,
//   key: "6",
//   checked:  true
// },{
//   title: "history.refundAmount",
//   id: 11,
//   key: "7",
//   checked:  true
// },{
//   title: "history.refundAmount",
//   id: 12,
//   key: "8",
//   checked:  true
// },{
//   title: "history.fiskalnum",
//   id: 13,
//   key: "9",
//   checked:  true
// },
{
  title: "basket.partner",
  id: 14,
  key: "partnerTin",
  checked:  true
},{
  title: "history.performer",
  id: 15,
  key: "cashier",
  checked:  true
},
// {
//   title:  "history.cashregister",
//   id: 16,
//   key: "10",
//   checked:  true
// }
];

