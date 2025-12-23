import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useProjectStore } from "../store/projectStore";
import { useNotificationStore } from "../store/notificationStore";
import { ImSpinner3 } from "react-icons/im";

function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const { getProjects, getContributions } = useProjectStore();
  const { getNotifications } = useNotificationStore();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      await getProjects();
      await getContributions();
      await getNotifications();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
    setEmail("");
    setPassword("");
  };
  return (
    <section className="h-[calc(100vh-44px)] flex justify-center items-center bg-linear-to-br from-black via-teal-900 to-blue-300">
      <div className="absolute rounded-2xl z-10">
        <div className="absolute w-full h-full border-2 border-dashed border-green-700 left-2 bottom-2 rounded-2xl -z-10"></div>
        <div className="flex flex-row">
          <div className="flex-1 bg-white/70 rounded-t-2xl"></div>
          <h2 className="text-center text-white text-2xl w-fit ml-auto px-4 pb-2 rounded-2xl">
            Login here!
          </h2>
        </div>
        <div className="w-[300px] p-4 sm:w-[400px] text-gray-700 bg-white/70 sm:p-8 pt-0 sm:pt-0 font-bold rounded-b-2xl rounded-r-2xl z-10">
          <form className="flex flex-col gap-4">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              placeholder="Email"
              className="border border-gray-300 outline-none hover:border-gray-400 p-2 rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              placeholder="Password"
              className="border border-gray-300 outline-none hover:border-gray-400 p-2 rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="block mx-auto text-green-700 bg-green-200 border-2 border-green-600 hover:bg-green-700 hover:text-white font-bold py-2 px-4 w-full rounded-full"
              onClick={handleClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin">
                  <ImSpinner3 />
                </div>
              ) : (
                "Login"
              )}
            </button>

            {error && <p className="text-center text-red-500">{error}</p>}
            <p className="text-center">
              Don't have an account?{" "}
              <Link to="/signup" className="text-cyan-400">
                Signup
              </Link>
            </p>
            
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;