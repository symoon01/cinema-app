import { SignUp } from "@clerk/clerk-react";

export default function Register() {
  return <div style={{ justifyContent: "center", alignItems: "center", display: "flex", paddingTop: "20px" }}><SignUp signInUrl="/login"/></div>;
}
