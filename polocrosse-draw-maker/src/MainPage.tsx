import React, { useEffect } from "react";
import "./preload.d.ts";

const MainPage = () => {
  useEffect(() => {
    // Send a message to the main process
    window.api.send("toMain", "Some data or message here");

    // Set up a listener for messages from the main process
    window.api.receive("fromMain", (data) => {
      console.log(`Received ${data} from main process`);
    });

    // Perform cleanup
    return () => {
      window.api.removeAllListeners("fromMain");
    };
  }, []);

  return (
    <div>
      {/* Your component's markup goes here */}
      <h1>Hello, Electron and React!</h1>
    </div>
  );
};

export default MainPage;
