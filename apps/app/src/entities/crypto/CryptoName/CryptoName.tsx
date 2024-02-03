import { CryptoItem } from '../CryptoItem';
import { getCryptoIcon } from '../getCryptoIcon';
import styles from './CryptoName.module.scss';

export function CryptoName({
  id,
  name,
  symbol,
}: Pick<CryptoItem, 'id' | 'name' | 'symbol'>) {
  return (
    <div className={styles.row}>
      <img className={styles.cryptoIcon} src={getCryptoIcon(id)} />
      <div className={styles.col}>
        <div className={styles.cryptoName}>{name}</div>
        <div>{symbol}</div>
      </div>
    </div>
  );
}
