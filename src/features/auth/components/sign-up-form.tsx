import InputIcon from "@/components/custom/InputIcon";
import { signUpSchema, type SignUp } from "@/types/auth";
import {
  AtSignIcon,
  Loader2Icon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "lucide-react";
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
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Props {
  onLoading: (status: boolean) => void;
}
const AuthSignUpForm = ({ onLoading }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<SignUp>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: SignUp) => {
    const signUpToast = toast.loading("Signing Up...");
    await authClient.signUp.email(
      {
        email: values.email,
        name: values.name,
        password: values.password,
      },
      {
        onRequest: () => {
          setIsLoading(true);
          onLoading(true);
        },
        onSuccess: () => {
          toast.success(`Successfully signed up your account.`);
          form.reset();
        },
        onError: (error) => {
          toast.error(`Error signing up your account: ${error.error.message}`);
        },
        onResponse: () => {
          toast.dismiss(signUpToast);
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
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <InputIcon
                  disabled={isLoading}
                  required
                  icon={UserIcon}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          {isLoading ? "Signing Up..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
};

export default AuthSignUpForm;
