import { useState } from "react";

export default function Home() {
  const [response, setResponse] = useState("");

  const callApi = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();

      // Pick common fields if available
      if (data.value) setResponse(data.value); // For Chuck Norris
      else if (data.activity) setResponse(data.activity); // For Bored API
      else if (data.title) setResponse(data.title); // For JSONPlaceholder
      else setResponse(JSON.stringify(data)); // Fallback
    } catch (err) {
      setResponse(`Error: ${err.message}`);
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Simple API Demo</h1>

      <ol style={{ lineHeight: "2.2" }}>
        <li>
          <button onClick={() => callApi("https://api.chucknorris.io/jokes/random")}>
            Click here to hit Chuck Norris API
          </button>
        </li>
        <li>
          <button onClick={() => callApi("https://jsonplaceholder.typicode.com/todos/1")}>
            Click here to hit JSONPlaceholder
          </button>
        </li>
        <li>
          <button onClick={() => callApi("https://www.boredapi.com/api/activity")}>
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

