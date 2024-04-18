import React, { useEffect } from "react";
import {
  Box,
  Stack,
  Divider,
  Button,
  Typography,
  IconButton,
  Modal,
  TextField,
} from "@mui/material";
import { MagnifyingGlass, UserPlus, UsersThree } from "phosphor-react";
import { SimpleBarStyle } from "../../components/Scrollbar";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import ChatElement from "../../components/ChatElement";
import Friends from "../../sections/main/Friends";
import { socket } from "../../socket";
import {
  FetchFriends,
  FetchGroups,
  FetchChatArrGroup,
  FetchChatGroupArr1,
} from "../../redux/slices/app";
import Message from "../../components/Conversation/Message";
import axios from "../../utils/axios";
import { useSelector, useDispatch } from "react-redux";

const user_id = window.localStorage.getItem("user_id");

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

const Chats = () => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openModalAddGroup, setOpenModalAddGroup] = React.useState(false);
  const [textAddGroup, setTextAddGroup] = React.useState(false);

  const { conversations } = useSelector(
    (state) => state.conversation.direct_chat
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(FetchFriends());
    dispatch(FetchGroups());
  }, [dispatch]);

  const { friends, groups } = useSelector((state) => state.app);
  console.log("gourp", groups);
  useEffect(() => {
    socket.emit("get_direct_conversations", { user_id }, (data) => {
      // data => list of converssations
    });
  }, []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleGroupClick = (group) => {
    dispatch(FetchChatGroupArr1(group._id));
  };

  const addNewGroup = async ()  =>  {
    await axios
      .post(`/groupchat/`,           
      {
        admin: user_id,
        groupName: textAddGroup
      }, 
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer `,
        },
      })
      .then((response) => {
        console.log("Thêm group mới thành công")
        setTextAddGroup("")
        setOpenModalAddGroup(false);
        dispatch(FetchGroups());
      })
      .catch((error) => {
        console.log("error :", error);
      });
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",

          width: 320,
          backgroundColor: "#F8FAFF",
          boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
        }}
      >
        <Stack p={2} spacing={1.5} sx={{ height: "100vh" }}>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            spacing={2}
          >
            <Stack sx={{ width: "100%", fontSize: 20 }}>
              <Search>
                <SearchIconWrapper>
                  <MagnifyingGlass color="#709CE6" />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
            </Stack>
            <IconButton
              onClick={() => {
                handleOpenDialog();
              }}
            >
              <UserPlus size={20} />
            </IconButton>
            <Stack>
            <IconButton
            onClick={() => setOpenModalAddGroup(true)}
            >
              <UsersThree size={25} />
              </IconButton>
            </Stack>
          </Stack>
          <Stack direction={"row"}>
            <Button>Tất cả</Button>
            <Button>Chưa đọc</Button>
          </Stack>
          <Stack>
            <Divider style={{ marginTop: "-15px" }} />
          </Stack>
          <Stack
            dỉrection={"column"}
            sx={{ flexGrow: 1, overflowY: "scroll", height: "100%" }}
          >
            <SimpleBarStyle timeout={500} clickOnTrack={false}>
              {/* <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                  Chưa đọc
                </Typography>
                {ChatList.filter((el) => el.pinned).map((el) => {
                  return <ChatElement {...el} />;
                })}
              </Stack> */}
              <Stack spacing={1}>
              <h4>Bạn bè</h4>
                {/* Hiển thị danh sách bạn bè */}
                {friends?.map((friend) => (
                  <Box
                    key={friend.id}
                    display="flex"
                    alignItems="center"
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                        cursor: "pointer",
                      },
                      borderRadius: "8px",
                      padding: "8px",
                    }}
                  >
                    <img
                      src={
                        friend?.img ||
                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABRFBMVEX///9Pw/f/t01CQkL/mAABV5s+v/fi9P7/pyZ4Rxk9QEL/uk3/uE3/nRgzMzPFxcUuLi7/mwD/s0Ph4eE9PT00O0IAVZ4AUpc5OTnnqEv/oABwQBX/tkkAUqFSyPzz8/NISEjyr0z/sjoATZRfX1+8vLzR0dEmJiYwOUG0h0i2fDJrOxPPkDvJ6vxry/jg4OCBgYGYmJhlV0Thn0KgaSn/xHuCTx3/9+3/3br/79v/zo3/58j/pCfU4e0AS5xvbHcWa6vZjS+C0vkphcGy4vukpKRUVFRqampiVUShoaF3WzqFYziTazifcje6gTL/vWlUTUObZSf/0p3/xXX/4r7/69HA0uR+pczxlR2Rr84vb6mxf1FOZYPgjyV8cHGT2PpdaH4vXo6JdGlCruSbeV4bcrC3gU8UWpUzl9Amgb1FmsRKs+GyoW/eAAAIqklEQVR4nO2d7VsSWRTABQURZpFBBENeBHwhRLTUtDRCK9223bXMsjK1zdps+/+/770DMwzzwtwZ7nAOPff3pXwY73N+nHPPuTNojY0JBAKBQCAQCAQCgUAgELikWCzOzKzPdFkvQofEjZnp5xuLC6l4wsACdGBcmHm+MZeIz6VS42biS9DRDUzx+WIibuXWYQE6wAFZ3uirN/JJXF5M9NcjpBago/TOOoPfKCexuMHkN7o7cXpujs1vVJO4kWD1G80kFo+YE0hJLd6bHq2zzbrDgDArzsVXjpdGR3LZTYV2LePx42Xo0NmYXvEiqEgmjkah6Ux7yqDmuLgOLeCEtxLVOa7cg1boz0x8MEFC/Ah1y1lw2UUt0xhH3HGOXc1BW1amoUXsWBpwE2okkPbUGV6CRBFnoS5y2ISaIsZ2w61GKakjaB0zRT5dRiWOby7e42s4vjIDbWSg6Pk4akPqGFrJAO8UouunxcGPa0ZSi9BSPbzwnMLobHXW+hVcSfQ4Cone/bulO9Go1YupDWgrHdNeipTo/X63FItJsTuzloqYxv6x6xy2s0f0ggQbRUTPGYsujzM9evaKiAbGkpsiNenZK8bRlCl7kVrq2SqiuRdmHYa2enaKc1gOp0yPn/rqtRVNQwPN0Hc+sTnq2SgmoNU6ONz6MulZKyaQPD7tV6TMepZ7MY7jmdS6raErPasszr2AllOwmYbR2Vl3ehaKSI6mVo3GdfasFZE0U9O895Q9a8UFaDmFIz7Zs1RMQcsppDjqKYqlcU0Rxcm0e2bjodfJorokiltE7WF+lIteW1F9sJHA8ExRG4dRiYuegppEFIeaZbVKo9z8dIYY7p98NURxhzjtqyGGg6kwFIbCEB5hKAyFITzC8BcwTPhomEBguBf5o+qbYfVl5C204G42Evmz6pNh9a9IJHsGK/iQCEYitaqloRRjuee3vEoxrP5NF88+BDUsRxTq1ajZMBas12qbMQfB2GatVg8ar6LLVQ/aiwchBc+y7SAim+NRo2Fsc56wutVfMfZ6lV5mfCPIauObnbWze4CGJ50gIsnSq9leQ6m0OkWZ76sY25pXrlot9RZqdPZVKakuvg1omNUMpeD9qmXspuCt3gbT+1C9H5Q0wwgKQ9IwXvYaPpjqBF+3T2Ks3nkbph70XvSSNB/NMIvDMGjoFoMZ0q/wGRqCH6hKg3pDyCo9sTeUNjud5nXfTvO602k2zW+DZngCaLibtTUkFbg6PzW/+iDYb+hLwQfKVVaVrBpmdwENx+xzSD9Dqm1t1R1ONVKsvrVVK1nlWcshpODYXtbeUDmPOR1pyBthd7ZLIhj4hNOsveGAtA2zp7CC6lb0wVCZ+FnYTdhmZ5vEUeb3wZpmWM5mI9s70Hpt9nZPc9wNc492we9+dTwsczcsw94XGtnxwRBJgarw34egN74WvOG9EXNvoJUMnPKeF0nwOWiAe6tB1mgI3A2hhUxs892IuUfQQibO+G7EMvB52wq+hjloHQse8SzTJL4i5dxNsR1o2pzwSyK6cd/mbZmbIb5h2IbbyQ1pCjnuRJy7kPKIz8RA2Ug7cDHMYZyFKntlDoZlTA8vTHCoU8w1SikN2k9zkJ9SsLAzaBJzaPuoyoAjA+us1zNQt8F402TmzLviaAgOoDgqgvQM7qWj5kZhD6rsBN231KSEvov2sF12KViG/LkgT5y5KlQpB/wjiF7YT7J/liElf4MO1wO/Tezn2Byl3P7EaBpOsDhK1G9iZA2Jo0OtSsl95brRNSSxl20SKdEft5DVq6DD9YBqSMOPJOnvCGu/J0z+Ikkke/pLoMP1gC58RWE/Uk4mc5Rksry/Lxtehg7XAwZDB4QhRoShMMSPMBSG+PnFDYvvzt+7Mnx//g46Zhc8/vCxWWleyM5eGvJFs9n8+OExdOgsPD4PNSuZUCj9yZXhp3QolKk0W+fYJZ81mpVQm7ybMr3Md76r0mw8g5awZ/I6HC60OqGG0lfsSZSfpNVvaxXC4etJaBVL1hrhQCBQeJrRFNmTqKUwlHlaIKuED/E5rgWoH+Gmohk+YU2i/FlLYeWmvUy4sQat1IPmR5IY0sgfMArW891vKqgLhRt48jjZ0PyI4W23TP9hTOJ3zS9zW+guhaZWD3V+lEw3iV9YFOWrdNewd6kwhr66ZvDT95pQvuasKF90a7TdZ/SKBfA0GhPYm8RQ+sBJsWcTZsyLha9B/UwJNOxEEvNlf0W5ntZdfFswLweaxmsrQUJIR/8syrW8/mLr5eB2Y8NGUDcTqWKfI7j8VS+ozkIslTppE06gt9mQdvP5vbWjfPmpR9DYZnSKDQBByy2oKbb0iun01wmzoyx/Sev2YCjzzVaQMvTN2Fcw0LsVqeOXA1mWdXbywVVe7xfKtPovGB6y4jMHwUA4ZHDMf7/695KqUbuLJ997/UIZmy4DpeiUQUUxY5LMK1rkz3Ta8Jqz4HAVGQQJJkV7nEp02IqTTIKBwLeKs5tC5QfbgoEh/cvQrIL0cMOSxozlUcZ6xeEYMkZDAwozpLHyLcwqGAgMZS4eshsSx5tWX8dMpXXD7jec043jnDA63rYqdrXq1o8q+v5wg3kTdhULN1TSaJkhercu6lNT9NvQfUgdyR8t4pRRoH+0nhI9T4sd+itod7/EIEl8ft78R/n5k37pcSGf69R9jVqIenZT8dOwMWhwPPCzn7Kd1nzHx9PbwPXFCd+aDZIU+phELCn0LYloUuhbElE00g6+tNOBZyFPfDm7XUNb6fHlITG0VC8+3Cgi6jMUH3oNqiL1pUyhlYxwL1NUnZTCvZu6fXjhO9xvE109fxoKvIc+tI8ZzhsR3TbkvhGRTUMK54mIrtFwn4j4Gg3vVoPpzkmF720wviLl/UEURkOuzRThsOBsiHBYcB4Xv74hwnHI+ewtDEHgbIgRnse24iRGMPy/6wKBQCAQCAQCgUAgEAiGxf+L9VWqTFKE7wAAAABJRU5ErkJggg=="
                      }
                      alt="Avatar"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                      }}
                    />
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#676767", ml: 1 }}
                    >
                      {friend.firstName} {friend.lastName}
                    </Typography>
                  </Box>
                ))}
                {/* Hiển thị danh sách nhóm */}
                <Box style={{marginTop: 20}}>

                <h4>Nhóm</h4>
                {groups?.map((group) => (
                  <Box
                    key={group.id}
                    display="flex"
                    alignItems="center"
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                        cursor: "pointer",
                      },
                      borderRadius: "8px",
                      padding: "8px",
                    }}
                    onClick={() => handleGroupClick(group)}
                  >
                    <img
                      src={
                        group?.img ||
                        'https://cdn-icons-png.flaticon.com/512/6387/6387947.png'
                      }
                      alt="Avatar"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: 'contain'
                      }}
                      
                    />
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#676767", ml: 1 }}
                    >
                      {group.groupName}
                    </Typography>
                  </Box>
                ))}
                </Box>
              </Stack>
            </SimpleBarStyle>
          </Stack>
        </Stack>
      </Box>
      <Modal
        open={openModalAddGroup}
        onClose={() => setOpenModalAddGroup(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Tạo nhóm
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
              label="Nhập tên nhóm..."
              variant="standard"
              onChange={(e) => setTextAddGroup(e.target.value)}
            />
          </Box>
          <Box style={{marginTop: 20}}>
          <Stack spacing={2} direction="row" justifyContent={'flex-end'}>
            <Button variant="text" onClick={()=>setOpenModalAddGroup(false)}>Hủy</Button>
            <Button variant="contained" onClick={addNewGroup}>Tạo nhóm</Button>
          </Stack>
          </Box>
        </Box>
      </Modal>
      {openDialog && (
        <Friends open={openDialog} handleClose={handleCloseDialog} />
      )}
    </>
  );
};
export default Chats;
