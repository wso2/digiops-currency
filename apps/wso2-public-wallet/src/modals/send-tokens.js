import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';


const SendTokens = ({ isOpen, onClose }) => {
    const [amount, setAmount] = useState('');
    const [address, setAddress] = useState('');

    const handleSend = () => {
        console.log('Sending tokens');
    }

    return (
        <Modal
            title="Send Tokens"
            visible={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSend}>
                    Send
                </Button>,
            ]}
        >
            <Input
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <Input
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
        </Modal>
    );

};

export default SendTokens;