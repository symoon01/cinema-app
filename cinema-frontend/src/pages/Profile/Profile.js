import { UserProfile } from "@clerk/clerk-react";

export default function Profile() {
  return <div style={{ justifyContent: "center", alignItems: "center", display: "flex", paddingTop: "20px" }}><UserProfile /></div>;
}