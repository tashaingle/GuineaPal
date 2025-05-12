# clean.ps1
cd $PSScriptRoot

if (Test-Path "node_modules") {
    Write-Host "Removing node_modules..."
    Remove-Item -Recurse -Force "node_modules"
} else {
    Write-Host "node_modules not found, skipping..."
}

if (Test-Path "yarn.lock") {
    Write-Host "Removing yarn.lock..."
    Remove-Item -Force "yarn.lock"
} else {
    Write-Host "yarn.lock not found, skipping..."
}

Write-Host "Installing dependencies..."
yarn install