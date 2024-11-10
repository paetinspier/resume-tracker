import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  loginWithEmailAndPassword,
  signupWithEmailAndPassword,
} from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";

export default function Authentication() {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [viewPassword, setViewPassword] = useState<boolean>(false);
  const [login, setLogin] = useState<boolean>(false);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleAuthentication = async () => {
    setLoading(true);
    try {
      let result: User | undefined;
      if (!email || !password) return;
      if (login) {
        result = await loginWithEmailAndPassword(email, password);
      } else {
        result = await signupWithEmailAndPassword(email, password);
      }
      if (result?.uid) {
        router.push("/portal/applications");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (login) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <div>welcome back to resume.tracker</div>
        <Card className="w-[350px] mt-24">
          <CardHeader>
            <div className="w-full flex justify-between items-center">
              <CardTitle>Login</CardTitle>
              <Button onClick={() => setLogin(false)} variant={"link"}>
                Sign up
              </Button>
            </div>
            <CardDescription>
              Login to continue tracking you job applications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  placeholder="example@mail.com"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative flex justify-center items-center">
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    type={viewPassword ? "text" : "password"}
                  />
                  <Button
                    onClick={() => setViewPassword(!viewPassword)}
                    variant={"ghost"}
                    className="absolute top-0 bottom-0 m-auto right-0"
                  >
                    {viewPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleAuthentication} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  } else {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <div>welcome to resume.tracker</div>
        <Card className="w-[350px] mt-24">
          <CardHeader>
            <div className="w-full flex justify-between items-center">
              <CardTitle>Create account</CardTitle>
              <Button onClick={() => setLogin(true)} variant={"link"}>
                Login
              </Button>
            </div>
            <CardDescription>
              Create an account to start tracking you job applications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  placeholder="example@mail.com"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative flex justify-center items-center">
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    placeholder="Pword123"
                    type={viewPassword ? "text" : "password"}
                  />
                  <Button
                    onClick={() => setViewPassword(!viewPassword)}
                    variant={"ghost"}
                    className="absolute top-0 bottom-0 m-auto right-0"
                  >
                    {viewPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleAuthentication} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Creating..." : "Create"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
}
