import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Theme = "system" | "dark" | "light";

const labels: Record<Theme, string> = {
  system: "Auto",
  dark: "Dark",
  light: "Light",
};

const themeOrder: Theme[] = ["system", "dark", "light"];

export function ThemeToggleButton() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = (mounted && theme ? theme : "system") as Theme;
  const iconTheme = mounted ? resolvedTheme : "light";
  const label = labels[currentTheme ?? "system"];
  const currentIndex = themeOrder.indexOf(currentTheme ?? "system");
  const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length] ?? "system";

  return (
    <Button
      variant="outline"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Theme: ${label}. Switch to ${labels[nextTheme]}.`}
      title={`Theme: ${label}`}
    >
      {label}
      <span className="inline-flex" aria-hidden="true">
        {currentTheme === "system" ? (
          <SunMoon size={16} />
        ) : iconTheme === "dark" ? (
          <Moon size={16} />
        ) : (
          <Sun size={16} />
        )}
      </span>
    </Button>
  );
}
