import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';


function App() {
  const [data, setData] = useState(null);
  useEffect(() => {
    axios.get('http://localhost:4000/hello')
      .then((response) => {
        setData(response.data.message)
      })}, []);
    return (
      <div className="App">
        <header className="App-header">
          <p>
            {data ? data : 'Loading...'}
          </p>
        </header>
      </div>
    );
  }

export default App;
