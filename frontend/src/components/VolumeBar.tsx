import React, { useEffect, useState } from "react";
import axios from "axios";

/**
 * Component representing a volume bar.
 * @function
 * @returns {JSX.Element} The volume bar component.
 * @see https://reactjs.org/docs/components-and-props.html
 */
function VolumeBar() {
  const [volume, setVolume] = useState(0);

  /**
   * Effect to get the volume from the API.
   * @function
   * @returns {void}
   * @see https://reactjs.org/docs/hooks-effect.html
   */
  useEffect(() => {
    axios
      .get("http://localhost:3000/state")
      .then((res) => setVolume(res.data.volume));
  }, []);

  /**
   * Handler for volume change.
   * @function
   * @returns {void}
   * @see https://reactjs.org/docs/handling-events.html
   */
  const handleVolumeChange = () => {
    const volume = (document.getElementById("volume") as HTMLInputElement)
      .value;
    axios.post("http://localhost:3000/volume", { volume: parseInt(volume) });
    setVolume(parseInt(volume));
  };

  return (
    <div className="w-full">
      <input
        id="volume"
        type="range"
        min="0"
        max="20"
        value={volume}
        onChange={handleVolumeChange}
        className="h-2 cursor-pointer rounded-lg w-72"
      />
    </div>
  );
}

export default VolumeBar;
