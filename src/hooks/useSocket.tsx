import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Replace with your backend URL

const useSocket = (userId : string) => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!userId) return;

    socket.emit("register", userId); // Send user ID to the backend

    socket.on("taskAssigned", (data) => {
      console.log("New task notification:", data);
      setNotification(data.message);
    });

    return () => {
      socket.off("taskAssigned");
    };
  }, [userId]);

  return notification;
};

export default useSocket;
