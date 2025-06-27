
// export const baseUrl = "https://storex.payx.am/api/";
export const baseUrl = "https://storextest.payx.am/api/";

export const option = () => {
  const  option = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      accept_language: localStorage.getItem("i18nextLng") ||localStorage.getItem("lang") 
    }}
  return option
};

export const CASH_LIMIT = +300000;
let bazmapat = "×"

export const replaceGS = (code) => {
  // console.log(code,"code")
  const input = code.trim(); 
  const output = input.replace(/\x1d/g, "\\u001d");  
  // console.log(output,"output")
  return output
};

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
  title: "settings.operation",
  id: 2,
  key: "operation",
  checked:  true
},{
  title: "history.checkNum",
  id: 3,
  key: "recieptId",
  checked:  true
},{
  title: "history.total",
  id: 4,
  key: "total",
  checked:  true
},{
  title: "history.cash",
  id: 5,
  key: "cashAmount",
  checked:  true
},{
  title: "history.card",
  id: 6,
  key: "cardAmount",
  checked:  true
},{
  // title: "basket.useprepayment",
  title: "basket.prepaymentTitle",
  id: 7,
  key: "prepaymentAmount",
  checked:  true
},{
  title: "basket.discount",
  id: 8,
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
// {
//   title: "settings.operation",
//   id: 15,
//   key: "operation",
//   checked:  true
// },

];

