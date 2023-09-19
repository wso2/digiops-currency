FROM ethereum/client-go:alltools-latest

# Install required packages
RUN apk add --no-cache curl jq

# Copy the startup script
COPY bootnode.sh /envs/bootnode.sh

# Copy the startup script
COPY debug.log /envs/debug.log

RUN chmod -R a+w /envs/debug.log

# Copy the bootkey
#COPY boot.key /envs/boot.key

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
EXPOSE 30310

# Set the entry point to the startup script
ENTRYPOINT ["/bin/sh", "/envs/bootnode.sh"]
