import SpotifyWebApi from "spotify-web-api-node";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * A class for interacting with the Spotify Web API.
 * @class
 * @property {SpotifyWebApi} controller - The Spotify Web API controller.
 * @property {string} clientId - The Spotify client ID.
 * @property {string} clientSecret - The Spotify client secret.
 * @property {string} redirectUri - The Spotify redirect URI.
 * @property {string} accessToken - The Spotify access token.
 * @property {string} refreshToken - The Spotify refresh token.
 * @property {string} tokenType - The Spotify token type.
 * @property {number} expiresIn - The Spotify token expiration time.
 * @property {string} scope - The Spotify token scope.
 * @property {string} state - The Spotify token state.
 * @property {string} code - The Spotify token code.
 * @property {string} error - The Spotify token error.
 * @property {string} errorDescription - The Spotify token error description.
 * @property {string} errorUri - The Spotify token error URI.
 * @property {string} response - The Spotify token response.
 * @property {string} body - The Spotify token body.
 * @property {string} headers - The Spotify token headers.
 * @property {string} statusCode - The Spotify token status code.
 * @property {string} statusMessage - The Spotify token status message.
 * @property {string} uri - The Spotify token URI.
 * @property {string} method - The Spotify token method.
 * @property {string} retryAfter - The Spotify token retry after.
 * @property {string} limit - The Spotify token limit.
 * @property {string} offset - The Spotify token offset.
 * @property {string} total - The Spotify token total.
 * @property {string} previous - The Spotify token previous.
 * @property {string} href - The Spotify token href.
 * @property {string} next - The Spotify token next.
 * @property {string} items - The Spotify token items.
 * @returns {SpotifyController} - The SpotifyController object.
 */
export default class SpotifyController {
  private controller: SpotifyWebApi;

  /**
   * Creates an instance of the SpotifyController class.
   * @constructor
   * @param {string} clientId - The Spotify client ID.
   * @param {string} clientSecret - The Spotify client secret.
   * @param {string} redirectUri - The Spotify redirect URI.
   * @param {string} accessToken - The Spotify access token.
   * @param {string} refreshToken - The Spotify refresh token.
   * @param {string} tokenType - The Spotify token type.
   * @param {number} expiresIn - The Spotify token expiration time.
   * @param {string} scope - The Spotify token scope.
   * @param {string} state - The Spotify token state.
   * @param {string} code - The Spotify token code.
   * @param {string} error - The Spotify token error.
   * @param {string} errorDescription - The Spotify token error description.
   * @param {string} errorUri - The Spotify token error URI.
   * @param {string} response - The Spotify token response.
   * @param {string} body - The Spotify token body.
   * @param {string} headers - The Spotify token headers.
   * @param {string} statusCode - The Spotify token status code.
   * @param {string} statusMessage - The Spotify token status message.
   * @param {string} uri - The Spotify token URI.
   * @param {string} method - The Spotify token method.
   * @param {string} retryAfter - The Spotify token retry after.
   * @param {string} limit - The Spotify token limit.
   * @param {string} offset - The Spotify token offset.
   * @param {string} total - The Spotify token total.
   * @param {string} previous - The Spotify token previous.
   * @param {string} href - The Spotify token href.
   * @param {string} next - The Spotify token next.
   * @param {string} items - The Spotify token items.
   * @returns {SpotifyController} - The SpotifyController object.
   */
  constructor() {
    this.controller = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: "http://localhost:3000/callback",
    });

    this.init();
  }

  /**
   * Initializes the Spotify controller and logs in with client credentials.
   * @async
   * @returns {Promise<void>} - A promise that resolves when the controller is initialized.
   * @example
   * const spotify = new SpotifyController();
   * await spotify.init();
   */
  private async init() {
    console.log("Initializing spotify manager...");
    const data = await this.controller.clientCredentialsGrant();
    this.controller.setAccessToken(data.body.access_token);
    console.log("Spotify manager initialized");
  }

  /**
   * Searches for artists in Spotify by a given search word.
   * @async
   * @param {string} searchWord - The word to search for.
   * @returns {Promise<Object>} - A promise containing the search results.
   * @example
   * const spotify = new SpotifyController();
   * const artists = await spotify.searchArtists("The Beatles");
   */
  async searchArtists(searchWord: string) {
    return await this.controller.searchArtists(searchWord, {
      limit: 10,
    });
  }

  /**
   * Searches for tracks in Spotify by a given search word.
   * @async
   * @param {string} searchWord - The word to search for.
   * @returns {Promise<Object>} - A promise containing the search results.
   * @example
   * const spotify = new SpotifyController();
   * const tracks = await spotify.searchTracks("Yellow Submarine");
   */
  async searchTracks(searchWord: string) {
    return await this.controller.searchTracks(searchWord, {
      limit: 10,
    });
  }
  
  /**
   * Searches for playlists in Spotify by a given search word.
   * @async
   * @param {string} searchWord - The word to search for.
   * @returns {Promise<Object>} - A promise containing the search results.
   * @example
   * const spotify = new SpotifyController();
   * const playlists = await spotify.searchPlaylists("The Beatles");
   */
  async searchPlaylists(searchWord: string) {
    return await this.controller.searchPlaylists(searchWord, {
      limit: 10,
    });
  }
}
