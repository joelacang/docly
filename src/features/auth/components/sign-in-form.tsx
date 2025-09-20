import InputIcon from "@/components/custom/InputIcon";
import { signInSchema, type SignIn } from "@/types/auth";
import { Loader2Icon, LockIcon, MailIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  onLoading: (status: boolean) => void;
}
const AuthSignInForm = ({ onLoading }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignIn>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: SignIn) => {
    const signInToast = toast.loading("Signing In...");

    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/",
      },
      {
        onRequest: () => {
          setIsLoading(true);
          onLoading(true);
        },
        onSuccess: () => {
          toast.success(`Successfully signed in.`);
          form.reset();
          router.push("/");
        },
        onError: (error) => {
          toast.error(
            `Error signing in to your account: ${error.error.message}`,
          );
        },
        onResponse: () => {
          toast.dismiss(signInToast);
          onLoading(false);
          setIsLoading(false);
        },
      },
    );
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <InputIcon
                  disabled={isLoading}
                  required
                  icon={MailIcon}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <InputIcon
                  disabled={isLoading}
                  required
                  icon={LockIcon}
                  {...field}
                  showPasswordBtn
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid || isLoading}
        >
          {isLoading && <Loader2Icon className="mr-2 animate-spin" />}
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
};

export default AuthSignInForm;
