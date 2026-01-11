import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiUser } from "react-icons/bi";
import { FcInvite } from "react-icons/fc";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useNotificationStore } from "../../store/notificationStore";
import { useProjectStore } from "../../store/projectStore";
import { IoCloseSharp } from "react-icons/io5";
import icon from "../../assets/project.svg";

function Navbar() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const [notificationBarOpen, setNotificationBarOpen] = useState(false);
  const { active, resetNotifications, notifications, getNotifications } =
    useNotificationStore();
  const [popUp, setPopUp] = useState(false);
  const [projectDetails, setProjectDetails] = useState(null);
  const { acceptProjectInvite, rejectProjectInvite, getContributions } =
    useProjectStore();
  const handleLogout = async () => {
    setNotificationBarOpen(false);
    await logout();
    resetNotifications();
    navigate("/login", { replace: true });
  };

  const handleAccept = async () => {
    setPopUp(false);
    setNotificationBarOpen(false);
    try {
      await acceptProjectInvite(projectDetails._id, projectDetails.inviteId);
      await getNotifications();
      await getContributions();
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async () => {
    setPopUp(false);
    setNotificationBarOpen(false);
    try {
      console.log(projectDetails);
      await rejectProjectInvite(projectDetails._id, projectDetails.inviteId);
      await getNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <header className="fixed top-0 z-50 w-screen bg-slate-200 text-slate-900 py-2">
        <nav className="relative w-full max-w-7xl mx-auto flex flex-row justify-between py-2 px-4 lg:px-6">
          <div className="my-auto">
            <Link to="/">
              <h1 className="text-2xl font-bold">DASHBOARD</h1>
            </Link>
          </div>

          {user && (
            <div className="flex flex-row gap-4 my-auto">
              <div
                className="my-auto relative hover:cursor-pointer"
                onClick={() => setNotificationBarOpen(!notificationBarOpen)}
              >
                <FcInvite />
                {active > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {active}
                  </span>
                )}
              </div>
              <div className="my-auto flex flex-row items-center bg-slate-100 rounded-full px-2">
                <BiUser />
                <p className="ml-2 text-slate-500 font-bold">{user.name}</p>
              </div>
              <div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-700 text-white px-4 rounded-sm hover:rounded-full transition-all duration-300 ease-in-out"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
          {notificationBarOpen && (
            <div className="absolute top-16 right-0 mr-4 lg:mr-6 flex flex-col gap-2 text-slate-500 max-h-[calc(100vh-64px)] overflow-y-auto rounded-2xl">
              {notifications.length > 0 ? (
                notifications.map((noti) => (
                  <div
                    key={noti._id}
                    className="p-4 border-4 rounded-2xl border-gray-300 bg-white flex flex-col"
                  >
                    <h3 className="text-lg text-slate-900 font-bold">
                      {noti.title}
                    </h3>
                    <p>{noti.message}</p>
                    <button
                      className="text-cyan-500 hover:cursor-pointer w-fit font-bold"
                      onClick={() => {
                        if (!popUp)
                          setProjectDetails({
                            title: noti.title,
                            description: noti.message,
                            _id: noti.project,
                            inviteId: noti._id,
                          });
                        setPopUp(true);
                      }}
                    >
                      View Invite
                    </button>
                    <Link
                      to={`/projects/${noti.project}`}
                      className="text-cyan-500 hover:cursor-pointer font-bold"
                    >
                      View Project
                    </Link>
                  </div>
                ))
              ) : (
                <p className="min-w-68">No Invites</p>
              )}
            </div>
          )}
          <div
            className={`fixed top-11 left-0 w-screen h-screen bg-white/50 ${
              popUp ? "flex" : "hidden"
            }`}
          >
            <div
              className={`relative p-4 w-68 md:w-3xl bg-white border-4 border-slate-200 rounded-md text-black mx-auto my-auto gap-4`}
            >
              <div className="absolute w-full h-full border-4 border-dashed top-2 left-2 -z-10 border-slate-500"></div>
              <h3 className="text-xl text-slate-500">
                {projectDetails?.title}
              </h3>

              <div
                className="absolute top-4 right-4 text-red-500 hover:cursor-pointer "
                onClick={() => setPopUp(false)}
              >
                <IoCloseSharp />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div>
                  <img src={icon} alt="proj-icon" />
                </div>
                <div className="flex flex-col gap-4 my-auto">
                  <p className="text-slate-900 font-bold">
                    {projectDetails?.description}
                  </p>
                  <div className="flex flex-row justify-between items-center text-white">
                    <button
                      className="bg-cyan-100 text-slate-500 py-1 px-4 rounded-full hover:cursor-pointer hover:bg-cyan-700 hover:text-white"
                      onClick={handleAccept}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-100 text-slate-500 py-1 px-4 rounded-full hover:cursor-pointer hover:bg-red-600 hover:text-white"
                      onClick={handleReject}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
