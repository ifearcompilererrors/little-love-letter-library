import React, {useState, useEffect, useRef} from 'react';
import './App.css';

const fetchOpts = {
  mode: 'cors',
  cache: 'no-cache',
  credentials: 'same-origin',
};

// fetch all submissions
const fetchSubmissions = async () => {
  try {
    const response = await fetch('submissions', {
      method: 'GET',
      ...fetchOpts,
    });

    if (!response.ok) {
      throw Error(response.statusText);
    }

    const submissions = await response.json()
    return submissions;
  } catch (e) {
    console.error('Something went wrong while fetching or formatting data', e);
    return [];
  }
}

function App() {
  const inputRef = useRef();
  const loadingRef = useRef();
  const [allSubmissions, setAllSubmissions] = useState(null);

  // fetch gallery of submissions on component load
  useEffect(() => {
    if(loadingRef.current) return;

    const asyncFetchSubmissions = async () => {
      try {
        loadingRef.current = true;
        const letters = await fetchSubmissions();

        setAllSubmissions(letters)
      } catch (e) {
        console.error('Could not fetch submissions:', e);
      }
    }
    asyncFetchSubmissions();
  }, []);

  const handleSubmit = async () => {
    const text = inputRef.current.value.trim();
    if (!text.length) return;

    try {
      // send submission to backend
      const response = await fetch('/submissions', {
        method: 'POST',
        ...fetchOpts,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: text }),
      })

      if(!response.ok) {
        throw Error(response.statusText)
      }

      const submissions = await response.json();

      setAllSubmissions(prev => [...prev, ...submissions]);
    inputRef.current.value = ''; // reset input value
    } catch (e) {
      console.error('Could not handle submit:', e);
    }
  };

  return (
    <div>
      <input type="text" ref={inputRef}/>
      <button onClick={handleSubmit}>Submit</button>
      <ul>
        {allSubmissions?.map((letter, i) => <li key={`${letter.slice(0,5)}${i}`}>{letter}</li>)}
      </ul>
    </div>
  );
}

export default App;
