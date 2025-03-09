import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const fetchOpts = {
  mode: "cors",
  cache: "no-cache",
  credentials: "same-origin",
};

// fetch all submissions
const fetchSubmissions = async () => {
  try {
    const response = await fetch("submissions", {
      method: "GET",
      ...fetchOpts,
    });

    if (!response.ok) {
      throw Error(response.statusText);
    }

    const submissions = await response.json();
    return submissions;
  } catch (e) {
    console.error("Something went wrong while fetching or formatting data", e);
    return [];
  }
};

function App() {
  const inputRef = useRef();
  const loadingRef = useRef(false);
  const [allSubmissions, setAllSubmissions] = useState(null);

  // fetch gallery of submissions on component load
  useEffect(() => {
    if (loadingRef.current || allSubmissions !== null) return;

    const asyncFetchSubmissions = async () => {
      try {
        loadingRef.current = true;
        const letters = await fetchSubmissions();

        setAllSubmissions(letters);
      } catch (e) {
        console.error("Could not fetch submissions:", e);
      }
    };
    asyncFetchSubmissions();
  }, []);

  const handleSubmit = async () => {
    const text = inputRef.current.value.trim();
    if (!text.length) return;

    try {
      // send submission to backend
      const response = await fetch("/submissions", {
        method: "POST",
        ...fetchOpts,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: text }),
      });

      if (!response.ok) {
        throw Error(response.statusText);
      }

      const submissions = await response.json();

      setAllSubmissions((prev) => [...prev, ...submissions]);
      inputRef.current.value = ""; // reset input value
    } catch (e) {
      console.error("Could not handle submit:", e);
    }
  };

  return (
    <div className="love-letter-library">
      <section style={{ display: "flex" }}>
        <div className="submit-form-container">
          <div className="submit-form">
            <h1 className="monsieur-la-doulaise-regular headline">
              Little Love Letter Library
            </h1>
            <h3 className="subhead">
              Send a love letter, read through our mailbox. Take the love you
              need and leave some for someone else!
            </h3>
            <input className="input" type="text" ref={inputRef} />
            <button className="button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
        <div className="letters">
          <ul>
            {allSubmissions?.map((letter, i) => (
              <div className="love-letter-container">
                <p key={`${letter.slice(0, 5)}${i}`}>{letter}</p>
              </div>
            ))}
          </ul>
        </div>
        <div className="accent">
          <iframe
            src="https://giphy.com/embed/CNhGTYOhBkRJS"
            width="250"
            height="150"
            frameBorder="0"
            class="giphy-embed"
            allowFullScreen
          ></iframe>
        </div>
      </section>
      <section className="footer">
        <p style={{ color: "#f7f7f7" }}>
          made with love by audrey valbuena and angelique de castro 💌
        </p>
        <p>
          <a
            href="https://giphy.com/gifs/transparent-gif-sparkly-pink-rose-CNhGTYOhBkRJS"
            style={{ color: "#f7f7f7" }}
          >
            via GIPHY
          </a>
        </p>
      </section>
    </div>
  );
}

export default App;
