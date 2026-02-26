import { getSession } from "@/lib/session";
import LoginForm from "./LoginForm";
import { logout } from "../actions/auth";

export default async function UserStatus() {
  const session = await getSession();

  if (session) {
    return (
      <div>
        {session.name} | <button onClick={logout}>로그아웃</button>
      </div>
    );
  } else {
    return <LoginForm />;
  }
}
