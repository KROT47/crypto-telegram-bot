import { useMemo, useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import {
  CryptoData,
  CryptoName,
  getCryptoIcon,
} from '../../../entities/crypto';
import { Signal, signalsUrl } from '../../../entities/signals';
import { formatPercent, formatPrice } from '../../../shared/utils';
import { Button } from 'primereact/button';

import styles from './SignalsTable.module.scss';
import { SignalsForm } from '../SignalsForm';

export function SignalsTable({
  data,
  signals,
  onUpdate,
}: {
  data: CryptoData | undefined;
  signals: Signal[];
  onUpdate: () => void;
}) {
  const dataRef = useRef<CryptoData>();
  if (dataRef.current === undefined) dataRef.current = data;

  const preparedSignals = useMemo(() => {
    const { current: cryptoData } = dataRef;
    if (cryptoData === undefined) return [];

    return signals.map(signal => {
      const item = cryptoData.find(({ symbol }) => signal.symbol === symbol);
      return {
        iconId: item?.id || 0,
        name: item?.name || '',
        ...signal,
      };
    });
  }, [signals, dataRef.current]);

  const handleRemove = async (id: string) => {
    if (!confirm('Remove this signal?')) return;

    const url = new URL(signalsUrl);
    url.pathname += `/${id}`;
    await fetch(url, { method: 'delete' });

    onUpdate();
  };

  const [editSignalId, setEditSignalId] = useState<string | undefined>(
    undefined
  );

  const onDialogHide = () => {
    setEditSignalId(undefined);
  };

  return (
    <div>
      <Dialog
        header="Edit Signal"
        visible={Boolean(editSignalId)}
        modal
        onHide={onDialogHide}
        dismissableMask
        position="top"
      >
        <SignalsForm
          data={data}
          editItem={signals.find(({ id }) => id === editSignalId)}
          onUpdate={() => {
            onDialogHide();
            onUpdate();
          }}
        />
      </Dialog>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Crypto</th>
            <th>Delta</th>
            <th>Time Frame</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {preparedSignals.map(
            ({ id, iconId, name, symbol, delta, timeFrame, type }) => {
              return (
                <tr key={id}>
                  <td>
                    <CryptoName {...{ id: iconId, name, symbol }} />
                  </td>
                  <td>
                    {type === 'price'
                      ? formatPrice(delta)
                      : formatPercent(delta)}
                  </td>
                  <td>{timeFrame} min</td>
                  <td>
                    <div className="flex gap-2 justify-content-end">
                      <Button
                        icon="pi pi-file-edit"
                        className="p-button-rounded p-button-info p-button-outlined"
                        onClick={() => setEditSignalId(id)}
                      />
                      <Button
                        icon="pi pi-trash"
                        className="p-button-rounded p-button-danger p-button-outlined"
                        onClick={() => handleRemove(id)}
                      />
                    </div>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
}
