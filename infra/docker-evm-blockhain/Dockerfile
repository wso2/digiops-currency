FROM ethereum/client-go:alltools-latest

# Install required packages
RUN apk add --no-cache curl jq

# Set the working directory
WORKDIR /root

# Copy the password file
COPY root-password.txt /root/root-password.txt

# Copy the startup script
COPY start.sh /root/start.sh

# Expose the required ports
EXPOSE 30301 30310 30311 8040 8041 8551 8552


# Set the entry point to the startup script
ENTRYPOINT ["/bin/sh", "/root/start.sh"]