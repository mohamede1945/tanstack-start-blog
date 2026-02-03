import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export function Bio() {
  return (
    <Card className="bg-card/60">
      <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Avatar className="size-[92px] border border-border/60">
          <AvatarImage src="/assets/mohamed.webp" alt="Headshot of Mohamed Afifi" />
          <AvatarFallback>YN</AvatarFallback>
        </Avatar>
        <div className="text-base text-muted-foreground">
          <p>
            Hi, I'm <strong>Mohamed Afifi</strong>. I'm a mobile engineer and founder based in
            Toronto 🇨🇦. I write deep dives and working systems for developers who value quality,
            iteration speed, and scalable codebases.
          </p>
          <br />
          <ul className="list-inside list-disc">
            <li>
              <a href="https://mafifi.dev" className="text-primary underline">
                mafifi.dev
              </a>
            </li>
            <li>
              <a href="mailto:me@mafifi.dev" className="text-primary underline">
                me@mafifi.dev
              </a>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
