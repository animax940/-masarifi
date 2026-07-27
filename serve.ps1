# خادم ملفات ثابت بسيط لتشغيل التطبيق محلياً (PowerShell)
param(
  [int]$Port = 5173,
  # -Public يفتح الخادم لبقية أجهزة الشبكة (الهاتف) — يتطلب تشغيل PowerShell كمسؤول
  [switch]$Public
)

$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
if ($Public) { $listener.Prefixes.Add("http://+:$Port/") }
else { $listener.Prefixes.Add("http://localhost:$Port/") }

try { $listener.Start() }
catch {
  Write-Host "Failed to start. With -Public you must run PowerShell as Administrator." -ForegroundColor Red
  throw
}

Write-Host "Serving $root at http://localhost:$Port/"
if ($Public) {
  Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } |
    ForEach-Object { Write-Host ("  On your phone: http://{0}:{1}/" -f $_.IPAddress, $Port) -ForegroundColor Green }
}

$types = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'
  '.svg'  = 'image/svg+xml'
  '.md'   = 'text/plain; charset=utf-8'
}

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $path = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
    if ($path -eq '/') { $path = '/index.html' }
    $file = Join-Path $root ($path.TrimStart('/') -replace '/', '\')

    if ((Test-Path $file -PathType Leaf) -and $file.StartsWith($root)) {
      $ext = [System.IO.Path]::GetExtension($file).ToLower()
      $ctx.Response.ContentType = if ($types.ContainsKey($ext)) { $types[$ext] } else { 'application/octet-stream' }
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $ctx.Response.ContentLength64 = $bytes.Length
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found')
      $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $ctx.Response.OutputStream.Close()
  } catch { }
}
