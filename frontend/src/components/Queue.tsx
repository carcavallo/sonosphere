import axios, { AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";

/**
 * An interface for a track.
 * @interface
 * @property {string} Title - The title of the track.
 * @property {string} Artist - The artist of the track.
 * @see https://www.typescriptlang.org/docs/handbook/interfaces.html
 * @see https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces
 */
interface Track {
  Title: string;
  Artist: string;
}

/**
 * Renders a queue component with a list of the tracks.
 * @function
 * @returns {JSX.Element} The queue component.
 * @see https://reactjs.org/docs/components-and-props.html
 */
function Queue() {
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<string>("");
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const queueContainerRef = useRef<HTMLDivElement>(null);
  const trackListRef = useRef<HTMLUListElement>(null);

  /**
   * Effect to get the state from the API.
   * @function
   * @returns {void}
   * @see https://reactjs.org/docs/hooks-effect.html
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      axios.get("http://localhost:3000/state").then(
        (
          res: AxiosResponse<{
            positionInfo: { TrackMetaData: { Title: string } };
          }>
        ) => setCurrentTrack(`${res.data.positionInfo.TrackMetaData.Title}`)
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  /**
   * Effect to get the current queue from the API.
   * @function
   * @returns {void}
   * @see https://reactjs.org/docs/hooks-effect.html
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      axios
        .get("http://localhost:3000/queue")
        .then((res: AxiosResponse<{ Result: Track[] }>) =>
          setQueue(res.data.Result)
        );
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  /**
   * Handles changes to the media queue by making a POST request to a server
   * @function
   * @param {number} id - The ID of the media item to be added to the queue
   * @returns {void}
   * @see https://reactjs.org/docs/handling-events.html
   */
  const handleQueueChange = async (id: number) => {
    await axios.post("http://localhost:3000/media", {
      index: id + 1,
    });
  };

  /**
   * Clears the media queue by making a DELETE request to a server
   * @function
   * @returns {void}
   * @see https://reactjs.org/docs/handling-events.html
   */
  const clearQueue = async () => {
    await axios.delete("http://localhost:3000/queue");
  };

  /**
   * Effect to scroll to the current track in the queue.
   * @function
   * @returns {void}
   * @see https://reactjs.org/docs/hooks-effect.html
   */
  useEffect(() => {
    if (!isScrolling && queueContainerRef.current && currentTrack) {
      const currentTrackElement = queueContainerRef.current.querySelector(
        `li[data-track="${currentTrack}"]`
      ) as HTMLElement;
      if (currentTrackElement) {
        queueContainerRef.current.scrollTop =
          currentTrackElement.offsetTop -
          queueContainerRef.current.offsetTop -
          20; // add some extra margin to avoid hiding the track title
      }
    }
  }, [queue, currentTrack, isScrolling]);

  /**
   * Effect to check if the user is scrolling the queue.
   * @function
   * @returns {void}
   * @see https://reactjs.org/docs/hooks-effect.html
   */
  useEffect(() => {
    if (trackListRef.current) {
      const handleMouseEnter = () => {
        setIsScrolling(true);
      };
      const handleMouseLeave = () => {
        setIsScrolling(false);
      };
      const currentTrackListRef = trackListRef.current;
      currentTrackListRef.addEventListener("mouseenter", handleMouseEnter);
      currentTrackListRef.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        currentTrackListRef.removeEventListener("mouseenter", handleMouseEnter);
        currentTrackListRef.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  if (Array.isArray(queue)) {
    return (
      <div className="bg-gray-100 rounded-lg shadow-lg p-6 overflow-y-auto w-full pb-48 2xl:pb-7">
        <h2 className="text-lg font-medium text-blue-600">Queue</h2>
        <div
          className="mt-4 max-h-80 overflow-y-auto h-60"
          ref={queueContainerRef}
        >
          <ul ref={trackListRef}>
            {queue?.map((item, index) => (
              <div key={index}>
                <li
                  className={`cursor-pointer inline-block ${
                    item["Title"] === currentTrack ? "text-blue-600" : ""
                  }`}
                  title="Play track from queue"
                  onClick={() => handleQueueChange(index)}
                  data-track={item["Title"]}
                >
                  {item["Title"]} - {item["Artist"]}
                </li>
                <br />
              </div>
            ))}
          </ul>
        </div>
        <ul>
          <li
            onClick={() => clearQueue()}
            className="w-32 cursor-pointer clear mt-4 text-lg font-medium text-blue-600"
          >
            Clear
          </li>
        </ul>
      </div>
    );
  } else {
    return <></>;
  }
}

export default Queue;
