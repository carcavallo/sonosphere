import logo from "./logo.png";

/**
 * Component representing the header of the application.
 * @function
 * @returns {JSX.Element} The header component.
 * @see https://reactjs.org/docs/components-and-props.html
 */
function Header() {
  return (
    <div className="bg-gray-900 shadow-lg p-6 overflow-y-auto w-100">
      <img src={logo} className="logo" alt="sonos" />
    </div>
  );
}

export default Header;
