import { logoutUserAction } from "@/slice/authSlice";
import { LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

export default function Profile() {
  const { user } = useSelector(
    (state: {
      auth: {
        isAuthenticated: boolean;
        user: { token: string; _id: string; name: string; avatar: string; email: string };
      };
    }) => state.auth
  );

    const dispatch = useDispatch();


  const handleLogout = () => {

    dispatch(logoutUserAction());
    window.location.replace("/login");
  };




  return (
    <div className="flex justify-between items-center bg-card p-3 rounded-xl">
      <div className="flex items-center  gap-3">
        <div>
          <img src={user.avatar} alt={user.name} className="size-14 rounded-full" />
        </div>
        <div>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>

      </div>
        <LogOut onClick={handleLogout}/>
    </div>

  )
}
