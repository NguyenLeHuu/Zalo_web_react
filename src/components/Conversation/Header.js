import React from "react";
import { Box, Avatar, IconButton, Stack, Typography } from "@mui/material";
import { faker } from "@faker-js/faker";
import {
  MagnifyingGlass,
  SidebarSimple,
  UsersThree,
  VideoCamera,
} from "phosphor-react";
import { useTheme } from "@mui/material/styles";
import StyledBadge from "../StyledBadge";
import { toggleSidebar } from "../../redux/slices/app";
import { useDispatch } from "react-redux";
const Header = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  return (
    <Box
      p={2}
      sx={{
        height: 100,
        width: "100%",
        backgroundColor: "F8FAFF",
        borderBottom: '1px solid #d9d9d9'
      }}
    >
      <Stack
        alignItems={"center"}
        direction={"row"}
        justifyContent={"space-between"}
        sx={{ width: "100%", height: "100%" }}
      >
        <Stack direction={"row"} spacing={2}>
          <Box>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
            >
              <Avatar alt={faker.name.fullName()} src={faker.image.avatar()} />
            </StyledBadge>
          </Box>
          <Stack spacing={0.2}>
            <Typography variant="subtitle2">{faker.name.fullName()}</Typography>
            <Typography variant="caption">Online</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} alignItems={"center"} spacing={3}>
          <IconButton>
            <UsersThree />
          </IconButton>
          <IconButton>
            <MagnifyingGlass />
          </IconButton>
          <IconButton>
            <VideoCamera />
          </IconButton>
          <IconButton
            onClick={() => {
              dispatch(toggleSidebar());
            }}
          >
            <SidebarSimple />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Header;
