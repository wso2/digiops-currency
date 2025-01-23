# Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.

# This software is the property of WSO2 LLC. and its suppliers, if any.
# Dissemination of any information or reproduction of any material contained
# herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
# You may not alter or remove any copyright or other notice from copies of this content.

FROM ethereum/client-go:alltools-v1.13.13

# Install any needed packages
RUN apk add --no-cache bash curl jq

# Create a user with a known UID/GID within range 10000-20000.
# This is required by Choreo to run the container as a non-root user.
RUN adduser \
    --disabled-password \
    --gecos "" \
    --uid 10014 \
    "choreo"

# Use the above created unprivileged user
USER 10014

# Expose the required ports
EXPOSE 8545 8552 30303

# Set the entry point to the startup script
ENTRYPOINT ["/bin/sh", "/startup-scripts/node.sh"]
