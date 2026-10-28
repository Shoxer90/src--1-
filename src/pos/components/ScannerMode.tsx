import styles from "../pos.module.scss";
import { formatAmd, formatQty } from "../money";
import { unitLabel } from "../cartMath";
import type { PosProduct } from "../types";
import { Photo } from "./Photo";

export function ScannerMode({
  product,
  added,
  inReceipt,
}: {
  product: PosProduct | null;
  added: number;
  inReceipt: number;
}) {
  return (
    <div className={styles.scannerBody}>
      <div className={styles.scannerBar}>Սկաների ռեժիմ</div>
      {product ? (
        <div className={styles.lastCard}>
          <Photo src={product.photo} className={styles.scanPhoto} alt="" />
          <div>
            <div className={styles.cardName}>{product.name}</div>
            <div className={`${styles.price} ${styles.nums}`}>
              {formatAmd(product.discountedPrice)} / {unitLabel(product.measure)}
            </div>
            <div className={styles.added}>+{formatQty(added)} ավելացվեց</div>
            <div className={styles.meta}>Կտրոնում՝ {formatQty(inReceipt)} {unitLabel(product.measure)}</div>
          </div>
        </div>
      ) : (
        <div className={styles.hint}>Սկանավորեք ապրանքը</div>
      )}
      <div className={styles.hints}>
        <div className={styles.hint}>
          <b>6*</b>
          Բազմապատկում. 6*կոդը ավելացնում է 6 հատ
        </div>
        <div className={styles.hint}>
          <b>1.25*</b>
          Կշռով ապրանք. 1.25*կոդը ավելացնում է 1.25 կգ
        </div>
        <div className={styles.hint}>
          <b>Ներքին կոդ</b>
          Շտրիխ-կոդից տարբեր դաշտ է. մուտքագրեք ներքին կոդը
        </div>
      </div>
    </div>
  );
}
