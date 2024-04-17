import React from "react";
import {
  Box,
  Stack,
  IconButton,
  TextField,
  InputAdornment,
  Typography,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import {
  Sticker,
  Image,
  LinkSimple,
  Crop,
  IdentificationCard,
  Alarm,
  CheckSquare,
  Smiley,
  At,
} from "phosphor-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import axios from "../../utils/axios";
import { useDispatch, useSelector } from "react-redux";

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    // padingTop: "12px !important",
    paddingBottom: "25px !important",
  },
}));

const ChatInput = ({
  theme,
  setOpenPicker,
  setMessageContent,
  messageContent,
}) => {
  const handleAtClick = () => {
    const inputElement = document.querySelector('input[type="text"]');
    if (!inputElement) return;

    const { selectionStart, selectionEnd } = inputElement;
    const existingText = messageContent || "";

    const updatedMessageContent =
      existingText.substring(0, selectionStart) +
      existingText.substring(selectionEnd) +
      "@";

    const newPosition = selectionEnd + 1;

    setMessageContent(updatedMessageContent);

    setTimeout(() => {
      inputElement.setSelectionRange(newPosition, newPosition);
      inputElement.focus();
    }, 0);
  };

  const user_id = window.localStorage.getItem("user_id");
  const { ChatGroupArr } = useSelector((state) => state.app);

  React.useEffect(()=>{
    console.log("mess nè:", messageContent)
  },[messageContent])

  const sendMessage = async ()  =>  {

      await axios
        .post(`/groupchat/sendMsg`,           
        {
          sender: user_id,
          text: messageContent,
          type: 'Text',
          groupId: ChatGroupArr._id
        }, 
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer `,
          },
        })
        .then((response) => {
          console.log("send thanh cong")
        })
        .catch((error) => {
          console.log("error :", error);
        });
    };
  

  return (
    <StyledInput
      fullWidth
      placeholder="Nhập @, tin nhắn tới {}..."
      variant="filled"
      value={messageContent}
      onChange={(e) => setMessageContent(e.target.value)}
      InputProps={{
        disableUnderline: true,
        endAdornment: (
          <InputAdornment>
            <IconButton
              onClick={() => {
                setOpenPicker((prev) => !prev);
              }}
            >
              <Smiley />
            </IconButton>
            <IconButton onClick={handleAtClick}>
              <At />
            </IconButton>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: theme.palette.primary.main,
                  fontweight: 600,
                  fontSize: 16,
                  fontWeight: "bold",
                  paddingLeft: 2,
                }}
                style={{cursor: 'pointer'}}
                onClick={()=> sendMessage()}
              >
                GỬI
              </Typography>
            </Box>
          </InputAdornment>
        ),
      }}
    />
  );
};

const Footer = () => {
  const theme = useTheme();
  const [openPicker, setOpenPicker] = React.useState(false);
  const [messageContent, setMessageContent] = React.useState("");

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "F8FAFF",
        borderTop: '1px solid #d9d9d9'
      }}
    >
      <Stack direction={"row"} alignItems={"center"} spacing={1}>
        <IconButton>
          <Sticker />
        </IconButton>
        <IconButton>
          <Image />
        </IconButton>
        <IconButton>
          <LinkSimple />
        </IconButton>
        <IconButton>
          <Crop />
        </IconButton>
        <IconButton>
          <IdentificationCard />
        </IconButton>
        <IconButton>
          <Alarm />
        </IconButton>
        <IconButton>
          <CheckSquare />
        </IconButton>
      </Stack>
      <Stack direction="row" alignItems={"center"}>
        {/* ChatInput */}

        <Box
          sx={{
            display: openPicker ? "inline" : "none",
            zIndex: 10,
            position: "fixed",
            bottom: 70,
            right: 100,
          }}
        >
          <Picker
            theme={theme.palette.mode}
            data={data}
            onEmojiSelect={console.log}
          />
        </Box>
        <ChatInput
          theme={theme}
          setOpenPicker={setOpenPicker}
          setMessageContent={setMessageContent}
          messageContent={messageContent}
        />
      </Stack>
    </Box>
  );
};

export default Footer;
