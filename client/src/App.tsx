import "./App.css";
import Agents from "./Agents";
import { WalletButton } from "./components/WalletButton"; // Add this import

function App() {
  return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <WalletButton /> {/* Add this line */}
        <p>hello<p>
        <Agents />
      </div>
  );
}

export default App;
