create disk mount at /envs

create a file mount at /envs/bootnode.sh and put the following content.

#!/bin/bash

logfile="/envs/debug.log" # Name of the log file

# Start the bootnode command and append its output to the log file
bootnode -nodekey /envs/boot.key -verbosity 9 -addr :30310 >> $logfile 2>&1 &

# Print the content of the log file to the console
tail -f $logfile

create file mount at /envs/boot.key with the boot key.
