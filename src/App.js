import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { APP_ID, SERVER_SECRET } from "./constant";
import { useState } from "react";

export default function App() {
  const [notes, setNotes] = useState([]);
  const roomID = "VideoCallApp";
  let myMeeting = async (element) => {
    // generate Kit Token
    const appID = APP_ID;
    const serverSecret = SERVER_SECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      Date.now().toString(),
      "CallApp"
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Personal link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?roomID=" +
            roomID,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
    });
  };
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then(function (stream) {
      const localVideo = document.getElementById("localVideo");
      localVideo.srcObject = stream;
    })
    .catch(function (err) {
      console.error("Error accessing media devices: ", err);
    });

  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = function (event) {
    const transcript = event.results[event.results.length - 1][0].transcript;
    const subtitleContainer = document.getElementById("subtitleContainer");
    subtitleContainer.textContent = transcript;
    setNotes([...notes, transcript]);
  };
  console.log(notes, "asdfg");
  recognition.start();

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div
          ref={myMeeting}
          style={{
            width: "63vw",
            height: "60vh",
          }}
        ></div>
        <div>
          <video id="remoteVideo" autoPlay></video>
          <div id="subtitleContainer"></div>
        </div>

        <a
          href={window.URL.createObjectURL(
            new Blob(notes, {
              type: "text/plain",
            })
          )}
          download={"SavedNotes.txt"}
        >
          <button
            style={{
              width: "150px",
              height: "30px",
              border: "1px solid black",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            SAVE NOTES
          </button>
        </a>
      </div>
    </>
  );
}
