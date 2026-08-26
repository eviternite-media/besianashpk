param(
  [string]$ConfigDirectory = "$env:LOCALAPPDATA\BESIANA\ClientNotifier"
)

$ErrorActionPreference = 'Stop'
$mutexName = "BESIANA-Client-Notifier-$env:USERNAME"
$createdNew = $false
$mutex = [Threading.Mutex]::new($true, $mutexName, [ref]$createdNew)
if (-not $createdNew) {
  $mutex.Dispose()
  exit 0
}

$apiUrl = 'https://cyclon-kosovo.multipllando200.chatgpt.site/api/admin/notifications'
$tokenPath = Join-Path $ConfigDirectory 'admin-token.dat'
$statePath = Join-Path $ConfigDirectory 'last-seen.txt'
$logPath = Join-Path $ConfigDirectory 'notifier.log'

function Write-NotifierLog([string]$Message) {
  $line = "$(Get-Date -Format o) $Message"
  [IO.File]::AppendAllText($logPath, "$line`r`n")
}

function Read-AdminToken {
  $encrypted = [IO.File]::ReadAllBytes($tokenPath)
  $plain = [Security.Cryptography.ProtectedData]::Unprotect(
    $encrypted,
    $null,
    [Security.Cryptography.DataProtectionScope]::CurrentUser
  )
  return [Text.Encoding]::UTF8.GetString($plain)
}

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$notifyIcon = [Windows.Forms.NotifyIcon]::new()
$notifyIcon.Icon = [Drawing.SystemIcons]::Information
$notifyIcon.Text = 'BESIANA — Kërkesat e klientëve'
$notifyIcon.Visible = $true

try {
  if (-not (Test-Path -LiteralPath $tokenPath)) {
    Write-NotifierLog 'Token file is missing.'
    exit 2
  }
  $adminToken = Read-AdminToken
  $lastSeen = 0
  $hasState = Test-Path -LiteralPath $statePath
  if ($hasState) {
    $stored = [IO.File]::ReadAllText($statePath).Trim()
    if ($stored -match '^\d+$') { $lastSeen = [int64]$stored }
  }

  while ($true) {
    try {
      $response = Invoke-RestMethod -Uri "$apiUrl?after=$lastSeen" -Headers @{ 'X-Admin-Token' = $adminToken } -TimeoutSec 20
      $latestId = [int64]$response.latestId
      if (-not $hasState) {
        $lastSeen = $latestId
        [IO.File]::WriteAllText($statePath, [string]$lastSeen)
        $hasState = $true
      } else {
        foreach ($inquiry in @($response.inquiries)) {
          $title = 'Kërkesë e re — BESIANA'
          $subject = if ($inquiry.product) { $inquiry.product } else { $inquiry.request_type }
          $body = "$($inquiry.name) · $($inquiry.city)`r`n$subject`r`n$($inquiry.phone)"
          $notifyIcon.BalloonTipTitle = $title
          $notifyIcon.BalloonTipText = $body
          $notifyIcon.BalloonTipIcon = [Windows.Forms.ToolTipIcon]::Info
          $notifyIcon.ShowBalloonTip(12000)
          $lastSeen = [Math]::Max($lastSeen, [int64]$inquiry.id)
          [IO.File]::WriteAllText($statePath, [string]$lastSeen)
          Start-Sleep -Seconds 2
        }
        if ($latestId -gt $lastSeen) {
          $lastSeen = $latestId
          [IO.File]::WriteAllText($statePath, [string]$lastSeen)
        }
      }
    } catch {
      Write-NotifierLog $_.Exception.Message
    }
    Start-Sleep -Seconds 20
  }
} finally {
  $notifyIcon.Visible = $false
  $notifyIcon.Dispose()
  if ($createdNew) { $mutex.ReleaseMutex() }
  $mutex.Dispose()
}
