import cors from "cors";
import * as dotenv from "dotenv";
import express, { Express, json, NextFunction, Request, Response } from "express";
import SonosController from "./sonos";
import SpotifyController from "./spotify";
import * as Sentry from "@sentry/node";
import "@sentry/tracing";
import morgan from 'morgan';
import winston, { format } from 'winston';
import fs from 'fs';
import path from 'path';

dotenv.config();

/**
 * A class for the Sonos server.
 * @class
 * @property {Express} app - The Express application.
 * @property {SonosController} sonos - The Sonos controller.
 * @property {SpotifyController} spotify - The Spotify controller.
 * @returns {Server} - The Server object.
 */
export default class Server {
  private static instance: Server;

  private app: Express;

  private sonos: SonosController;
  private spotify: SpotifyController;

  /**
   * Creates an instance of the Server class.
   * @constructor
   * @returns {Server} - The Server object.
   * @throws {Error} - Missing SONOS_IP in .env file.
   * @throws {Error} - Missing SPOTIFY_CLIENT_ID in .env file.
   * @throws {Error} - Missing SPOTIFY_CLIENT_SECRET in .env file.
   */
  constructor() {
    this.app = express();

    const sonosIp = process.env.SONOS_IP;
    if (!sonosIp) throw new Error("Missing SONOS_IP in .env file");

    this.sonos = new SonosController(sonosIp);
    this.spotify = new SpotifyController();

    /*
      * Configure Express application
    */
    Sentry.init({
      dsn: "https://ec7fe1ae85814dce94c5df0c47903242@o4504876224741376.ingest.sentry.io/4504876226969600",
      tracesSampleRate: 1.0,
    });

    this.app.use(Sentry.Handlers.requestHandler());
    this.app.use(Sentry.Handlers.tracingHandler());

    const requestLogFilePath = path.join(__dirname, 'request.log');
    const errorLogFilePath = path.join(__dirname, 'error.log');

    const logger = winston.createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
      ),
      transports: [
        new winston.transports.File({ filename: errorLogFilePath, level: 'error' }),
        new winston.transports.File({ filename: requestLogFilePath }),
      ],
    });

    this.app.use(
      morgan('combined', {
        stream: {
          write: (message: string) => {
            logger.info(message.trim());
          },
        },
      })
    );

    this.app.use(Sentry.Handlers.errorHandler());
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      res.status(err.status || 500);
      res.send('An error occurred');
    });

    this.app.use(json());
    this.app.use(cors());

    this.app.get("/state", this.getState.bind(this));
    this.app.post("/volume", this.setVolume.bind(this));
    this.app.post("/resume", this.resume.bind(this));
    this.app.post("/pause", this.pause.bind(this));
    this.app.post("/previous", this.playPrevious.bind(this));
    this.app.post("/next", this.playNext.bind(this));
    this.app.post("/radio", this.playRadio.bind(this));
    this.app.post("/media", this.playMedia.bind(this));
    this.app.get("/queue", this.getQueue.bind(this));
    this.app.post("/queue", this.addToQueue.bind(this));
    this.app.delete("/queue", this.clearQueue.bind(this));
    this.app.post("/search/artists", this.searchArtists.bind(this));
    this.app.post("/search/tracks", this.searchTracks.bind(this));
    this.app.post("/search/playlists", this.searchPlaylists.bind(this));

    this.app.listen(3000, () =>
      console.log(`Server started at http://localhost:3000`)
    );
  }

  public start(port: number = 3000): void {
    this.app.listen(port, () => console.log(`Server started at http://localhost:3000`));
  }

  /**
   * GET /state
   *
   * Returns the current state of the Sonos device
   */
  private async getState(_req: Request, res: Response) {
    const state = await this.sonos.getState();
    return res.json(state);
  }

  /**
   * POST /volume
   *
   * Sets the volume of the Sonos device
   */
  private async setVolume(req: Request, res: Response) {
    if (!req.body || !req.body.volume)
      return res.status(400).send("Missing volume in request body");

    const { volume } = req.body;
    if (typeof volume !== "number")
      return res.status(400).send("Invalid volume value");

    await this.sonos.setVolume(volume);
    const state = await this.sonos.getState();
    return res.json(state);
  }

  /**
   * POST /resume
   *
   * Route to resume playing
   */
  private async resume(_req: Request, res: Response) {
    const success = await this.sonos.resume();
    return res.json(success);
  }

  /**
   * POST /pause
   *
   * Route to pause playing
   */
  private async pause(_req: Request, res: Response) {
    const success = await this.sonos.pause();
    return res.json(success);
  }

  /**
   * POST /previous
   *
   * Route to play the previous track
   */
  private async playPrevious(_req: Request, res: Response) {
    const success = await this.sonos.playPrevious();
    return res.json(success);
  }

  /**
   * POST /next
   *
   * Route to play the next track
   */
  private async playNext(_req: Request, res: Response) {
    const success = await this.sonos.playNext();
    return res.json(success);
  }

  /**
   * GET /queue
   *
   * Route to get the queue
   */
  private async getQueue(_req: Request, res: Response) {
    const queue = await this.sonos.getQueue();
    return res.json(queue);
  }

  /**
   * POST /pause
   *
   * Route to play radio
   */
  private async playRadio(req: Request, res: Response) {
    if (!req.body || !req.body.mediaUri)
      return res.status(400).send("Missing mediaUri in request body");

    const { mediaUri } = req.body;
    if (typeof mediaUri !== "string")
      return res.status(400).send("Invalid mediaUri value");

    const playRadioResponse = await this.sonos.playRadio(mediaUri);
    return res.json(playRadioResponse);
  }

  /**
   * POST /media
   *
   * Route to play media exept radio
   */
  private async playMedia(req: Request, res: Response) {
    if (!req.body || !req.body.index)
      return res.status(400).send("Missing index in request body");

    const { index } = req.body;
    if (typeof index !== "number")
      return res.status(400).send("Invalid mediaUri value");

    const playMediaResponse = await this.sonos.playMedia(index);
    return res.json(playMediaResponse);
  }

  /**
   * POST /queue
   *
   * Route to add something to the queue
   */
  private async addToQueue(req: Request, res: Response) {
    if (!req.body || !req.body.mediaUri)
      return res.status(400).send("Missing mediaUri in request body");

    const { mediaUri } = req.body;
    if (typeof mediaUri !== "string")
      return res.status(400).send("Invalid mediaUri value");

    const playMediaResponse = await this.sonos.addToQueue(mediaUri);
    return res.json(playMediaResponse);
  }

  /**
   * DELETE /queue
   *
   * Route to clear the queue
   */
  private async clearQueue(_req: Request, res: Response) {
    const success = await this.sonos.clearQueue();
    return res.json(success);
  }

  /**
   * POST /search/artists
   *
   * Route to get artists by search word
   */
  private async searchArtists(req: Request, res: Response) {
    if (!req.body || !req.body.searchWord)
      return res.status(400).send("Missing searchWord in request body");

    const { searchWord } = req.body;
    if (typeof searchWord !== "string")
      return res.status(400).send("Invalid searchWord value");

    const data = await this.spotify.searchArtists(searchWord);
    res.status(200).json(data);
  }

  /**
   * POST /search/tracks
   *
   * Route to get tracks by search word
   */
  private async searchTracks(req: Request, res: Response) {
    if (!req.body || !req.body.searchWord)
      return res.status(400).send("Missing searchWord in request body");

    const { searchWord } = req.body;
    if (typeof searchWord !== "string")
      return res.status(400).send("Invalid searchWord value");

    const data = await this.spotify.searchTracks(searchWord);
    res.status(200).json(data);
  }

  /**
   * POST /search/playlists
   *
   * Route to get playlists by search word
   */
  private async searchPlaylists(req: Request, res: Response) {
    if (!req.body || !req.body.searchWord)
      return res.status(400).send("Missing searchWord in request body");

    const { searchWord } = req.body;
    if (typeof searchWord !== "string")
      return res.status(400).send("Invalid searchWord value");

    const data = await this.spotify.searchPlaylists(searchWord);
    res.status(200).json(data);
  }

  /**
   * Singleton pattern
   *
   * Returns the instance of the server or creates a new one if it doesn't exist yet
   */
  public static getInstance(): Server {
    if (!Server.instance) Server.instance = new Server();
    return Server.instance;
  }
}

Server.getInstance();