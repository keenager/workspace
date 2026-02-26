"use client";

import { useActionState } from "react";
import { login } from "../actions/auth";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, { error: "" });
  return (
    <form action={formAction}>
      <input type="email" name="email" className="border" required></input>
      <input
        type="password"
        name="password"
        className="border"
        required
      ></input>
      {state.error && <p>{state.error}</p>}
      <button type="submit" disabled={isPending}>
        로그인
      </button>
    </form>
  );
}
