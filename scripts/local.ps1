param([ValidateSet('up', 'stop', 'status', 'logs', 'check', 'config')][string]$Action = 'up')
$ErrorActionPreference = 'Stop'
$dockerCommand = Get-Command docker -ErrorAction SilentlyContinue
$docker = if ($dockerCommand) { $dockerCommand.Source } else { Join-Path $env:ProgramFiles 'Docker/Docker/resources/bin/docker.exe' }
if (!(Test-Path -LiteralPath $docker)) { throw 'Install and start Docker Desktop with Linux containers.' }
Push-Location (Split-Path $PSScriptRoot -Parent)
try {
    $environmentPath = Join-Path (Get-Location) '.local/.env'
    if (!(Test-Path -LiteralPath $environmentPath)) {
        if ($Action -ne 'up') { throw 'First run: ./scripts/local.ps1 up' }
        New-Item -ItemType Directory -Force -Path (Split-Path $environmentPath -Parent) | Out-Null
        $random = [Security.Cryptography.RandomNumberGenerator]::Create()
        $bytes = New-Object byte[] 32
        try {
            $random.GetBytes($bytes)
            $password = [BitConverter]::ToString($bytes).Replace('-', '').ToLowerInvariant()
            $random.GetBytes($bytes)
            $rootPassword = [BitConverter]::ToString($bytes).Replace('-', '').ToLowerInvariant()
        } finally { $random.Dispose() }
        [IO.File]::WriteAllText($environmentPath, "HTTP_PORT=8088`nDB_PASSWORD=$password`nDB_ROOT_PASSWORD=$rootPassword`n")
    }
    $arguments = @('compose', '--env-file', $environmentPath, '-f', 'compose.yaml')
    switch ($Action) {
        up { & $docker @arguments up -d --build --wait --wait-timeout 240 }
        stop { & $docker @arguments stop }
        status { & $docker @arguments ps }
        logs { & $docker @arguments logs --tail 80 }
        check { & $docker @arguments exec -T web php /opt/mrbuffalo/check.php }
        config { & $docker @arguments config --quiet }
    }
    if ($LASTEXITCODE -ne 0) { throw "Docker command failed: $LASTEXITCODE" }
} finally { Pop-Location }
