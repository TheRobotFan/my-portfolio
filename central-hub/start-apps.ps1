# Start each app in a new window

# Function to start an app in a new window
function Start-App {
    param (
        [string]$name,
        [string]$path,
        [int]$port,
        [string]$extraEnvVars = ""
    )
    
    $command = "cd '$path'"
    if ($extraEnvVars) {
        $command = "$extraEnvVars; $command"
    }
    $command += "; npm run dev -p $port"
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $command
    Write-Host "Started $name on port $port"
    Start-Sleep -Seconds 2
}

# Clear the screen
Clear-Host

# Start Central Hub
Start-App -name "Central Hub" -path "c:\Users\abdel\Desktop\Kodland\central-hub" -port 3000

# Start Climate Action Hub
Start-App -name "Climate Action Hub" -path "c:\Users\abdel\Desktop\Kodland\climate-action-hub" -port 3001

# Start Meme Generator
Start-App -name "Meme Generator" -path "c:\Users\abdel\Desktop\Kodland\meme-generator-website" -port 3002

# Start My Digital Diary
Start-App -name "My Digital Diary" -path "c:\Users\abdel\Desktop\Kodland\my-digital-diary-app" -port 3003

# Start Polyglot Translator with Turbopack disabled
Start-App -name "Polyglot Translator" -path "c:\Users\abdel\Desktop\Kodland\polyglot-translator" -port 3004 -extraEnvVars "$env:TURBOPACK='0'; $env:NEXT_TURBO='0'"

# Start Domino Online Game
Start-App -name "Domino Online" -path "c:\Users\abdel\Desktop\Kodland\domino-online-game" -port 3005

# Start Python Masterclass
Start-App -name "Python Masterclass" -path "c:\Users\abdel\Desktop\Kodland\Python - Funzioni" -port 3006

# Start Class Portal
Start-App -name "Class Portal" -path "c:\Users\abdel\Desktop\Kodland\ClassPortalFullStack" -port 3007

# Start Grocery Engine
Start-App -name "Grocery Engine" -path "c:\Users\abdel\Desktop\Kodland\grocery-app" -port 3008

# Display the URLs
Write-Host "`nAll applications have been started in separate windows.`n"
Write-Host "Central Hub: http://localhost:3000"
Write-Host "Climate Action Hub: http://localhost:3001"
Write-Host "Meme Generator: http://localhost:3002"
Write-Host "My Digital Diary: http://localhost:3003"
Write-Host "Polyglot Translator: http://localhost:3004"
Write-Host "Domino Online: http://localhost:3005"
Write-Host "Python Masterclass: http://localhost:3006"
Write-Host "Class Portal: http://localhost:3007"
Write-Host "Grocery Engine: http://localhost:3008"
