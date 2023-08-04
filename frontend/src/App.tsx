import React from "react";
import Header from "./components/Header";
import MusicPlayer from "./components/MusicPlayer";
import Queue from "./components/Queue";
import Radio from "./components/Radio";
import Spotify from "./components/Spotify";

/**
 * The main application component.
 * @function
 * @returns {JSX.Element} The application component.
 * @see https://reactjs.org/docs/components-and-props.html
 */
function App() {
  return (
    <div className="space-y-4">
      <Header />
      <Radio />
      <Spotify />
      <Queue />
      <MusicPlayer />
    </div>
  );
}

export default App;
