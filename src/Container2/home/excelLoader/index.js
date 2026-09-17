import React, { memo, useEffect, useRef, useState } from 'react';

import * as XLSX from "xlsx";
import ExcelRow from './ExcelRow';
import styles from "./index.module.scss";
import { Dialog, Divider } from '@mui/material';
import AddMultipleProductsDialog from './AddMultipleProductsDialog';
import { createProductList, getAllAdgCode, updateProductList } from '../../../services/products/productsRequests';
import Loader from '../../loading/Loader';
import SnackErr from '../../dialogs/SnackErr';
import { useNavigate, useLocation } from 'react-router-dom';
import { t } from 'i18next';
import { useSuccessSound } from '../../../modules/PlaySound';
import {
  expandCategoryIds,
  flattenCategories,
  getCategories,
  idsWithAncestors,
  mapCategoriesById,
  normalizeCategoryTree
} from '../../../services/categories/categoriesRequests';

const normalizeExcelKey = (key) => String(key || "").replace(/\s+/g, " ").trim().toLowerCase();

const getExcelValueByKey = (row, matchers) => {
  for (const [key, value] of Object.entries(row || {})) {
    const normalized = normalizeExcelKey(key);
    if (matchers.some((match) => match(normalized))) {
      return value;
    }
  }
  return undefined;
};

const parseExcelCategoryId = (row) => {
  const raw = getExcelValueByKey(row, [
    (key) => key.includes("category id"),
    (key) => key.includes("id категории"),
    (key) => key.includes("կատեգորիայի id")
  ]);
  const id = Number(String(raw ?? "").trim());
  return Number.isFinite(id) && id > 0 ? id : null;
};

const parseExcelCategoryName = (row) => {
  const raw = getExcelValueByKey(row, [
    (key) => (
      (key.includes("կատեգորիա") || key.includes("category") || key.includes("категория"))
      && !key.includes("id")
    )
  ]);
  return String(raw ?? "").trim();
};

const findCategoryIdByName = (name, byId = {}) => {
  const normalized = String(name || "").trim().toLowerCase();
  if (!normalized) return null;
  const found = Object.values(byId).find((item) =>
    [item.title, item.pathLabel, item.titleHy, item.titleEn, item.titleRu]
      .filter(Boolean)
      .some((label) => label.trim().toLowerCase() === normalized)
  );
  return found?.id || null;
};

const resolveExcelCategoryIds = (row, byId = {}) => {
  const id = parseExcelCategoryId(row) || findCategoryIdByName(parseExcelCategoryName(row), byId);
  return id ? idsWithAncestors(id, byId) : [];
};

const excelText = (value) => {
  if (value == null || value === "") return "";
  const text = String(value).trim();
  return text === "undefined" || text === "null" ? "" : text;
};

const parseExcelInnerCode = (row) => {
  const exact = excelText(row?.["Ներքին կոդ / Inner code / Внутренний код *"]);
  if (exact) return exact;
  return excelText(getExcelValueByKey(row, [
    (key) => key === "innercode",
    (key) => (
      (key.includes("ներքին կոդ") || key.includes("inner code") || key.includes("внутренний код"))
      && !key.includes("բարկոդ")
      && !key.includes("barcode")
      && !key.includes("штрих")
    )
  ]));
};

const parseExcelBarCode = (row) => {
  const exact = excelText(row?.["Բարկոդ / Barcode / Штрих-код *"]);
  if (exact) return exact;
  const matched = excelText(getExcelValueByKey(row, [
    (key) => key === "barcode",
    (key) => (
      (key.includes("բարկոդ") || key.includes("barcode") || key.includes("штрих-код") || key.includes("штрихкод"))
      && !key.includes("ներքին")
      && !key.includes("inner")
      && !key.includes("внутренн")
    )
  ]));
  if (matched) return matched;
  return excelText(row?.["Ներքին կոդ , Բարկոդ / Internal code , Barcode / Внутренний код , Штрих-код *"]);
};

