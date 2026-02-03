import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link
      to="/"
      className="inline-flex items-center font-semibold text-foreground text-xl tracking-wide"
    >
      TanStack Start Blog
    </Link>
  );
}
