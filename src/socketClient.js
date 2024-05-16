import io from "socket.io-client";

const socket = io("http://localhost:3001");

const connectToSocket = () => {
    return socket;
};

export default connectToSocket;