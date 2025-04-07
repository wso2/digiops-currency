// Copyright (c) 2025, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import React from "react";
import { Modal, Alert } from "antd"; 
import { logService } from "../../services/log.service";
import {
  getUserWallets,
  updateUserWalletAddress,
} from "../../services/wallet.service";
import WalletView from "./Components/WalletView";
import { useModal } from "../../context/WalletsContext";

const WalletsModal = ({ isOpen, onClose }) => {
  const { wallets, setWallets } = useModal();
  const handledSetDefaultWallet = (walletAddress) => async () => {
    logService({
      type: "info",
      message: `this is the defaultWallet ${walletAddress}`,
    });
    try {
      await updateUserWalletAddress({
        walletAddress: walletAddress,
        defaultWallet: 1,
      });

      logService({
        type: "info",
        message: `set default wallet ${walletAddress}`,
      });

      const wallets = await getUserWallets();

      setWallets(wallets);
    } catch (error) {
      logService({
        type: "error",
        message: `Error setting default wallet: ${error.message}`,
      });
    }
    onClose();
  };

  return (
    <Modal title="My Wallets" open={isOpen} onCancel={onClose} footer={null}>
      <Alert
        type="info"
        showIcon
        message="We use your default wallet address to send you coins based on your email. Once you set a new default wallet, all future coins will be sent there."
        style={{ marginBottom: 16 }}
      />
      <div>
        {wallets.map((wallet, index) => (
          <div
            key={index}
            onClick={handledSetDefaultWallet(wallet.walletAddress)}
          >
            <WalletView wallet={wallet} />
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default WalletsModal;
