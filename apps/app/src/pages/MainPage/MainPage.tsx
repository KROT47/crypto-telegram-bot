import { TabPanel, TabView } from 'primereact/tabview';
import { CryptoTable } from '../../widgets/CryptoTableWidget';
import { useCryptoPriceSubscribe } from '../../entities/crypto';
import { SignalsWidget } from '../../widgets/SignalsWidget';

export function MainPage() {
  const data = useCryptoPriceSubscribe();

  return (
    <TabView>
      <TabPanel header="Crypto">
        <CryptoTable data={data} />
      </TabPanel>

      <TabPanel header="Signals">
        <SignalsWidget data={data} />
      </TabPanel>
    </TabView>
  );
}
