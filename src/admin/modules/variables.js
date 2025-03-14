

export const OUR_GREEN = "#3FB68A";
export const OUR_ORANGE = "#FFA500";


export const NAV_TITLES = [
 
  {
    id: "0",
    isActive: true,
    title: "admin.stores",
    path:"/admin/stores"
  },
  {
    id: "01",
    isActive: false,
    title: "admin.info",
    path:"/admin/info/customer"
  },
  {
    id: "1",
    isActive: false,
    title: "history.transactions",
    path:"/admin/transactions/customer"
    
  },
  {
    id: "2",
    isActive: false,
    title:"admin.invoices",
    path:"/admin/invoices/customer"

  },
  {
    id: "3",
    isActive: false,
    title:"admin.payments",
    path:"/admin/payments/customer"

  },
  {
    ID: "4",
    isActive: false,
    title:"settings.cashiers",
    path:"/admin/cashiers/customer"

  }
];

export const STORES_COLLUMN_NAMES = [
  {
    id: 1,
    title: "authorize.legalName",
    name: "legalName",
    checked: true,
  }, {
    id: 1.1,
    title: "settings.operation",
    name: "operation",
    checked: true,

  },  {
    id: 2,
    title: "authorize.legalAddress",
    name: "legalAddress",
    checked: true,

  },  {
    id: 3,
    title: "authorize.tin",
    name: "tin",
    checked: true,

  },  {
    id: 4,
    title: "authorize.director",
    name: "director",
    checked: true,

  },  {
    id: 5,
    title: "authorize.email",
    name: "email",
    checked: true,

  },  {
    id: 6,
    title: "authorize.phone",
    name: "phone",
    checked: true,

  }, 
  //  {
  //   id: 7,
  //   title: "authorize.tradeName",
  //   name: "Կոմերցիոն անվանում / հայերեն",
    // checked: true,
    // },
    {
    id:8,
    title: "authorize.city",
    name: "city",
    checked: true,

  },
  //   {
  //   id: 9,
  //   title: "authorize.businessAddress",
  //   name: "Կոմերցիոն հասցե"
    // checked: true,
    // },  
  // {
  //   id: 10,
  //   title: "authorize.merchName",
  //   name: "Merchant Name / անգլերեն ",
  // checked: true,

  // },  {
  //   id: 11,
  //   title: "authorize.merchCity",
  //   name: "Merch. city /Անգլերեն",
  // checked: true,
// 
  // },  {
  //   id: 12,
  //   title: "authorize.merchAdress",
  //   name: "Merch. address / անգլերեն - Arca",
  // checked: true,

  // }, {
  //   id: 13,
  //   title: "authorize.bankName",
  //   name: "Bank name",
      // checked: true,

  // },  {
  //   id: 14,
  //   title: "authorize.bankAccount",
  //   name: "Bank account",
    // checked: true,

  // }, {
  //   id: 15,
  //   title: "authorize.serviceType",
  //   name: "Service type",
    // checked: true,
  // }, {
  //   id: 16,
  //   name: "Հարկման տեսակը",
    // checked: true,
  // },{
  //   id: 17,
  //   title: "Գործունեության տեսակը",
  //   name: "Գործունեության տեսակը",
    // checked: true,
  // },{
  //   id: 18,
  //   title: "Payment System",
  //   name: "Payment System",
    // checked: true,
  // },
  // {
  //   id: 19,
  //   title: "Mid",
  //   name: "Mid",
    // checked: true,
  // }
];

export const HISTORY_COLLUMN_NAMES= [
  {
    title: "history.number",
    name: "number",
    id: 0,
    key: "id",
    checked:  true
  },{
    title: "history.date",
    name: "date",
    id: 1,
    key: "date",
    checked:  true
  },{
    title: "settings.operation",
    name: "operation",
    id: 2,
    key: "operation",
    checked:  true
  },{
    title: "history.checkNum",
    name: "checkNum",
    id: 3,
    key: "recieptId",
    checked:  true
  },{
    title: "history.total",
    name: "total",
    id: 4,
    key: "total",
    checked:  true
  },{
    title: "history.cash",
    name: "cash",
    id: 5,
    key: "cashAmount",
    checked:  true
  },{
    title: "history.card",
    name: "card",
    id: 6,
    key: "cardAmount",
    checked:  true
  },{
    title: "basket.useprepayment",
    name: "useprepayment",
    id: 7,
    key: "prepaymentAmount",
    checked:  true
  },{
    title: "basket.discount",
    name: "discount",
    id: 8,
    key: "additionalDiscount",
    checked:  true
  },{
    title: "history.type",
    name: "type",
    id: 17,
    key: "saleType",
    checked:  true
  },{
    title: "basket.partner",
    name: "partner",
    id: 14,
    key: "partnerTin",
    checked:  true
  },{
    title: "settings.cashier",
    name: "cashier",
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

export const createRowModel = (...props) =>{
  let arr = props
  let obj = {}
  arr.forEach((item, index) => {
    if(item !== null){
      return obj[index+1]= item
    }
 })
 return obj
 
};

export const createDateFormat = (dateItem) => {
  const  date = new Date(dateItem)
  return <div>
    <div>
      {date?.getUTCDate()>9 ? date?.getUTCDate() : `0${ date?.getUTCDate()}`}/
      {date.getMonth()>8 ? date.getMonth()+1: `0${date.getMonth()+1}`}/
      {date.getFullYear()} {" "}
    </div>
    <div> 
      {date.getHours()>9? date.getHours(): `0${date.getHours()}`}:
      {date.getMinutes()>9? date.getMinutes(): `0${date.getMinutes()}`}:
      {date?.getSeconds()>9? date?.getSeconds(): `0${date?.getSeconds()}`}  
    </div>
  </div>
}
