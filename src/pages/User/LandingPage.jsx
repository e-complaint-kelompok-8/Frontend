import React from "react";
import useAuthStore from "@stores/useAuthStore";
import { jwtDecode } from "jwt-decode";

export default function LandingPage() {
  const { token, getUserIdFromToken } = useAuthStore();
  console.log(getUserIdFromToken());

  // getUserById(getUserIdFromToken)

  return <div>Landing User</div>;
}
