import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";
import { LogOut } from "lucide-react";
import { Button } from "./ui/Button";

const NavbarUser = () => {
  const { data: session } = useSession();

  const getInitials = (name?: string | null, email?: string | null) => {
    const source = (name && name.trim()) || (email && email.trim()) || "";
    if (!source) return "U";
    const parts = source
      .replace(/@.*$/, "")
      .split(/[\s._-]+/)
      .filter(Boolean);
    const first = parts[0]?.[0] || "U";
    const second = parts.length > 1 ? parts[1]?.[0] : "";
    return (first + second).toUpperCase();
  };

  const handleSignOut = () => {
    signOut();
  };

  if (!session) {
    return (
      <Button onClick={() => signIn()} variant="outline">
        Sign in
      </Button>
    );
  }

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-full w-14 h-14 p-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <Avatar className="w-14 h-14">
              {session.user?.image && (
                <AvatarImage
                  src={session.user.image}
                  alt={session.user?.name || session.user?.email || "User"}
                />
              )}
              <AvatarFallback>
                {getInitials(
                  session.user?.name ?? null,
                  session.user?.email ?? null
                )}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NavbarUser;
