"use client";
import LoadingMessage from "@/components/messages/loading-message";
import Logo from "@/components/logo";
import { QueryStateHandler } from "@/components/query-state-handler";
import { api } from "@/trpc/react";
import { SIZE } from "@/types";
import type { User } from "@/types/user";
import { Divide } from "lucide-react";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";

type AuthContext = {
  loggedUser: User;
};

const AuthContext = createContext<AuthContext | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) throw new Error("useAuth must be used within AuthProvider");

  return ctx;
};

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const router = useRouter();
  const {
    data: loggedUser,
    isLoading,
    isError,
    error,
  } = api.user.getLoggedUser.useQuery();

  useEffect(() => {
    if (!isLoading) {
      if (!loggedUser) {
        router.push("/auth");
      }
    }
  }, [isLoading, loggedUser, router]);

  return (
    <QueryStateHandler
      data={loggedUser}
      isLoading={isLoading}
      isError={isError}
      loadingLabel={<LoadingMessage message="Checking Your Account..." />}
      errorTitle="Error loading your account"
      errorMessage={error ? error.message : "An unknown error occurred."}
    >
      {(loggedUser) => (
        <AuthContext.Provider value={{ loggedUser }}>
          {children}
        </AuthContext.Provider>
      )}
    </QueryStateHandler>
  );
};
