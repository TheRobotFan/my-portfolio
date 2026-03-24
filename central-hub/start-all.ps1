# Start each app in a new window

# Start Central Hub
Start-Process powershell -NoNewWindow -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\abdel\Desktop\Kodland\central-hub'; npm run dev -p 3000"
Start-Sleep -Seconds 2

# Start Climate Action Hub
Start-Process powershell -NoNewWindow -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\abdel\Desktop\Kodland\climate-action-hub'; npm run dev -p 3001"
Start-Sleep -Seconds 2

# Start Meme Generator
Start-Process powershell -NoNewWindow -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\abdel\Desktop\Kodland\meme-generator-website'; npm run dev -p 3002"
Start-Sleep -Seconds 2

# Start My Digital Diary
Start-Process powershell -NoNewWindow -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\abdel\Desktop\Kodland\my-digital-diary-app'; npm run dev -p 3003"
Start-Sleep -Seconds 2

# Start Polyglot Translator
Start-Process powershell -NoNewWindow -ArgumentList "-NoExit", "-Command", "$env:TURBOPACK='0'; $env:NEXT_TURBO='0'; cd 'c:\Users\abdel\Desktop\Kodland\polyglot-translator'; npm run dev -p 3004"
Start-Sleep -Seconds 2

# Start Domino Online
Start-Process powershell -NoNewWindow -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\abdel\Desktop\Kodland\domino-online-game'; npm run dev -p 3005"
Start-Sleep -Seconds 2

# Start Python Masterclass
Start-Process powershell -NoNewWindow -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\abdel\Desktop\Kodland\Python - Funzioni'; npm run dev -p 3006"
Start-Sleep -Seconds 2

# Start Class Portal
Start-Process powershell -NoNewWindow -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\abdel\Desktop\Kodland\ClassPortalFullStack'; npm run dev -p 3007"
Start-Sleep -Seconds 2

# Start Grocery Engine
Start-Process powershell -NoNewWindow -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\abdel\Desktop\Kodland\grocery-app'; npm run dev -p 3008"

Write-Host "`nAll applications have been started."
Write-Host "Central Hub: http://localhost:3000"
Write-Host "Climate Action Hub: http://localhost:3001"
Write-Host "Meme Generator: http://localhost:3002"
Write-Host "My Digital Diary: http://localhost:3003"
Write-Host "Polyglot Translator: http://localhost:3004"
Write-Host "Domino Online: http://localhost:3005"
Write-Host "Python Masterclass: http://localhost:3006"
Write-Host "Class Portal: http://localhost:3007"
Write-Host "Grocery Engine: http://localhost:3008"
