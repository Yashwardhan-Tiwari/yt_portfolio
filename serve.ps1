$ErrorActionPreference = 'Stop'
$root = [System.IO.Path]::GetFullPath($PSScriptRoot)
$listener = $null
$port = 8765
$started = $false
while (-not $started -and $port -le 8785) {
    try {
        $candidate = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
        $candidate.Start()
        $listener = $candidate
        $started = $true
    } catch {
        if ($candidate) { try { $candidate.Stop() } catch {} }
        $port++
    }
}
if (-not $started) {
    Write-Host 'Could not find an available local port between 8765 and 8785.' -ForegroundColor Red
    Read-Host 'Press Enter to close'
    exit 1
}
Write-Host "Yashwardhan's portfolio is running at http://127.0.0.1:$port/" -ForegroundColor Cyan
Write-Host 'Keep this window open while browsing. Press Ctrl+C here to stop the local server.' -ForegroundColor Yellow
Start-Process "http://127.0.0.1:$port/index.html"
$mime = @{
    '.html'='text/html; charset=utf-8'; '.htm'='text/html; charset=utf-8';
    '.css'='text/css; charset=utf-8'; '.js'='text/javascript; charset=utf-8';
    '.json'='application/json; charset=utf-8'; '.txt'='text/plain; charset=utf-8';
    '.pdf'='application/pdf'; '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg';
    '.webp'='image/webp'; '.svg'='image/svg+xml'; '.ico'='image/x-icon'
}
try {
    while ($listener) {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
        try {
            $requestLine = $reader.ReadLine()
            if ([string]::IsNullOrWhiteSpace($requestLine)) { $client.Close(); continue }
            $parts = $requestLine.Split(' ')
            $method = $parts[0].ToUpperInvariant()
            $requestPath = if ($parts.Length -gt 1) { $parts[1] } else { '/' }
            while (($headerLine = $reader.ReadLine()) -ne $null -and $headerLine -ne '') { }
            $absolutePath = [System.Uri]::UnescapeDataString(([System.Uri]::new("http://127.0.0.1$requestPath")).AbsolutePath.TrimStart('/'))
            if ([string]::IsNullOrWhiteSpace($absolutePath)) { $absolutePath = 'index.html' }
            $candidatePath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($root, $absolutePath.Replace('/', [System.IO.Path]::DirectorySeparatorChar)))
            $rootPrefix = $root.TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar
            $status = '200 OK'
            $contentType = 'application/octet-stream'
            if (-not $candidatePath.StartsWith($rootPrefix, [System.StringComparison]::OrdinalIgnoreCase) -and $candidatePath -ne $root) {
                $status = '403 Forbidden'; $bytes = [System.Text.Encoding]::UTF8.GetBytes('403 Forbidden'); $contentType = 'text/plain; charset=utf-8'
            } elseif (-not [System.IO.File]::Exists($candidatePath)) {
                $status = '404 Not Found'; $bytes = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found'); $contentType = 'text/plain; charset=utf-8'
            } else {
                $extension = [System.IO.Path]::GetExtension($candidatePath).ToLowerInvariant()
                if ($mime.ContainsKey($extension)) { $contentType = $mime[$extension] }
                $bytes = [System.IO.File]::ReadAllBytes($candidatePath)
            }
            $header = "HTTP/1.1 $status`r`nContent-Type: $contentType`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`nX-Content-Type-Options: nosniff`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            if ($method -ne 'HEAD') { $stream.Write($bytes, 0, $bytes.Length) }
            $stream.Flush()
        } catch {
            # A visitor closing a connection early should not stop the local server.
        } finally {
            try { $reader.Dispose() } catch {}
            try { $stream.Dispose() } catch {}
            try { $client.Close() } catch {}
        }
    }
} finally {
    if ($listener) { $listener.Stop() }
}
