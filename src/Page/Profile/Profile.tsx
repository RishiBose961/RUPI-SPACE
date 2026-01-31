import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { useSelector } from "react-redux";

export default function Profile() {
  const { user, isAuthenticated } = useSelector(
    (state: {
      auth: {
        isAuthenticated: boolean;
        user: { token: string; _id: string; name: string; avatar: string };
      };
    }) => state.auth
  );



  return (
    <Card>
      <div className="flex items-center justify-center">
        <img
          src={user?.avatar}
          alt="Event cover"
          className=" rounded-full size-48 object-cover"
        />
      </div>

      <CardHeader>
        <CardAction>
          {isAuthenticated && <Badge variant="secondary">Logout</Badge>}
        </CardAction>
        <CardTitle>Welcome</CardTitle>
        <CardDescription>
          {user?.name}
        </CardDescription>
      </CardHeader>


    </Card>
  )
}