const excelNumber = (value, digits) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  return digits == null ? num : +num.toFixed(digits);
};

const parseExcelBoolean = (value) => {
  const text = excelText(value).toLowerCase();
  return ["1", "true", "yes", "այո", "да"].includes(text);
};

const parseExcelIntId = (row, matchers) => {
  const raw = getExcelValueByKey(row, matchers);
  const id = Number(String(raw ?? "").trim());
  return Number.isFinite(id) && id > 0 ? id : 0;
};

const isProductIdColumn = (key) => {
  const isCategory = key.includes("category") || key.includes("категор") || key.includes("կատեգոր");
  if (isCategory) return false;
  return (
    key.includes("ապրանքի id")
    || key.includes("product id")
    || key.includes("id товара")
    || key.includes("id продукта")
    || key === "productid"
    || key === "id"
  );
};

const parseExcelProductId = (row) => {
  const exact = row?.["Ապրանքի ID / Product Id / ID товара"];
  if (exact != null && exact !== "") {
    const id = Number(String(exact).trim());
    if (Number.isFinite(id) && id > 0) return id;
  }
  return parseExcelIntId(row, [isProductIdColumn]);
};

const parseExcelCategoryIdsList = (row) => {
  const raw = getExcelValueByKey(row, [
    (key) => key === "categoryids" || key === "category ids"
  ]);
  if (raw == null || raw === "") return null;
  if (Array.isArray(raw)) {
    return raw.map(Number).filter((id) => Number.isFinite(id) && id > 0);
  }
  return String(raw)
    .split(/[,;]/)
    .map((item) => Number(item.trim()))
    .filter((id) => Number.isFinite(id) && id > 0);
};

