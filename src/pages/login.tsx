"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Film, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useAppDispatch } from "../store/hook";
import { loginUser } from "../store/userReducer";

export default function Login() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
  });
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(loginUser(userInfo));
    setIsLoading(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full flex -mt-10 items-center justify-center bg-[#0a0a0c]">
      <Card className="w-full max-w-md mx-4 border-purple-900 bg-gradient-to-br from-purple-950/50 to-black">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Film className="h-8 w-8 text-purple-500" />
            <span className="text-2xl font-bold text-purple-100">MovieDB</span>
          </div>
          <CardTitle className="text-2xl text-center text-purple-100"></CardTitle>
          <CardDescription className="text-center text-purple-300">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-purple-100">
                Username
              </Label>
              <Input
                id="username"
                value={userInfo.username}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, username: e.target.value })
                }
                placeholder="Enter your username"
                required
                className="bg-purple-950/30 border-purple-800 text-purple-100 placeholder:text-purple-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-purple-100">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={userInfo.password}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, password: e.target.value })
                }
                placeholder="Enter your password"
                required
                className="bg-purple-950/30 border-purple-800 text-purple-100 placeholder:text-purple-400"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-purple-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
