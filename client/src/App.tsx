import {useEffect, useState} from "react";
import "./App.css";
import io from "socket.io-client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { allRoutes } from "./routes";

// const socket = io("http://localhost:9999");

const router = createBrowserRouter(allRoutes)

function App() {
  // const [message, setMessage] = useState<string>("");
  // const [messageList, setMessageList] = useState<string[]>([]);

  // // send message to server
  // const sendMessage = (e: React.FormEvent) => {
  //   e.preventDefault(); 

  //   if (message !== "") {
  //     const messageData = {
  //       // author: "User1", // Aap yahan dynamic name rakh sakte hain
  //       message: message,
  //       time: new Date().toLocaleTimeString(),
  //     };

  //     // Backend ko event bhejna
  //     socket.emit("send_message", messageData);

  //     // Input box ko khali karna
  //     setMessage("");
  //   }
  // };

  // // receive message from server
  // useEffect(() => {
  //   // Backend se aane wale message ko sun-na
  //   socket.on("receive_message", (data: any) => {
  //     setMessageList((list) => [...list, data.message]);
  //   });

  //   // Cleanup: Listener ko remove karna taaki duplicate messages na aayein
  //   return () => {
  //     socket.off("receive_message");
  //   };
  // }, []);


return <RouterProvider router={router} />
    // <div style={{ padding: "20px" }}>
    //   <h2>Chat App</h2>
    //   <div className="chat-window">
    //     {messageList.map((msg, index) => (
    //       <p key={index}>{msg}</p>
    //     ))}
    //   </div>

    //   <form onSubmit={sendMessage}>
    //     <input
    //       type="text"
    //       value={message}
    //       placeholder="Type message..."
    //       onChange={(e) => setMessage(e.target.value)}
    //     />
    //     <button type="submit">Send</button>
    //   </form>
    // </div>
  
}

export default App;
