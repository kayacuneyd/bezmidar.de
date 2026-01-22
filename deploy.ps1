$ErrorActionPreference = 'Stop'

Set-Location $PSScriptRoot

# Remote config
$RemoteUser = 'u553245641'
$RemoteHost = '185.224.137.82'
$RemotePort = 65002

# Web root (public site)
$RemoteWebDir = '~/domains/bezmidar.de/public_html'

# App source path on the server (kept under web root by default)
$RemoteAppDir = "$RemoteWebDir/app"

function Require-Command {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name
    )

    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command not found: $Name"
    }
}

Require-Command ssh
Require-Command rsync
Require-Command npm

Write-Host 'Building frontend...'
npm run build:frontend

if (-not (Test-Path (Join-Path $PSScriptRoot 'frontend/dist'))) {
    throw 'frontend/dist not found. Build may have failed.'
}

$sshTarget = "$RemoteUser@$RemoteHost"

Write-Host 'Ensuring remote directories exist...'
& ssh -p $RemotePort $sshTarget "mkdir -p $RemoteWebDir $RemoteAppDir"

$excludes = @(
    '.git/',
    'node_modules/',
    'frontend/node_modules/',
    'backend/node_modules/',
    'frontend/dist/',
    '.env',
    '.env.*'
)

$excludeArgs = $excludes | ForEach-Object { "--exclude=$_" }

Write-Host 'Syncing app source...'
& rsync -az --delete @excludeArgs -e "ssh -p $RemotePort" "./" "${sshTarget}:$RemoteAppDir/"

Write-Host 'Syncing frontend dist to web root...'
& rsync -az --delete -e "ssh -p $RemotePort" "frontend/dist/" "${sshTarget}:$RemoteWebDir/"

Write-Host 'Deploy complete.'
