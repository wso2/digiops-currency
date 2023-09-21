FROM ethereum/client-go:alltools-latest

# Install required packages
RUN apk add --no-cache curl jq

# Copy the startup script
COPY ./ /app/node3

RUN chmod -R 777 /app

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
EXPOSE 30313 8042 8553

# Set the entry point to the startup script
ENTRYPOINT ["/bin/sh", "/app/node3/node.sh"]