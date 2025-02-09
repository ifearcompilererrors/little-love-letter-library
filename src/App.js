import React, {useRef} from 'react';
import './App.css';

function App() {
  const inputRef = useRef();
  const handleSubmitLetter = () => {
    try {
      const response = fetch('')
    } catch (e) {
      console.error('Error submitting letter:', e);
    }
  }

  return (
    <div>
      <input type="text" ref={inputRef}/>
      <button onClick={handleSubmitLetter}>Submit</button>
    </div>
  );
}

export default App;
