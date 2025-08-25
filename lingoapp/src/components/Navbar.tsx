import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Bot } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo / Title */}
        <div className="flex items-center gap-2">
          <img src = "../../logos/lingologo.png" className="h-20 w-auto"/>
          
        </div>

        {/* Nav Links */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Button variant="ghost" size="sm">Chat</Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button variant="ghost" size="sm">Docs</Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button variant="ghost" size="sm">Settings</Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
