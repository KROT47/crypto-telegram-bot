import { Button } from 'primereact/button';
import { Dropdown, DropdownProps } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { SelectButton } from 'primereact/selectbutton';
import { useEffect, useRef, useState } from 'react';
import { CryptoData, CryptoItem, getCryptoIcon } from '../../entities/crypto';
import {
  Signal,
  createSignalRequest,
  updateSignalRequest,
} from '../../entities/signals';

const signalOptionTemplate = (option: CryptoItem) => {
  return (
    <div className="flex gap-2 align-items-center">
      <img
        alt={option.name}
        src={getCryptoIcon(option.id)}
        style={{ width: '18px' }}
      />
      <div>{option.name}</div>
    </div>
  );
};

const selectedCryptoTemplate = (option: CryptoItem, props: DropdownProps) => {
  if (option) {
    return signalOptionTemplate(option);
  }

  return <span>{props.placeholder}</span>;
};

function numberIsInRange(num: number | null, min: number, max: number) {
  return num !== null && num > 0 && num >= min && num <= max;
}

const options = ['price', 'percent'];

const minPriceDelta = 0;
const maxPriceDelta = 100000;
const minPercentDelta = 0;
const maxPercentDelta = 1000;
const minTimeFrame = 0;
const maxTimeFrame = 10000;

export function SignalsForm({
  data,
  editItem,
  onUpdate,
}: {
  data: CryptoData | undefined;
  editItem?: Signal;
  onUpdate: () => void;
}) {
  const [error, setError] = useState<string>();
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoItem>();
  const [priceDelta, setPriceDelta] = useState<number | null>(null);
  const [percentDelta, setPercentDelta] = useState<number | null>(null);
  const [timeFrame, setTimeFrame] = useState<number | null>(null);

  const clearForm = () => {
    setSelectedOption(options[0]);
    setSelectedCrypto(undefined);
    setPriceDelta(null);
    setPercentDelta(null);
    setTimeFrame(null);
  };

  const isLoadingRef = useRef(false);

  // useRef to prevent unwanted behavior
  const cryptoOptionsRef = useRef<CryptoData>();
  if (cryptoOptionsRef.current === undefined) cryptoOptionsRef.current = data;

  useEffect(() => {
    if (editItem) {
      setSelectedOption(editItem.type);
      setSelectedCrypto(
        cryptoOptionsRef.current?.find(
          ({ symbol }) => symbol === editItem.symbol
        )
      );
      if (editItem.type === 'price') {
        setPriceDelta(editItem.delta);
      } else {
        setPercentDelta(editItem.delta);
      }
      setTimeFrame(editItem.timeFrame);
    }
  }, [editItem]);

  const disabled =
    isLoadingRef.current ||
    selectedCrypto === undefined ||
    (selectedOption === 'price'
      ? !numberIsInRange(priceDelta, minPriceDelta, maxPriceDelta)
      : !numberIsInRange(percentDelta, minPercentDelta, maxPercentDelta)) ||
    !numberIsInRange(timeFrame, minTimeFrame, maxTimeFrame);

  const handleSubmit = async () => {
    const delta = selectedOption === 'price' ? priceDelta : percentDelta;

    if (
      disabled ||
      isLoadingRef.current ||
      delta === null ||
      timeFrame === null
    ) {
      return;
    }
    isLoadingRef.current = true;

    setError(undefined);

    const formData = {
      symbol: selectedCrypto.symbol,
      type: selectedOption,
      delta,
      timeFrame,
    };

    try {
      await (editItem
        ? updateSignalRequest(editItem.id, formData)
        : createSignalRequest(formData));

      if (!editItem) clearForm();
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
      console.error(e);
    }

    onUpdate();

    isLoadingRef.current = false;
  };

  return (
    <div>
      <div className="card flex flex-column md:flex-row gap-3">
        <div className="p-inputgroup flex-1">
          <Dropdown
            value={selectedCrypto}
            onChange={e => setSelectedCrypto(e.value)}
            options={cryptoOptionsRef.current}
            optionLabel="name"
            placeholder="Select Crypto"
            filter
            valueTemplate={selectedCryptoTemplate}
            itemTemplate={signalOptionTemplate}
            className="w-full md:w-14rem"
          />
        </div>

        <SelectButton
          style={{ textTransform: 'capitalize' }}
          value={selectedOption}
          options={options}
          onChange={e => setSelectedOption(e.value)}
        />

        {selectedOption === 'price' ? (
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">$</span>
            <InputNumber
              mode="decimal"
              maxFractionDigits={5}
              min={minPriceDelta}
              max={maxPriceDelta}
              placeholder="Price delta"
              value={priceDelta}
              onChange={e => setPriceDelta(e.value)}
            />
          </div>
        ) : (
          <div className="p-inputgroup flex-1">
            <InputNumber
              mode="decimal"
              maxFractionDigits={3}
              min={minPercentDelta}
              max={maxPercentDelta}
              placeholder="Percent delta"
              value={percentDelta}
              onChange={e => setPercentDelta(e.value)}
            />
            <span className="p-inputgroup-addon">%</span>
          </div>
        )}

        <div className="p-inputgroup flex-1">
          <InputNumber
            min={minTimeFrame}
            max={maxTimeFrame}
            placeholder="Time frame"
            value={timeFrame}
            onChange={e => setTimeFrame(e.value)}
          />
          <span className="p-inputgroup-addon">min</span>
        </div>

        <div style={{ color: 'var(--red-600)' }}>{error}</div>

        <div className="p-inputgroup flex-1">
          <Button
            onClick={handleSubmit}
            className="flex-1"
            label={editItem ? 'Update' : 'Add'}
            aria-label={editItem ? 'Update' : 'Add'}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
