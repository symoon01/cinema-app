import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return <div style={{ justifyContent: "center", alignItems: "center", display: "flex", paddingTop: "20px" }}><SignIn signUpUrl="/register"/></div>;
}
