import Navbar from "../components/Navbar";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth";
import { useState } from "react";
import { useToken } from "../context/TokenContext";

const LoginPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useToken();

  const mutation = useMutation({
    mutationFn: () => loginUser(usernameOrEmail, password),
    onSuccess: (data) => {
      const { token } = data;
      login(token);
      navigate({ to: "/" });
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const loginForm = e.target;
    if (!loginForm.checkValidity()) {
      loginForm.reportValidity();
      return;
    }
    mutation.mutate({ usernameOrEmail, password });
  };

  return (
    <div className="h-dvh flex flex-col">
      <Navbar />
      <main className="w-full md:w-[600px] m-auto flex flex-col gap-4 p-4">
        <h1 className="text-[3rem] font-bold text-center">Log In</h1>
        <form
          id="loginForm"
          onSubmit={handleLogin}
          className="flex flex-col gap-4 my-4"
        >
          <label htmlFor="username">Username/Email</label>
          <input
            id="username"
            type="text"
            className="border-black !border-b-1"
            required
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="border-black !border-b-1"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </form>
        {errorMessage != "" && (
          <p className="text-red-600 text-center">{errorMessage}</p>
        )}
        <button
          className="w-full m-auto px-8 py-2 font-bold rounded-md bg-black text-white hover:scale-[1.1]"
          type="submit"
          form="loginForm"
        >
          {mutation.isPending ? "Logging in..." : "Log In"}
        </button>
        <p>
          Don't have an account? Create an account{" "}
          <Link to="/signup" className="text-sky-400">
            here.
          </Link>
        </p>
      </main>
    </div>
  );
};

export default LoginPage;
