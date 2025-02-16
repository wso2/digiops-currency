// Copyright (c) 2025 WSO2 LLC. (https://www.wso2.com).
//
// WSO2 LLC. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.
import React, { useState, useEffect } from "react";
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Input, Button, message } from 'antd';
import { Row, Col } from 'reactstrap';
import {
    COPIED,
    COPY_TO_CLIPBOARD,
    OK,
    PHRASE_COPIED
} from '../../constants/strings';
import { Alert } from "../../helpers/alerts";

function WalletAddressCopy(props) {
    const [messageApi, contextHolder] = message.useMessage();

    const { phrase } = props

    const [phraseCopied, setPhraseCopied] = useState(false)
    const [walletPhraseWords, setWalletPhraseWords] = useState([])

    const handleCopyPhrase = async () => {
        await messageApi.success(PHRASE_COPIED);
        setPhraseCopied(true)
    };

    useEffect(() => {
        if (phrase) {
            setWalletPhraseWords(phrase.split(' '));
        }
    }, [phrase])

    return (
        <>
            <Row className="mt-3">
                {walletPhraseWords.map((word, index) => (
                    <Col key={index} md="6" sm="6" xs="6" className="mt-2">
                        <div className="d-flex">
                            <span className="mx-2 mt-1"> {index + 1} </span>
                            <Input value={word} />
                        </div>
                    </Col>
                ))}
            </Row>
            <div className="d-flex justify-content-end mt-4">
                <CopyToClipboard text={phrase} onCopy={handleCopyPhrase}>
                    <Button className="copy-to-clipboard-button" icon={!phraseCopied ? <CopyOutlined /> : <CheckOutlined />}>{!phraseCopied ? COPY_TO_CLIPBOARD : PHRASE_COPIED}</Button>
                </CopyToClipboard>
            </div>
        </>
    )
}

export default WalletAddressCopy;