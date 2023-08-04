import axios from "axios";
import { useEffect, useState } from "react";
import PlayerControls from "./PlayerControls";
import VolumeBar from "./VolumeBar";
/**
 * A custom React component that renders a music player.
 * @function
 * @returns {JSX.Element} The music player component.
 * @see https://reactjs.org/docs/components-and-props.html
 */
function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState("");

  /**
   * Effect to get the current track.
   * @function
   * @returns {void}
   * @see https://reactjs.org/docs/hooks-effect.html
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      axios
        .get("http://localhost:3000/state")
        .then((res) =>
          setCurrentTrack(
            `${res.data.positionInfo.TrackMetaData.Title} - ${res.data.positionInfo.TrackMetaData.Artist}`
          )
        );
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-gray-900 shadow-lg p-6 flex flex-col items-center justify-center fixed bottom-0 left-0 w-full">
      <div className="flex flex-col items-center mb-2 overflow-hidden w-full">
        <h2 className="text-lg font-medium text-white animate-scroll text-center">
          <div className="w-full overflow-hidden">
            <div className="text-loop">
              <span className="text-xl">
                {currentTrack || "Sonos isn't playing..."}
              </span>
            </div>
          </div>
        </h2>
        <div className="flex items-center mt-2">
          <PlayerControls />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex items-center">
          <VolumeBar />
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
