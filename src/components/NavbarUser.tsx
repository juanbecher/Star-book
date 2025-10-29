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

  if (!session.user?.image) {
    return (
      <Button onClick={() => signOut()} variant="outlined" color="inherit">
        Sign out
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
        className="rounded-full"
      >
        <Avatar
          alt={session.user?.name || session.user?.email || "User"}
          src={session.user.image}
        />
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
