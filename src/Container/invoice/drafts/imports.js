export const headCells = [
  {
    id: 'createdAt',
    numeric: false,
    disablePadding: true,
    label: 'Ստեղծման ա/թ',
  },
  {
    id: 'deliveredAt',
    numeric: true,
    disablePadding: false,
    label: 'Մատակարարման ա/թ',
  },
  {
    id: 'partnerTin',
    numeric: true,
    disablePadding: false,
    label: 'Ստացողի ՀՎՀՀ',
  },
  {
    id: 'partnerName',
    numeric: true,
    disablePadding: false,
    label: 'Ստացողի անվանում',
  },
  {
    id: 'amount',
    numeric: true,
    disablePadding: false,
    label: 'Ընդհանուր գումար',
  },
   {
    id: 'withoutTax',
    numeric: true,
    disablePadding: false,
    label: 'Շրջանառ․ առանց ԱԱՀ',
  },
   {
    id: 'tax',
    numeric: true,
    disablePadding: false,
    label: 'ԱԱՀ գումար',
  },
   {
    id: 'invoiceSubType',
    numeric: true,
    disablePadding: false,
    label: 'Հաշվի տեսակ',
  },
   {
    id: 'behalfOf',
    numeric: true,
    disablePadding: false,
    label: 'Հաշվի ձև',
  },
   {
    id: 'destinationAddress',
    numeric: true,
    disablePadding: false,
    label: 'Առաքման վայր',
  },
   {
    id: 'sourceAddress',
    numeric: true,
    disablePadding: false,
    label: 'Նշանակման վայր',
  },
    {
    id: 'operation',
    numeric: true,
    disablePadding: false,
    label: '',
  },
];

export const createData = (id, createdAt, deliveredAt, partnerTin, partnerName, amount, withoutTax,tax,invoiceSubType,behalfOf,destinationAddress, sourceAddress, operation
)=> {
  return {
    id,
    createdAt,
    deliveredAt,
    partnerTin,
    partnerName,
    amount,
    withoutTax,
    tax,
    invoiceSubType,
    behalfOf,
    destinationAddress,
    sourceAddress,
    operation
  };
}