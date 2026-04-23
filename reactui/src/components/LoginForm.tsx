import { useActionState, useRef, useState } from "react";
import axios from "axios";

interface LoginResponse {
  access_token: string;
}

interface LoginState {
  error: string | null;
  token: string | null;
}

const LoginForm = () => {
  const [token, setToken] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // React 19 useActionState for form handling with automatic pending state
  const [state, submitAction, isPending] = useActionState<
    LoginState,
    FormData
  >(async (_prevState: LoginState, formData: FormData) => {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    // Validation
    if (!username?.trim() || !password?.trim()) {
      return {
        error: "Username and password are required",
        token: null,
      };
    }

    try {
      const response = await axios.post<LoginResponse>(
        "http://localhost:8000/login",
        { username, password }
      );

      const accessToken = response.data.access_token;
      setToken(accessToken);

      // Reset form on success
      formRef.current?.reset();

      return {
        error: null,
        token: accessToken,
      };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message || "Authentication failed";
        const statusCode = err.response?.status;
        console.error(`Error: ${errorMessage}, Status Code: ${statusCode}`);

        return {
          error: errorMessage,
          token: null,
        };
      }

      console.error("Unexpected error:", err);
      return {
        error: "An unexpected error occurred",
        token: null,
      };
    }
  }, {
    error: null,
    token: null,
  });

  return (
    <div>
      <h2>Login</h2>
      <form action={submitAction} ref={formRef}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            disabled={isPending}
            aria-describedby={state.error ? "error-message" : undefined}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            disabled={isPending}
            aria-describedby={state.error ? "error-message" : undefined}
          />
        </div>
        <button type="submit" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </button>
      </form>

      {state.error && (
        <p id="error-message" role="alert" style={{ color: "red" }}>
          {state.error}
        </p>
      )}

      {token && (
        <div>
          <p style={{ color: "green" }}>✓ Login successful!</p>
          <p>Access Token: {token}</p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
