import React, { useState, ChangeEvent } from "react";
import axios from "axios";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [token, setToken] = useState<string>("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      const response = await axios.post<{ access_token: string }>(
        "http://localhost:8000/login",
        {
          username,
          password,
        }
      );
      setToken(response.data.access_token);
      setError("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message || "Unknown error occurred";
        const statusCode = err.response?.status ?? "No status code";
        console.error(`Error: ${errorMessage}, Status Code: ${statusCode}`);
        setError(errorMessage);
      } else {
        console.error("An unexpected error occurred:", err);
        setError("An unexpected error occurred");
      }
      setToken("");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {token && <p>Access Token: {token}</p>}
    </div>
  );
};

export default LoginForm;
