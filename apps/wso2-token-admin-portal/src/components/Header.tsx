import { ModeToggle } from "./mode-toggle";
import WalletConnectButton from "./WalletConnectButton";

const Header = () => {
  return (
    <header className="flex justify-between items-center mb-10">
      <div className="flex items-center gap-2">
        <img
          src="/wso2logo-light-mono.svg"
          alt="Logo"
          className="w-20 h-10 object-contain"
        />
      </div>

      <div className="flex items-center gap-4">
        <ModeToggle />

        <div className="flex  items-center gap-2">
          <WalletConnectButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
