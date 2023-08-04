import axios from "axios";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import useSpotifySearch from "../hooks/useSpotifySearch";
import queue from "./queue.png";

type SearchType = "title" | "artist" | "playlist";

/**
 * A React component for searching and displaying Spotify search results.
 * @function
 * @returns {JSX.Element} The Spotify component.
 * @see https://reactjs.org/docs/components-and-props.html
 */
function Spotify() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("title");

  const [items, searchBy] = useSpotifySearch();

  /**
   * A change event handler for updating the search query state.
   * @function
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event object.
   * @returns {void}
   * @see https://reactjs.org/docs/handling-events.html
   */
  const handleSearchQueryChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setSearchQuery(event.target.value);
  };

  /**
   * A change event handler for updating the search type state.
   * @function
   * @param {React.ChangeEvent<HTMLSelectElement>} event - The change event object.
   * @returns {void}
   * @see https://reactjs.org/docs/handling-events.html
   */
  const handleSearchTypeChange: ChangeEventHandler<HTMLSelectElement> = async (
    event
  ) => {
    const newSearchType = event.target.value as SearchType;

    await searchBy(newSearchType, searchQuery);
    setSearchType(newSearchType);
  };

  /**
   * A form event handler for performing a search query.
   * @function
   * @param {React.FormEvent<HTMLFormElement>} event - The form event object.
   * @returns {void}
   * @see https://reactjs.org/docs/handling-events.html
   */
  const handleSearchSubmit: FormEventHandler = async (event) => {
    event.preventDefault();
    await searchBy(searchType, searchQuery);
  };

  /**
   * A click event handler for adding an item to the queue.
   * @function
   * @param {string} mediaUri - The URI of the media item.
   * @returns {void}
   * @see https://reactjs.org/docs/handling-events.html
   */
  const handleQueue = async (mediaUri: string) => {
    switch (searchType) {
      case "title":
        await axios.post("http://localhost:3000/queue", {
          mediaUri,
        });
        break;
      case "playlist":
        await axios.post("http://localhost:3000/queue", {
          mediaUri,
        });
        break;
    }
  };

  return (
    <div className="bg-gray-100 rounded-lg shadow-lg p-6 overflow-y-auto w-full">
      <h2 className="text-lg font-medium text-blue-600">Spotify</h2>
      <div className="mt-4">
        <form className="flex items-center" onSubmit={handleSearchSubmit}>
          <input
            className="border rounded py-2 px-3 text-grey-darker focus:outline-none focus:border-grey ring-2 ring-blue-600"
            type="text"
            placeholder="Search for ..."
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />
          <div className="relative inline-flex">
            <select
              className="border border-grey-light rounded ml-2 bg-grey-lighter py-2 px-3 leading-tight focus:outline-none focus:border-grey ring-2 ring-blue-600"
              value={searchType}
              onChange={handleSearchTypeChange}
            >
              <option value="title">Title</option>
              <option value="artist">Artist</option>
              <option value="playlist">Playlist</option>
            </select>
          </div>
        </form>
        <div className="mt-4 max-h-80 overflow-y-auto">
          <ul>
            <li>
              {searchQuery
                ? `Searching for ${searchType}: "${searchQuery}"`
                : "Type a search query to get started!"}
            </li>
            <br />
            {items.map((item, index) => (
              <div key={index} className="flex items-center">
                {searchType === "title" ? (
                  <>
                    <li>{`${item["name"]} - ${item["artists"][0]["name"]}`}</li>
                    <img
                      src={queue}
                      onClick={() => handleQueue(item["uri"])}
                      className="h-5 ml-1 cursor-pointer"
                      title="Add to queue"
                      alt="Queue"
                    />
                  </>
                ) : searchType === "artist" ? (
                  <>
                    <li>{`${item["name"]}`}</li>
                  </>
                ) : searchType === "playlist" ? (
                  <>
                    <li>{`${item["name"]}`}</li>
                    <img
                      src={queue}
                      onClick={() => handleQueue(item["uri"])}
                      className="h-5 ml-1 cursor-pointer"
                      title="Add to queue"
                      alt="Queue"
                    />
                  </>
                ) : null}
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Spotify;
