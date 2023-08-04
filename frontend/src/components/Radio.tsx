import axios from "axios";

/**
 * Renders a radio component with a list of radio stations to play.
 * @function
 * @returns {JSX.Element} The Radio component.
 * @see https://reactjs.org/docs/components-and-props.html
 */
function Radio() {
  /**
   * Play a radio station.
   * @function
   * @param mediaUri - The URI of the radio station to play.
   * @returns A Promise that resolves when the radio station starts playing.
   * @see https://reactjs.org/docs/handling-events.html
   */
  const playRadio = async (mediaUri: string): Promise<void> => {
    await axios.post("http://localhost:3000/radio", { mediaUri: mediaUri });
  };

  return (
    <div className="bg-gray-100 rounded-lg shadow-lg p-6 overflow-y-auto w-100 radio">
      <h2 className="text-lg font-medium text-blue-600">Radio</h2>
      <div className="mt-4 max-h-80 overflow-y-auto">
        <ul>
          <li
            title="Play radio"
            className="inline-block cursor-pointer"
            onClick={() =>
              playRadio("x-sonosapi-stream:tunein:7158?sid=303&flags=8232&sn=1")
            }
          >
            SRF 1
          </li>
          <br />
          <li
            title="Play radio"
            className="inline-block cursor-pointer"
            onClick={() =>
              playRadio("x-sonosapi-stream:tunein:7362?sid=303&flags=8232&sn=1")
            }
          >
            SRF 2 Kultur
          </li>
          <br />
          <li
            title="Play radio"
            className="inline-block cursor-pointer"
            onClick={() =>
              playRadio("x-sonosapi-stream:tunein:9464?sid=303&flags=8232&sn=1")
            }
          >
            SRF 3
          </li>
          <br />
          <li
            title="Play radio"
            className="inline-block cursor-pointer"
            onClick={() =>
              playRadio(
                "x-sonosapi-stream:tunein:17151?sid=303&flags=8232&sn=1"
              )
            }
          >
            SRF 4 News
          </li>
          <br />
          <li
            title="Play radio"
            className="inline-block cursor-pointer"
            onClick={() =>
              playRadio("x-sonosapi-stream:tunein:4877?sid=303&flags=8232&sn=1")
            }
          >
            SRF Musikwelle
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Radio;
