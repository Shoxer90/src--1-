import styles from "../pos.module.scss";
import { formatAmd } from "../money";
import type { PaymentStatusKind } from "../payment";

const TEXT: Record<PaymentStatusKind, (amount: number) => string> = {
  due: (amount) => `Մնում է վճարել ${formatAmd(amount)}`,
  change: (amount) => `Մանր՝ վերադարձնել ${formatAmd(amount)}`,
  paid: () => "Վճարված է ամբողջությամբ",
  debt: (amount) => `Պարտք (կվճարվի հետո) ${formatAmd(amount)}`,
};

const CLASS: Record<PaymentStatusKind, string> = {
  due: styles.statusDue,
  change: styles.statusChange,
  paid: styles.statusPaid,
  debt: styles.statusDebt,
};

export function PaymentStatus({ kind, amount }: { kind: PaymentStatusKind; amount: number }) {
  return <div className={`${styles.status} ${CLASS[kind]}`}>{TEXT[kind](amount)}</div>;
}
