#!/bin/bash

osascript <<EOF
-- Open Chrome if it's not already running and navigate to localhost:4200
tell application "Google Chrome"
    if it is not running then
        activate
        delay 1 -- Wait for Chrome to fully launch
    end if
    open location "http://localhost:4200"
end tell

tell application "Terminal"
    activate

    set originalWindow to front window

    -- First tab
    do script "cd /Users/peter/timezones && ng serve"

    -- Close the original window
    close originalWindow

end tell
EOF
