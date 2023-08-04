import axios from "axios";
import { useState } from "react";

/**
 * A function that performs a search query and updates the search results state.
 * @function
 * @param {"title" | "artist" | "playlist"} searchType - The type of search to perform.
 * @param {string} query - The search query string.
 * @returns {Promise<void>}
*/
type SearchFunction = (
    searchType: "title" | "artist" | "playlist",
    query: string
) => Promise<void>;

/**
 * A custom React hook for searching the Spotify API and returning the search results.
 * @function
 * @returns {[any[], SearchFunction]} An array containing the search results and the search function.
 */
export default function useSpotifySearch(): [any[], SearchFunction] {
    const [items, setItems] = useState<any[]>([]);

    /**
     * A function that performs a search query and updates the search results state.
     * @function
     * @param {"title" | "artist" | "playlist"} searchType - The type of search to perform.
     * @param {string} query - The search query string.
     * @returns {Promise<void>}
     */
    const searchFunction: SearchFunction = async (searchType, query) => {
        const resourceMap = {
            title: "tracks",
            artist: "artists",
            playlist: "playlists",
        };

        const resource = resourceMap[searchType];

        const response = await axios.post(
            `http://localhost:3000/search/${resource}`,
            { searchWord: query }
        );

        setItems(response.data.body[resource].items);
    };

    return [items, searchFunction];
}
