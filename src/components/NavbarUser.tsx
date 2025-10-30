import { signIn, signOut, useSession } from "next-auth/react";
import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import { ListItemIcon, Menu, MenuItem } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import Logout from "@mui/icons-material/Logout";
import Button from "./ui/Button";

const NavbarUser = () => {
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    handleClose();
    signOut();
  };

  if (!session) {
    return (
      <Button onClick={() => signIn()} variant="outlined" color="inherit">
        Sign in
      </Button>
    );
  }

  return (
    <div className="flex items-center">
      <Button
        id="user-menu-button"
        aria-controls={open ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        className="rounded-full w-14 h-14 p-0"
      >
        <Avatar
          alt={session.user?.name || session.user?.email || "User"}
          src={session.user?.image || undefined}
        >
          {!session.user?.image &&
            getInitials(
              session.user?.name ?? null,
              session.user?.email ?? null
            )}
        </Avatar>
      </Button>

      <Menu
        anchorEl={anchorEl}
        id="user-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
};

export default NavbarUser;
