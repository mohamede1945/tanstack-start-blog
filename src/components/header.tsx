import { Logo } from "./logo";
import { Nav } from "./nav";

export function Header() {
  return (
    <header className="w-full">
      <div className="flex items-start gap-6 py-6 sm:items-center">
        <Logo />
        <Nav />
      </div>
    </header>
  );
}
