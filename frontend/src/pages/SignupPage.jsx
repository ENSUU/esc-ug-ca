import Navbar from "../components/Navbar";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../api/users";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => createUser(email, username, password),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      navigate({ to: "/login" });
    },
    onError: (error) => {
      console.log(error);
      setErrorMessage(error.message);
      console.error(error.message);
    },
  });

  const navigate = useNavigate();

  const handleCreateUser = (e) => {
    e.preventDefault();

    const signUpForm = e.target;
    if (!signUpForm.checkValidity()) {
      signUpForm.reportValidity();
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
    } else {
      mutation.mutate({ email, username, password });
    }
  };

  return (
    <div className="h-dvh flex flex-col">
      <Navbar />
      <main className="w-full md:w-[600px] m-auto flex flex-col gap-4 p-4">
        <h1 className="text-[3rem] font-bold text-center">Sign Up</h1>
        <form
          id="signUpForm"
          className="flex flex-col gap-4 my-4"
          onSubmit={handleCreateUser}
        >
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="border-black !border-b-1"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            className="border-black !border-b-1"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="border-black !border-b-1"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            className="border-black !border-b-1"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </form>
        {errorMessage != "" && (
          <p className="text-red-600 text-center">{errorMessage}</p>
        )}
        <button
          className="w-full m-auto px-8 py-2 font-bold rounded-md bg-black text-white hover:scale-[1.1]"
          type="submit"
          form="signUpForm"
        >
          Create Account
        </button>
        <p>
          Already have an account? Log in{" "}
          <Link to="/login" className="text-sky-400">
            here.
          </Link>
        </p>
      </main>
    </div>
  );
};

export default SignupPage;
