import {
  AppBar,
  IconButton,
  Link,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Brightness4,
  Brightness7,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { ReactNode } from "react";
import { BaseProps } from "@/models";

interface NavbarProps extends BaseProps {
  children: ReactNode;
  heading: any;
  route: string;
}

export function Navbar({
  children,
  darkMode,
  toggleDarkMode,
  heading,
  route = "",
}: NavbarProps) {
  const router = useRouter();
  return (
    <AppBar
      position="static"
      color="inherit"
      sx={{ borderRadius: 3 }}
      variant="outlined"
    >
      <Toolbar sx={{ gap: 2 }}>
        {router.pathname !== "/dashboard" ? (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={() => router.push(route)}
          >
            <ArrowBackIcon />
          </IconButton>
        ) : (
          ""
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {heading}
        </Typography>
        {children}
        <Tooltip
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <IconButton onClick={toggleDarkMode}>
            {darkMode ? (
              <LightMode fontSize="small" color="action" />
            ) : (
              <DarkMode fontSize="small" color="action" />
            )}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
