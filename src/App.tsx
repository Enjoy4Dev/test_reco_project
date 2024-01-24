import { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  useEffect(() => {
    try {

      fetch(`/api/v1/app-service/get-apps`,
        {
          method: 'PUT',
          body: JSON.stringify({
            "pageNumber": 0,
            "pageSize": 25
          }),
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'ngrok-skip-browser-warning': '69420'
          }
        },
      ).then((res) => {
        console.log('status', res);
        return res.text();
      }).then(console.log)
    } catch (error) {
      console.error('🚀 ~ error:', error);

    }
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
