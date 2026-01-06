import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiUser } from "react-icons/bi";
import { FaRegBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useNotificationStore } from "../../store/notificationStore";
import { useProjectStore } from "../../store/projectStore";
import { IoCloseSharp } from "react-icons/io5";

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
            <div className="flex flex-row gap-4">
              <div
                className="my-auto relative hover:cursor-pointer"
                onClick={() => setNotificationBarOpen(!notificationBarOpen)}
              >
                <FaRegBell />
                {active > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {active}
                  </span>
                )}
              </div>
              <div className="my-auto">
                <BiUser />
              </div>
              <div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-700 text-white px-4 rounded-full"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
          {notificationBarOpen && (
            <div className="absolute top-11 right-0 p-4 mr-4 lg:mr-6 flex flex-col gap-2 text-slate-500 bg-slate-200 max-h-[calc(100vh-56px)] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((noti) => (
                  <div
                    key={noti._id}
                    className="p-4 border border-dashed rounded-2xl border-gray-300 flex flex-col"
                  >
                    <h3 className="text-slate-500 font-bold">{noti.title}</h3>
                    <p>{noti.message}</p>
                    <button
                      className="text-cyan-500 hover:cursor-pointer w-fit"
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
                      className="text-cyan-500 hover:cursor-pointer"
                    >
                      View Project
                    </Link>
                  </div>
                ))
              ) : (
                <p className="">No notifications</p>
              )}
            </div>
          )}
          <div
            className={`fixed top-11 left-0 w-screen h-screen bg-white/50 ${
              popUp ? "flex" : "hidden"
            }`}
          >
            <div
              className={`relative p-4 w-68 h-96 bg-gray-100 rounded-md text-black mx-auto my-auto flex flex-col gap-4`}
            >
              <div
                className="absolute top-4 right-4 text-red-500 hover:cursor-pointer "
                onClick={() => setPopUp(false)}
              >
                <IoCloseSharp />
              </div>
              <h3 className="text-xl text-amber-600 font-bold">
                {projectDetails?.title}
              </h3>
              <p>{projectDetails?.description}</p>
              <div className="flex flex-row justify-between text-white">
                <button
                  className="bg-green-500 py-1 px-4 rounded-full hover:cursor-pointer hover:bg-green-600"
                  onClick={handleAccept}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 py-1 px-4 rounded-full hover:cursor-pointer hover:bg-red-600"
                  onClick={handleReject}
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
