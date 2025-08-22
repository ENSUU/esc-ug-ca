import Navbar from "../components/Navbar";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { loginUser } from "../api/auth";
import { useState, useContext, useEffect } from "react";
import { useToken } from "../context/TokenContext";

const LoginPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { token, login } = useToken();

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["loginUser", usernameOrEmail, password],
    queryFn: () => loginUser(usernameOrEmail, password),
    retry: 0,
    enabled: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate({ to: "/" });
    }

    if (!isPending) {
      if (isError) {
        setErrorMessage(error.message);
      } else {
        const { token } = data;
        login(token);
      }
    }
  }, [isPending, data, errorMessage, token]);

  const handleLogin = (e) => {
    e.preventDefault();
    const loginForm = e.target;
    if (!loginForm.checkValidity()) {
      loginForm.reportValidity();
      return;
    }
    refetch();
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
          Log In
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
