import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const WalletConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <>
            <div
              {...(!ready && {
                "aria-hidden": true,
                style: {
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              })}
              className="sm:flex hidden"
            >
              {(() => {
                if (!connected) {
                  return (
                    <Button
                      className="bg-primary/10 text-primary hover:bg-primary/20"
                      onClick={openConnectModal}
                      type="button"
                    >
                      Connect Wallet
                    </Button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <Button
                      onClick={openChainModal}
                      type="button"
                      className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
                    >
                      Wrong network
                    </Button>
                  );
                }

                return (
                  <div style={{ display: "flex", gap: 12 }}>
                    <Button
                      onClick={openChainModal}
                      style={{ display: "flex", alignItems: "center" }}
                      type="button"
                      className="bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: "hidden",
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              style={{ width: 12, height: 12 }}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </Button>

                    <Button
                      onClick={openAccountModal}
                      type="button"
                      className="bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ""}
                    </Button>
                  </div>
                );
              })()}
            </div>

            {/* dropdown for mobile screens */}
            <div className="sm:hidden flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div>
                    {!connected && (
                      <Button
                        className="bg-primary/10 text-primary hover:bg-primary/20"
                        // onClick={openConnectModal}
                        type="button"
                      >
                        Connect Wallet
                      </Button>
                    )}

                    {chain?.unsupported && (
                      <Button
                        // onClick={openChainModal}
                        type="button"
                        className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
                      >
                        Wrong network
                      </Button>
                    )}

                    {account && chain?.unsupported === false && (
                      <Button
                        // onClick={openAccountModal}
                        type="button"
                        className="bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        {account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ""}
                      </Button>
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-zinc-50 dark:bg-zinc-950 space-y-2.5"
                >
                  {account ? (
                    <>
                      {chain?.unsupported ? (
                        <></>
                      ) : (
                        <Button
                          onClick={openAccountModal}
                          type="button"
                          className="bg-primary/10 text-primary hover:bg-primary/20 w-full"
                        >
                          {account.displayName}
                          {account.displayBalance
                            ? ` (${account.displayBalance})`
                            : ""}
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      className="bg-primary/10 text-primary hover:bg-primary/20 w-full"
                      onClick={openConnectModal}
                      type="button"
                    >
                      Connect
                    </Button>
                  )}

                  {chain?.unsupported ? (
                    <Button
                      onClick={openChainModal}
                      type="button"
                      className="bg-primary/10 text-primary hover:bg-primary/20 w-full"
                    >
                      Connect
                    </Button>
                  ) : (
                    <>
                      {chain && (
                        <Button
                          onClick={openChainModal}
                          style={{ display: "flex", alignItems: "center" }}
                          type="button"
                          className="bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          {chain?.hasIcon && (
                            <div
                              style={{
                                background: chain!.iconBackground,
                                width: 12,
                                height: 12,
                                borderRadius: 999,
                                overflow: "hidden",
                                marginRight: 4,
                              }}
                            >
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? "Chain icon"}
                                  src={chain.iconUrl}
                                  style={{ width: 12, height: 12 }}
                                />
                              )}
                            </div>
                          )}
                          {chain ? chain.name : "Select network"}
                        </Button>
                      )}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default WalletConnectButton;
