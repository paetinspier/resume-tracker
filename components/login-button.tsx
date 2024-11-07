import { useAuth } from "@/lib/AuthContext";
import { loginWithGoogle, logout } from "@/lib/firebase/auth";
import { Button } from "./ui/button";

export default function LoginButton() {
  const { user } = useAuth();

  return user ? (
    <Button onClick={logout}>Logout</Button>
  ) : (
    <Button onClick={loginWithGoogle}>Login with Google</Button>
  );
}
