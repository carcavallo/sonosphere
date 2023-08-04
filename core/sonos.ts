import { SonosDevice } from "@svrooij/sonos";
import { BrowseResponse, PlayMode } from "@svrooij/sonos/lib/models";
import { SonosState } from "@svrooij/sonos/lib/models/sonos-state";
import { AddURIToQueueResponse } from "@svrooij/sonos/lib/services";

/**
 * Class representing a Sonos controller.
 * @class
 * @property {SonosDevice} device - The Sonos device.
 * @property {string} name - The name of the Sonos device.
 * @property {string} host - The IP address or hostname of the Sonos device.
 * @property {number} port - The port number to use for the Sonos device.
 * @property {string} uuid - The UUID of the Sonos device.
 * @property {string} model - The model of the Sonos device.
 * @property {string} modelNumber - The model number of the Sonos device.
 * @property {string} serialNumber - The serial number of the Sonos device.
 * @property {string} softwareVersion - The software version of the Sonos device.
 * @property {string} hardwareVersion - The hardware version of the Sonos device.
 * @property {string} displayVersion - The display version of the Sonos device.
 * @property {string} icon - The icon of the Sonos device.
 * @property {string} zoneType - The zone type of the Sonos device.
 * @property {string} configuration - The configuration of the Sonos device.
 * @property {string} id - The ID of the Sonos device.
 * @property {string} ipAddress - The IP address of the Sonos device.
 * @property {string} macAddress - The MAC address of the Sonos device.
 * @property {string} softwareVersion - The software version of the Sonos device.
 * @property {string} softwareDate - The software date of the Sonos device.
 * @property {string} softwareUpdateState - The software update state of the Sonos device.
 * @property {string} softwareUpdateBehavior - The software update behavior of the Sonos device.
 * @property {string} softwareUpdateLastChange - The software update last change of the Sonos device.
 * @property {string} softwareUpdateProgress - The software update progress of the Sonos device.
 * @property {string} softwareUpdateAvailable - The software update available of the Sonos device.
 * @property {string} softwareUpdateItem - The software update item of the Sonos device.
 * @property {string} softwareUpdateItemAvailable - The software update item available of the Sonos device.
 * @property {string} softwareUpdateNotification - The software update notification of the Sonos device.
 * @property {string} softwareUpdateNotificationAvailable - The software update notification available of the Sonos device.
 * @property {string} softwareUpdateNotificationLastChange - The software update notification last change of the Sonos device.
 * @returns {SonosController}
 */
export default class SonosController {
  private device: SonosDevice;

  /**
   * Create a new Sonos controller.
    * @constructor
    * @param {string} host - The IP address or hostname of the Sonos device.
    * @param {number} port - The port number to use for the Sonos device.
    * @returns {SonosController}
    * 
   */
  constructor(host: string, port?: number) {
    this.device = new SonosDevice(host, port);
    this.init();
  }

  /**
   * Initialize the Sonos device.
   * @async
   * @returns A Promise that resolves when the operation is complete.
   * @example
   * const sonos = new SonosController("
   * await sonos.init();
   */
  private async init() {
    console.log("Initializing sonos manager...");
    await this.device.LoadDeviceData();
    console.log("Sonos manager initialized, device name:", this.device.Name);
  }

  /**
   * Get the current state of the Sonos device.
   * @async
   * @returns A Promise that resolves to a SonosState object.
   * @example
   * const sonos = new SonosController("
   * const state = await sonos.getState();
   */
  async getState(): Promise<SonosState> {
    return await this.device.GetState();
  }

  /**
   * Set the volume of the Sonos device.
   * @async
   * @param volume - The volume level to set, between 0 and 100.
   * @returns A Promise that resolves to true if the operation succeeded, false otherwise.
   * @example
   * const sonos = new SonosController("
   * await sonos.setVolume(50);
   */
  async setVolume(volume: number): Promise<boolean> {
    return await this.device.SetVolume(volume);
  }

  /**
   * Resume playback of the current track.
   * @async
   * @returns A Promise that resolves to true if the operation succeeded, false otherwise.
   * @example
   * const sonos = new SonosController("
   * await sonos.resume();
   */
  async resume(): Promise<boolean> {
    return await this.device.Play();
  }

  /**
   * Pause playback of the current track.
   * @async
   * @returns A Promise that resolves to true if the operation succeeded, false otherwise.
   * @example
   * const sonos = new SonosController("
   * await sonos.pause();
   */
  async pause(): Promise<boolean> {
    return await this.device.Pause();
  }

  /**
   * Play the previous track in the queue.
   * @async
   * @returns A Promise that resolves to true if the operation succeeded, false otherwise.
   * @example
   * const sonos = new SonosController("
   * await sonos.playPrevious();
   */
  async playPrevious(): Promise<boolean> {
    return await this.device.Previous();
  }

  /**
   * Play the next track in the queue.
   * @async
   * @returns A Promise that resolves to true if the operation succeeded, false otherwise.
   * @example
   * const sonos = new SonosController("
   * await sonos.playNext();
   */
  async playNext(): Promise<boolean> {
    return await this.device.Next();
  }

  /**
   * Get the current queue of the Sonos device.
   * @async
   * @returns A Promise that resolves to a BrowseResponse object.
   * @example
   * const sonos = new SonosController("
   * const queue = await sonos.getQueue();
   */
  async getQueue(): Promise<BrowseResponse> {
    return await this.device.GetQueue();
  }

  /**
   * Play the specified radio station.
   * @async
   * @param mediaUri - The URI of the radio station to play.
   * @returns A Promise that resolves when the operation is complete.
   * @example
   * const sonos = new SonosController("
   * await sonos.playRadio("http://icecast.omroep.nl/radio1-bb-mp3");
   */
  async playRadio(mediaUri: string): Promise<void> {
    await this.device.SetAVTransportURI(mediaUri);
    await this.device.Play();
  }

  /**
   * Play the specified media item from the queue.
   * @async
   * @param index - The index of the media item to play.
   * @returns A Promise that resolves when the operation is complete.
   * @example
   * const sonos = new SonosController("
   * await sonos.playMedia(0);
   */
  async playMedia(index: number): Promise<void> {
    await this.device.SwitchToQueue();
    await this.device.SeekTrack(index);
    await this.device.Play();
  }

  /**
   * Add a media URI to the Sonos device queue.
   * @async
   * @param mediaUri - The URI of the media to add.
   " @returns A Promise that resolves to an AddURIToQueueResponse object.
   * @example
   * const sonos = new SonosController("
   * await sonos.addToQueue("http://icecast.omroep.nl/radio1-bb-mp3");
   */
  async addToQueue(mediaUri: string): Promise<AddURIToQueueResponse> {
    return await this.device.AddUriToQueue(mediaUri);
  }

  /**
   Remove all tracks from the Sonos device queue.
   * @async
   * @returns A Promise that resolves to true if the operation succeeded, false otherwise.
   * @example
   * const sonos = new SonosController("
   * await sonos.clearQueue();
   */
  async clearQueue(): Promise<boolean> {
    return await this.device.AVTransportService.RemoveAllTracksFromQueue();
  }
}
