import './App.css';
import { BaseLayout } from './layouts';
import { BaseTable } from './features/BaseTable';

function App() {
  return (
    <div className="App">
      <BaseLayout title={'App Inventory'}>

        <BaseTable />
      </BaseLayout>
    </div>
  );
}

export default App;
