import { useCallback, useState } from 'react';
import { CryptoData } from '../../entities/crypto';
import { useSignals } from '../../entities/signals';
import { SignalsForm } from './SignalsForm';
import { SignalsTable } from './SignalsTable';

export function SignalsWidget({ data }: { data: CryptoData | undefined }) {
  const [retry, setRetry] = useState(0);
  const signals = useSignals(retry);

  const handleSignalsUpdate = useCallback(() => {
    setRetry(r => r + 1);
  }, []);

  return (
    <div className="flex flex-column gap-4">
      <SignalsForm data={data} onUpdate={handleSignalsUpdate} />

      <SignalsTable
        data={data}
        signals={signals}
        onUpdate={handleSignalsUpdate}
      />
    </div>
  );
}
