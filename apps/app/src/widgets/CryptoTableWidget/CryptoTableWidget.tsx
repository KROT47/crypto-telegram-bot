import { CryptoData, CryptoName } from '../../entities/crypto';
import { formatPercent, formatPrice } from '../../shared/utils';

import styles from './CryptoTableWidget.module.scss';

export function CryptoTable({ data }: { data: CryptoData | undefined }) {
  return (
    <div>
      <table className={styles.cryptoTable}>
        <tbody>
          {data?.map(({ id, name, symbol, price, percent_change_1h }) => (
            <tr key={id}>
              <td>
                <CryptoName {...{ id, name, symbol }} />
              </td>
              <td className={styles.priceCell}>{formatPrice(price)}</td>
              <td className={styles.percentCell}>
                <div>
                  {Number(percent_change_1h) < 0 ? (
                    <i
                      className="pi pi-caret-down"
                      style={{ color: 'var(--red-600)' }}
                    />
                  ) : (
                    <i
                      className="pi pi-caret-up"
                      style={{ color: 'var(--green-400)' }}
                    />
                  )}
                  {formatPercent(percent_change_1h)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
