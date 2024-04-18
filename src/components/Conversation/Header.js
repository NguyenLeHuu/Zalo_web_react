import React from "react";
import {
  Box,
  Avatar,
  IconButton,
  Stack,
  Typography,
  Modal,
  TextField,
  Button,
} from "@mui/material";
import { faker } from "@faker-js/faker";
import {
  MagnifyingGlass,
  SidebarSimple,
  UsersThree,
  VideoCamera,
} from "phosphor-react";
import { useTheme } from "@mui/material/styles";
import StyledBadge from "../StyledBadge";
import { toggleSidebar, FetchFriends } from "../../redux/slices/app";
import { useDispatch, useSelector } from "react-redux";
import {
  FriendComponent,
} from "../../components/Friends";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const FriendsList = ({purpose}) => {
  const dispatch = useDispatch();

  const { friends } = useSelector((state) => state.app);

  React.useEffect(() => {
    dispatch(FetchFriends());
  }, []);

  return (
    <>
      {friends.map((el, idx) => {
        // TODO => render UseComponent
        return <FriendComponent key={el._id} {...el} purpose={purpose} />;
      })}
    </>
  );
};

const Header = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { ChatArr, ChatGroupArr } = useSelector((state) => state.app);

  const [openModalAddGroup, setOpenModalAddGroup] = React.useState(false);
  const [textAddGroup, setTextAddGroup] = React.useState(false);

  React.useEffect(() => {
    console.log("Text add group:", textAddGroup);
  }, [textAddGroup]);

  React.useEffect(() => {
    console.log("Thông tin group :", ChatGroupArr);
  }, [ChatGroupArr]);

  return (
    <Box
      p={2}
      sx={{
        height: 100,
        width: "100%",
        backgroundColor: "F8FAFF",
        borderBottom: "1px solid #d9d9d9",
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
              <Avatar alt={faker.name.fullName()} src={ChatGroupArr?.img || 'https://cdn-icons-png.flaticon.com/512/6387/6387947.png'} />
            </StyledBadge>
          </Box>
          <Stack spacing={0.2}>
            {/* <Typography variant="subtitle2">{faker.name.fullName()}</Typography> */}
            <Typography variant="subtitle1">{ChatGroupArr?.groupName}</Typography>
            <Typography variant="caption">Online</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} alignItems={"center"} spacing={3}>
          <IconButton onClick={() => setOpenModalAddGroup(true)}>
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
      <Modal
        open={openModalAddGroup}
        onClose={() => setOpenModalAddGroup(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
          Thêm thành viên
          </Typography>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="standard-basic"
              label="Nhập tên thành viên..."
              variant="standard"
              onChange={(e) => setTextAddGroup(e.target.value)}
            />
          </Box>
          <Stack sx={{ height: "100%", marginTop: 5 }}>
          <Stack spacing={1}>
            <FriendsList purpose={"addToGroup"}/>;
          </Stack>
        </Stack>
          <Box style={{marginTop: 20}}>
          <Stack spacing={2} direction="row" justifyContent={'flex-end'}>
            <Button variant="text" onClick={()=>setOpenModalAddGroup(false)}>Hủy</Button>
            <Button variant="contained">Thêm</Button>
          </Stack>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Header;