const parseExcelProductRow = (prod, byId) => {
  const type = excelText(
    prod?.["ԱՏԳ ԱԱ կոդ կամ ԱԴԳՏ դասակարգիչ / LP FEA code or PCTA classifier / ПП ВЭД код или КПВД классификатор *"] ??
    getExcelValueByKey(prod, [
      (key) => key === "type",
      (key) => key.includes("ատգ") || key.includes("lp fea") || key.includes("пп вэд")
    ])
  );
  const name = excelText(
    prod?.["Ապրանքի անվանումը (50 նիշ) / Product Name (50 Symbols) / Название товара (50 символа) *"] ??
    getExcelValueByKey(prod, [
      (key) => key === "name",
      (key) => key.includes("անվանում") || key.includes("product name") || key.includes("название")
    ])
  );
  const brand = excelText(
    prod?.["Ապրանքանիշ / Brand / Бренд"] ??
    getExcelValueByKey(prod, [(key) => key === "brand" || key.includes("ապրանքանիշ") || key.includes("бренд")])
  );
  const innerCode = parseExcelInnerCode(prod);
  const barCode = parseExcelBarCode(prod);
  const measure = excelText(
    prod?.["Չափման միավոր / Measure / Мера *"] ??
    getExcelValueByKey(prod, [
      (key) => key === "measure",
      (key) => key.includes("չափման") || key.includes("мера") || key === "unit"
    ])
  );
  const remainder = excelNumber(
    prod?.["Ապրանքի քանակը / Product Count / Количество товара"] ??
    getExcelValueByKey(prod, [
      (key) => key === "remainder",
      (key) => key.includes("քանակ") || key.includes("count") || key.includes("количество")
    ])
  );
  const purchasePrice = excelNumber(
    prod?.[" Ապրանքի ինքնարժեք / Purchase price / Закупочная цена "] ??
    prod?.["Ապրանքի ինքնարժեք / Purchase price / Закупочная цена"] ??
    getExcelValueByKey(prod, [
      (key) => key === "purchaseprice",
      (key) => key.includes("ինքնարժեք") || key.includes("purchase") || key.includes("закупоч")
    ]),
    2
  );
  const price = excelNumber(
    prod?.[" Վաճառքի գին / Product price / Цена продукта * "] ??
    prod?.["Վաճառքի գին / Product price / Цена продукта *"] ??
    getExcelValueByKey(prod, [
      (key) => key === "price",
      (key) => key.includes("վաճառքի գին") || key.includes("product price") || key.includes("цена продукта")
    ]),
    2
  );
  const vatRaw = prod?.["ԱԱՀ - ով չհարկվող / Excluding VAT / Без учета НДС"] ??
    getExcelValueByKey(prod, [(key) => key === "dep" || key.includes("աահ") || key.includes("vat") || key.includes("ндс")]);
  const productId = parseExcelProductId(prod);
  const id = productId;
  const categoryIds = parseExcelCategoryIdsList(prod) || resolveExcelCategoryIds(prod, byId);

  return {
    id,
    productId,
    type,
    dep: vatRaw === true || vatRaw === 2 || parseExcelBoolean(vatRaw) ? 2 : (Number(vatRaw) || 0),
    name,
    brand,
    measure,
    otherLangMeasure: excelText(getExcelValueByKey(prod, [(key) => key === "otherlangmeasure"])),
    photo: excelText(getExcelValueByKey(prod, [(key) => key === "photo" || key.includes("լուսանկար") || key.includes("фото")])),
    barCode,
    innerCode,
    remainder,
    remainderPrePayment: excelNumber(getExcelValueByKey(prod, [(key) => key === "remainderprepayment"])),
    purchasePrice,
    price,
    discountedPrice: excelNumber(getExcelValueByKey(prod, [(key) => key === "discountedprice"]), 2),
    discount: excelNumber(getExcelValueByKey(prod, [(key) => key === "discount" || key.includes("զեղչ") || key.includes("скид")]), 2),
    discountType: excelNumber(getExcelValueByKey(prod, [(key) => key === "discounttype"])),
    lastUpdate: new Date().toJSON(),
    isFavorite: parseExcelBoolean(getExcelValueByKey(prod, [(key) => key === "isfavorite"])),
    comment: excelText(getExcelValueByKey(prod, [(key) => key === "comment" || key === "coment"])),
    category: 0,
    categoryIds,
    description: excelText(getExcelValueByKey(prod, [(key) => key === "description"])),
    __rowNum__: prod?.__rowNum__,
    __originalBarCode: barCode,
    __originalInnerCode: innerCode,
    keyWords: [{
      id: 0,
      keyWord: ""
    }],
    emark: excelText(getExcelValueByKey(prod, [(key) => key === "emark"])),
    isEmark: parseExcelBoolean(
      prod?.["պարունակում է e-Mark"] ??
      getExcelValueByKey(prod, [(key) => key === "isemark" || key.includes("e-mark") || key.includes("emark")])
    )
  };
};

const toUpdateProductPayload = (prod, byId) => ({
  id: Number(prod?.id) || 0,
  productId: Number(prod?.productId || prod?.id) || 0,
  type: prod?.type || "",
  dep: Number(prod?.dep) || 0,
  name: prod?.name || "",
  brand: prod?.brand || "",
  measure: prod?.measure || "",
  otherLangMeasure: prod?.otherLangMeasure || "",
  innerCode: prod?.innerCode || "",
  photo: prod?.photo || "",
  barCode: prod?.barCode || "",
  remainder: +(prod?.remainder) || 0,
  remainderPrePayment: +(prod?.remainderPrePayment) || 0,
  purchasePrice: +(prod?.purchasePrice) || 0,
  price: +(prod?.price) || 0,
  discountedPrice: +(prod?.discountedPrice) || 0,
  discount: +(prod?.discount) || 0,
  discountType: +(prod?.discountType) || 0,
  lastUpdate: new Date().toISOString(),
  isFavorite: Boolean(prod?.isFavorite),
  comment: prod?.comment || prod?.coment || "",
  categoryIds: expandCategoryIds(prod?.categoryIds, byId),
  description: prod?.description || "",
  keyWords: prod?.keyWords || [{ id: 0, keyWord: "" }],
  emark: prod?.emark || "",
  isEmark: Boolean(prod?.isEmark)
});

