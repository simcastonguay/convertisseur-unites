param([ValidateSet('dev', 'test', 'build', 'start', 'install')][string]$Action = 'dev')
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$systemNode = (Get-Command node -ErrorAction SilentlyContinue).Source
$bundledNode = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
$selectedNode = $null
foreach ($candidate in @($systemNode, $bundledNode)) {
    if ($candidate -and (Test-Path -LiteralPath $candidate)) {
        $version = [version]((& $candidate --version).TrimStart('v'))
        if ($version -ge [version]'22.12.0') { $selectedNode = $candidate; break }
    }
}
if (-not $selectedNode) { throw 'Installez Node.js 22.12 ou plus recent depuis https://nodejs.org/ puis relancez ce script.' }
$env:PATH = (Split-Path -Parent $selectedNode) + ';' + $env:PATH
Write-Host "Node utilise : $selectedNode"
if ($Action -eq 'install' -or -not (Test-Path -LiteralPath 'node_modules/vite/bin/vite.js')) {
    $npmCommand = (Get-Command npm.cmd -ErrorAction Stop).Source
    $npmCli = Join-Path (Split-Path -Parent $npmCommand) 'node_modules/npm/bin/npm-cli.js'
    & $selectedNode $npmCli ci
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
switch ($Action) {
    'dev' { & $selectedNode scripts/dev.js }
    'test' { & $selectedNode --test }
    'build' { & $selectedNode node_modules/vite/bin/vite.js build }
    'start' { & $selectedNode server/index.js }
    'install' { Write-Host 'Dependances installees.' }
}
exit $LASTEXITCODE
