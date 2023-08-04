import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  StopIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";

/**
 * A React component for controlling the playback of a Sonos player.
 * @function
 * @returns {JSX.Element} The player controls component.
 * @see https://reactjs.org/docs/components-and-props.html
 */
function PlayerControls() {
  const [isPlaying, setIsPlaying] = useState(true);

  /**
   * Effect to get the state from the API.
   * @function
   * @returns {void}
   * @see https://reactjs.org/docs/hooks-effect.html
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      axios
        .get("http://localhost:3000/state")
        .then((res) => setIsPlaying(res.data.transportState === "PLAYING"));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  /**
   * A click event handler for toggling play/pause.
   * @function
   * @returns {void}
   * @see https://reactjs.org/docs/handling-events.html
   */
  const handlePlayback = () => {
    const url = isPlaying
      ? "http://localhost:3000/pause"
      : "http://localhost:3000/resume";
    axios.post(url);
    setIsPlaying(!isPlaying);
  };

  /**
   * A click event handler for skipping to the next track.
   * @function
   * @returns {void}
   * @see https://reactjs.org/docs/handling-events.html
   */
  const handleNext = () => {
    axios.post("http://localhost:3000/next");
  };

  /**
   * A click event handler for skipping to the previous track.
   * @function
   * @returns {void}
   * @see https://reactjs.org/docs/handling-events.html
   */
  const handlePrevious = () => {
    axios.post("http://localhost:3000/previous");
  };

  return (
    <div>
      <button className="text-white mr-4" onClick={() => handlePrevious()}>
        <ChevronLeftIcon className="w-6 h-6" />
      </button>
      <button className="text-white mr-4" onClick={() => handlePlayback()}>
        {isPlaying ? (
          <StopIcon className="w-6 h-6" />
        ) : (
          <PlayIcon className="w-6 h-6" />
        )}
      </button>
      <button className="text-white" onClick={() => handleNext()}>
        <ChevronRightIcon className="w-6 h-6" />
      </button>
    </div>
  );
}

export default PlayerControls;
