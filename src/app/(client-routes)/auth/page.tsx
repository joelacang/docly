"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuthSignInForm from "@/features/auth/components/sign-in-form";
import AuthSignUpForm from "@/features/auth/components/sign-up-form";
import { cn } from "@/lib/utils";
import { useState } from "react";

const AuthPage = () => {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="via-green-3 00 flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-sky-50 to-blue-500">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-primary text-center text-4xl">
            docly
          </CardTitle>
          <CardDescription className="text-center text-base">
            {mode === "sign-in"
              ? " Sign in to you account to continue "
              : "Fill in your details to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === "sign-in" ? (
            <AuthSignInForm onLoading={setIsLoading} />
          ) : (
            <AuthSignUpForm onLoading={setIsLoading} />
          )}
        </CardContent>
        <CardFooter className="flex w-full items-center justify-center">
          {mode === "sign-up" ? (
            <p className="text-center">
              Already have an account?{" "}
              <span
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "size-fit cursor-pointer px-2 text-base",
                )}
                onClick={() => setMode("sign-in")}
              >
                Sign In
              </span>
            </p>
          ) : (
            <p>
              Don&apos;t have an account?{" "}
              <span
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "size-fit cursor-pointer px-2 text-base",
                )}
                onClick={() => setMode("sign-up")}
              >
                Sign Up
              </span>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;