const PasteExcelToReact = ({logOutFunc, setCurrentPage}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isUpdatePage = pathname === "/excelUpdate";
  const excelMode = isUpdatePage ? "update" : "add";
  const [uploadFile,setUploadFile] = useState();
  const [isLoad,setIsLoad] = useState();
  const [message,setMessage] = useState({m:"",t:""});
  const [rowStatus,setRowStatus] = useState({});
  const [barCodes,setBarCodes] = useState([]);
  const [innerCodes,setInnerCodes] = useState([]);
  const [allAdgs, setAllAdgs] = useState([]);
  const [categoryById, setCategoryById] = useState({});
  const [flatCategories, setFlatCategories] = useState([]);
  const categoryByIdRef = useRef({});
  
  const readExcel = (e) => {
   if (!e.target.files?.[0]) return;
   const input = e.target;
   setIsLoad(true)
    const promise = new Promise((resolve,reject) => {
        
    const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(e.target.files[0]);

      fileReader.onload=(e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray,{type:"buffer"});
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName] ;
        const data = XLSX.utils.sheet_to_json(ws)
        resolve(data)
      };
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
    
    promise.then((res) => {
     const arr = [];
     res.forEach(prod => {
      const parsed = parseExcelProductRow(prod, categoryByIdRef.current);

      if (!parsed.type && !parsed.name && !parsed.brand && !parsed.barCode && !parsed.innerCode && !parsed.remainder && !parsed.purchasePrice && !parsed.price) {
        return;
      }

      return arr.push(parsed)
    })
    setBarCodes([])
    setInnerCodes([])
    setRowStatus({})
    setUploadFile(arr)
    input.value = ""
   
    setIsLoad(false)
  }).catch(() => {
    setIsLoad(false)
  })
  };

  const checkRowStatus = async(obj, row) => {
    const rowObjToArr = Array.from(Object.values(obj))
    if(rowObjToArr.includes(false)) {
      setRowStatus({
        ...rowStatus,
        [row]:false,
      })
    }else{
      setRowStatus({
        ...rowStatus,
        [row]:true,
      })
    }
  };
  const playSuccess = useSuccessSound();

  const confirmExcelList = async(res) => {
    const payload = (res || []).map((prod) => {
      const { __rowNum__, __originalBarCode, __originalInnerCode, category, ...rest } = prod;
      return {
        ...rest,
        innerCode: prod?.innerCode || "",
        categoryIds: expandCategoryIds(prod?.categoryIds, categoryByIdRef.current)
      };
    });
    createProductList(payload).then((res)=> {
      setIsLoad(false)
      if(res === 200){
        playSuccess()
        setMessage({m: t("dialogs.done"),t: "success"})
      }else if(res === 401){
        logOutFunc()
      }else{
        setMessage({m: t("dialogs.wrong"),t: "error"})
        return
      }
      setMessage({m: t("dialogs.done"),t: "success"})
    })
  };

  const confirmRemainderUpdate = async(res) => {
    const payload = (res || []).map((prod) => toUpdateProductPayload(prod, categoryByIdRef.current));
    updateProductList(payload, 1).then((status)=> {
      setIsLoad(false)
      if(status === 200){
        playSuccess()
        setMessage({m: t("dialogs.done"),t: "success"})
      }else if(status === 401){
        logOutFunc()
      }else{
        setMessage({m: t("dialogs.wrong"),t: "error"})
      }
    })
  };

  const createMultipleProds = async() => {
    setIsLoad(true)
    let statusArray = Array.from(Object.values(rowStatus));
    if(statusArray.includes(false)) {
      setIsLoad(false)
      setMessage({m: t("cardService.wrongCeil"),t: "error"})
    }else if(excelMode === "update"){
      confirmRemainderUpdate(uploadFile)
    }else{
      confirmExcelList(uploadFile)
    }
  };

  const closeWindowAndReload = () => {
    setMessage({m:"",t:""})
    navigate("/")
    window.location.reload(false);
  };

  useEffect(() => {
    setUploadFile(undefined);
    setRowStatus({});
    setBarCodes([]);
    setInnerCodes([]);
  }, [pathname]);

  useEffect(() => {
    !allAdgs.length && getAllAdgCode().then((res) => {
      setAllAdgs(res)
    })
    getCategories().then((data) => {
      const tree = normalizeCategoryTree(data);
      const byId = mapCategoriesById(tree);
      categoryByIdRef.current = byId;
      setCategoryById(byId);
      setFlatCategories(flattenCategories(tree));
    })
  }, []);

  return (
    <div style={{marginTop:"100px"}}>
      <Dialog open={!!isLoad}>
        <Loader close={()=>setIsLoad(false)}/>
      </Dialog>
      {message &&
        <Dialog open={Boolean(message?.m)}>
          <SnackErr message={message?.m} close={message?.t==="success" ? closeWindowAndReload: setMessage} type={message?.t} />
        </Dialog>
      }
      <AddMultipleProductsDialog 
        uploadFile={uploadFile}
        setUploadFile={setUploadFile}
        readExcel={readExcel}
        createMultipleProds={createMultipleProds}
        setCurrentPage={setCurrentPage}
        excelMode={excelMode}
        pageMode={isUpdatePage ? "update" : "add"}
        onSelectRemainderFile={readExcel}
      />
      <Divider sx={{bc:"green",w:2}}/>
      <form autoComplete="off">

      {
        uploadFile &&
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col"> N </th>
              <th scope="col">
                <div>{`${t("productinputs.code")} *`}</div>
                <a style={{fontSize:"65%",padding:"1px"}} 
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.petekamutner.am/Content.aspx?itn=tsOSNewCCM#:~:text=%D5%80%D5%80%20%D5%AF%D5%A1%D5%BC%D5%A1%D5%BE%D5%A1%D6%80%D5%B8%D6%82%D5%A9%D5%B5%D5%A1%D5%B6%2011.11.2014%D5%A9,%D5%AF%D5%B8%D5%A4%D5%A5%D6%80%D5%AB%20%D5%A1%D5%B6%D5%BE%D5%A1%D5%B6%D5%B4%D5%A1%D5%B6%20%D6%81%D5%A1%D5%B6%D5%AF" >
                  {t("productinputs.typeurl1")}
                </a>
                </th>
              <th scope="col">{`${t("productinputs.name")} max 50 ${t("productinputs.symb")}*`}</th>
              <th scope="col">{t("productinputs.brand")}</th>
              <th scope="col">{t("productinputs.category")}</th>
              <th scope="col">{t("productinputs.count")}</th>
              <th scope="col">{`${t("productinputs.measure")} *`}</th>
              <th scope="col">{t("productinputs.purchase")}</th>
              <th scope="col">{`${t("productinputs.price")} (${t("units.min")} 1 ${t("units.amd")})*`}</th>
              <th scope="col">{`${t("productinputs.innerCode")} *`}</th>
              <th scope="col">{`${t("productinputs.barcode")} *`}</th>
              <th scope="col">{t("productinputs.ndsNone")}</th>
            </tr>
          </thead>
          {uploadFile.map((prod,index) => {
            return <tbody autoComplete="off">
              <ExcelRow
                key={`${excelMode}-${prod?.__rowNum__ || index}-${prod?.id || prod?.barCode || index}`} 
                prod={prod} 
                inputValue={uploadFile}
                setInputValue={setUploadFile}
                checkRowStatus={checkRowStatus}
                row={index+1}
                allAdgs={allAdgs}
                setBarCodes={setBarCodes}
                barCodes={barCodes}
                setInnerCodes={setInnerCodes}
                innerCodes={innerCodes}
                flatCategories={flatCategories}
                categoryById={categoryById}
                updateMode={excelMode === "update"}
              />
            </tbody>
          })}
        </table>
      }
      </form>
    </div>
  );
}

export default memo(PasteExcelToReact);
