import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { ImSpinner3 } from "react-icons/im";

function Signup() {
  const navigate = useNavigate();
  const { signup, isLoading, error } = useAuthStore();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, name);
      navigate("/");
    } catch (error) {
      console.log(error);
      alert(error);
    }
    setEmail("");
    setPassword("");
    setName("");
  };
  return (
    <section className="h-[calc(100vh-64px)] flex justify-center items-center bg-linear-to-br from-black via-teal-900 to-blue-300 text-gray-700">
      <div className="rounded-2xl absolute z-10">
        <div className="absolute w-full h-full border-2 border-dashed border-green-700 left-2 bottom-2 rounded-2xl -z-10"></div>
        <div className="flex flex-row">
          <div className="flex-1 bg-white/70 rounded-t-2xl"></div>
          <h2 className="ml-auto w-fit text-white text-2xl px-4 pb-2">
            SignUp here!
          </h2>
        </div>
        <div className="w-[300px] p-4 sm:w-[400px] bg-white/70 text-gray-700 sm:p-8 pt-0 sm:pt-0 font-bold rounded-b-2xl rounded-r-2xl">
          {/* {
          <p>
            isAuthenticated: {isAuthenticated} user: {JSON.stringify(user)}
          </p>
        } */}
          <form className="flex flex-col gap-4">
            <label htmlFor="name" className="">
              Name:
            </label>
            <input
              type="text"
              placeholder="Name"
              className="p-2 rounded-xl border border-gray-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              placeholder="Email"
              className="p-2 rounded-xl border border-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              placeholder="Password"
              className="p-2 rounded-xl border border-gray-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="block mx-auto text-green-700 bg-green-200 border-2 border-green-600 hover:bg-green-700 hover:text-white font-bold py-2 px-4 w-full rounded-full"
              onClick={handleClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <div>
                  <ImSpinner3 className="animate-spin" />
                </div>
              ) : (
                "Sign Up"
              )}
            </button>
            {error && <p className="text-center text-red-500">{error}</p>}
            <p className="text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-600">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Signup;
