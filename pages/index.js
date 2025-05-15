import { useState } from "react";

export default function Home() {
  const [response, setResponse] = useState("");

  const callApi = async (url, label) => {
    console.log(`[LOG] Starting API call to ${label} (${url})`);

    try {
      const res = await fetch(url);
      const data = await res.json();

      // Pick commonly structured fields
      let message = '';
      if (data.value) message = data.value;             // Chuck Norris API
      else if (data.activity) message = data.activity;  // Bored API
      else if (data.title) message = data.title;        // JSONPlaceholder
      else message = JSON.stringify(data);

      console.log(`[LOG] Received response from ${label}: ${message}`);
      setResponse(message);
    } catch (err) {
      const errorMsg = `Error from ${label}: ${err.message}`;
      console.error(`[ERROR] ${errorMsg}`);
      setResponse(errorMsg);
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Simple API Demo with Logs</h1>

      <ol style={{ lineHeight: "2.2" }}>
        <li>
          <button
            onClick={() =>
              callApi("https://api.chucknorris.io/jokes/random", "Chuck Norris API")
            }
          >
            Click here to hit Chuck Norris API
          </button>
        </li>
        <li>
          <button
            onClick={() =>
              callApi("https://jsonplaceholder.typicode.com/todos/1", "JSONPlaceholder")
            }
          >
            Click here to hit JSONPlaceholder
          </button>
        </li>
        <li>
          <button
            onClick={() =>
              callApi("https://www.boredapi.com/api/activity", "Bored API")
            }
          >
            Click here to hit Bored API
          </button>
        </li>
      </ol>

      <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ccc" }}>
        <h3>API Response:</h3>
        <pre>{response}</pre>
      </div>
    </div>
  );
}
