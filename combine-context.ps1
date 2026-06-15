# =================================================================
# INTELLIGENT CODE COMBINER - ASCII ONLY VERSION
# =================================================================

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$OutputFile = "context_ai.txt"
$StructureFile = "folder_structure.txt"

# 1. EKSTENSI YANG DIPROSES (DENGAN TAMBAHAN REACT NATIVE)
$ValidExtsPattern = "\.(cs|csproj|sln|js|jsx|ts|tsx|css|scss|json|md|html|mjs|cjs|env|yml|yaml|sql|properties|xml|gradle|kt)$"

# 2. FILE YANG DIABAIKAN
$FileIgnoreRegex = "package-lock\.json|yarn\.lock|bun\.lockb|\.ico|\.png|\.jpg|\.jpeg|\.svg|\.woff|\.ttf|\.dll|\.exe|\.pdb|\.cache|\.suo|\.user|\.min\.js|\.min\.css|\.pdf|\.docx|\.zip|\.rar|\.txt"

# 3. FOLDER YANG DIABAIKAN (DENGAN TAMBAHAN ANDROID/iOS SPECIFIC)
$PruneDirs = @("node_modules", ".git", ".next", ".vs", ".vscode", ".idea", 
               "dist", "build", "coverage", "public", "bin", "obj", "TestResults", 
               ".sonarqube", "files", "uploads", "Libs", "migrations", "Properties",
               "__pycache__", ".expo", "Pods")

# --- FUNGSI UNTUK STRUKTUR FOLDER (ASCII ONLY) ---
function Get-DirectoryTree {
    param (
        [string]$Path,
        [string]$Prefix = ""
    )
    
    $output = @()
    $items = Get-ChildItem -Path $Path -Force -ErrorAction SilentlyContinue | 
             Where-Object { 
                 $PruneDirs -notcontains $_.Name -and 
                 $_.Name -ne $OutputFile -and 
                 $_.Name -ne $StructureFile -and
                 $_.Name -notlike "*.ps1"
             } | 
             Sort-Object { $_.PSIsContainer } -Descending
    
    $count = $items.Count
    for ($i = 0; $i -lt $count; $i++) {
        $item = $items[$i]
        $isLast = ($i -eq $count - 1)
        
        if ($isLast) {
            $prefixSymbol = "+-- "
        } else {
            $prefixSymbol = "|-- "
        }
        
        if ($item.PSIsContainer) {
            $icon = "[DIR] "
        } else {
            $icon = "[FILE] "
        }
        
        $size = ""
        if ((-not $item.PSIsContainer) -and $item.Length -gt 0) {
            $size = " (" + [math]::Round($item.Length / 1KB, 2) + " KB)"
        }
        
        $output += "$Prefix$prefixSymbol$icon$($item.Name)$size"
        
        if ($item.PSIsContainer) {
            if ($isLast) {
                $newPrefix = "$Prefix    "
            } else {
                $newPrefix = "$Prefix|   "
            }
            $output += Get-DirectoryTree -Path $item.FullName -Prefix $newPrefix
        }
    }
    
    return $output
}

function Save-FolderStructure {
    param ([string]$RootPath)
    
    Write-Host ""
    Write-Host "[1] Generating folder structure..." -ForegroundColor Yellow
    
    $header = @"
===========================================
FOLDER STRUCTURE - $(Split-Path $RootPath -Leaf)
Root: $RootPath
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
===========================================

$($RootPath)/
"@
    
    $tree = Get-DirectoryTree -Path $RootPath
    
    $header | Out-File -FilePath $StructureFile -Encoding UTF8
    $tree | Out-File -FilePath $StructureFile -Encoding UTF8 -Append
    
    Write-Host "     [OK] Saved to: $StructureFile" -ForegroundColor Green
}

# --- DETEKSI MODULE ---
function Get-AvailableModules {
    param ([string]$RootPath)
    
    $modules = @{}
    
    $candidateFolders = @("Controllers", "Services", "Repositories", "DTOs", "Helpers", "Models", "Views")
    
    foreach ($folderName in $candidateFolders) {
        $folderPath = Join-Path $RootPath $folderName
        if (Test-Path $folderPath) {
            $fileCount = (Get-ChildItem -Path $folderPath -Filter "*.js" -Recurse -ErrorAction SilentlyContinue).Count
            if ($fileCount -gt 0) {
                $modules[$folderName] = @{
                    Path = $folderName
                    FileCount = $fileCount
                }
            }
        }
    }
    
    $allFolders = Get-ChildItem -Path $RootPath -Directory -ErrorAction SilentlyContinue | 
                  Where-Object { 
                      $PruneDirs -notcontains $_.Name -and 
                      $_.Name -notin $candidateFolders -and
                      $_.Name -notlike ".*"
                  }
    
    foreach ($folder in $allFolders) {
        $csCount = (Get-ChildItem -Path $folder.FullName -Filter "*.cs" -Recurse -ErrorAction SilentlyContinue).Count
        if ($csCount -ge 5) {
            $modules[$folder.Name] = @{
                Path = $folder.Name
                FileCount = $csCount
            }
        }
    }
    
    return $modules
}

# --- GUI SELECTION ---
function Get-UserSelection {
    param ([hashtable]$AvailableModules, [string]$RootPath)
    
    if ($AvailableModules.Count -eq 0) {
        Write-Host "[WARNING] No modules found." -ForegroundColor Yellow
        $choice = Read-Host "Process all files? (y/n)"
        if ($choice -ne 'y') { exit }
        return @()
    }
    
    $form = New-Object System.Windows.Forms.Form
    $form.Text = "Select Modules - $((Split-Path $RootPath -Leaf))"
    $form.Size = New-Object System.Drawing.Size(600, 500)
    $form.StartPosition = "CenterScreen"
    $form.FormBorderStyle = "FixedDialog"
    $form.MaximizeBox = $false

    $label = New-Object System.Windows.Forms.Label
    $label.Text = "Select modules to include in context:"
    $label.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
    $label.Location = New-Object System.Drawing.Point(15, 15)
    $label.AutoSize = $true
    $form.Controls.Add($label)

    $info = New-Object System.Windows.Forms.Label
    $info.Text = "Found $($AvailableModules.Count) modules"
    $info.Location = New-Object System.Drawing.Point(15, 45)
    $info.AutoSize = $true
    $form.Controls.Add($info)

    $checkList = New-Object System.Windows.Forms.CheckedListBox
    $checkList.Location = New-Object System.Drawing.Point(15, 75)
    $checkList.Size = New-Object System.Drawing.Size(550, 300)
    $checkList.CheckOnClick = $true
    $checkList.Font = New-Object System.Drawing.Font("Consolas", 9)

    $sortedModules = $AvailableModules.Keys | Sort-Object
    foreach ($moduleName in $sortedModules) {
        $display = "$moduleName (" + $AvailableModules[$moduleName].FileCount + " files)"
        $checkList.Items.Add($display) | Out-Null
    }
    
    $checkList.Items.Add("-----------------------------------")
    $checkList.Items.Add("[ALL] SELECT ALL MODULES")
    $form.Controls.Add($checkList)

    $btnAll = New-Object System.Windows.Forms.Button
    $btnAll.Location = New-Object System.Drawing.Point(15, 390)
    $btnAll.Size = New-Object System.Drawing.Size(120, 30)
    $btnAll.Text = "Select All"
    $btnAll.Add_Click({
        for ($i = 0; $i -lt $sortedModules.Count; $i++) {
            $checkList.SetItemChecked($i, $true)
        }
    })
    $form.Controls.Add($btnAll)
    
    $btnNone = New-Object System.Windows.Forms.Button
    $btnNone.Location = New-Object System.Drawing.Point(145, 390)
    $btnNone.Size = New-Object System.Drawing.Size(120, 30)
    $btnNone.Text = "Deselect All"
    $btnNone.Add_Click({
        for ($i = 0; $i -lt $sortedModules.Count; $i++) {
            $checkList.SetItemChecked($i, $false)
        }
    })
    $form.Controls.Add($btnNone)

    $btnOK = New-Object System.Windows.Forms.Button
    $btnOK.Location = New-Object System.Drawing.Point(380, 420)
    $btnOK.Size = New-Object System.Drawing.Size(90, 35)
    $btnOK.Text = "Process"
    $btnOK.DialogResult = [System.Windows.Forms.DialogResult]::OK
    $btnOK.BackColor = [System.Drawing.Color]::DodgerBlue
    $btnOK.ForeColor = [System.Drawing.Color]::White
    $form.Controls.Add($btnOK)

    $btnCancel = New-Object System.Windows.Forms.Button
    $btnCancel.Location = New-Object System.Drawing.Point(480, 420)
    $btnCancel.Size = New-Object System.Drawing.Size(85, 35)
    $btnCancel.Text = "Cancel"
    $btnCancel.DialogResult = [System.Windows.Forms.DialogResult]::Cancel
    $form.Controls.Add($btnCancel)

    $result = $form.ShowDialog()
    if ($result -eq [System.Windows.Forms.DialogResult]::Cancel) { exit }

    $selected = $checkList.CheckedItems
    foreach ($item in $selected) {
        if ($item -like "*ALL MODULES*") { return @() }
    }
    
    $selectedModules = @()
    foreach ($item in $selected) {
        if ($item -match "^(.*?) \(\d+ files\)") {
            $selectedModules += $matches[1]
        }
    }
    
    return $selectedModules
}

# --- PROSES FILE ---
function Should-IncludeFile {
    param ([string]$FilePath, [string[]]$SelectedModules)
    
    if ($FilePath -match "Institusi|Core|Common|Base|Program|Startup") {
        return $true
    }
    
    if ($SelectedModules.Count -eq 0) {
        return $true
    }
    
    foreach ($module in $SelectedModules) {
        if ($FilePath -match "\\$module\\|/$module/") {
            return $true
        }
    }
    
    return $false
}

function Process-Files {
    param ([string]$Path, [string[]]$SelectedModules)
    
    $processed = 0
    $items = Get-ChildItem -Path $Path -Force -ErrorAction SilentlyContinue
    
    foreach ($item in $items) {
        if ($item.Name -eq $OutputFile -or $item.Name -eq $StructureFile) { continue }
        
        if ($item.PSIsContainer) {
            if ($PruneDirs -notcontains $item.Name) {
                $processed += Process-Files -Path $item.FullName -SelectedModules $SelectedModules
            }
        }
        else {
            if ($item.Name -match $ValidExtsPattern -and $item.Name -notmatch $FileIgnoreRegex) {
                if (Should-IncludeFile -FilePath $item.FullName -SelectedModules $SelectedModules) {
                    $relPath = $item.FullName.Substring($RootPath.Length + 1).Replace("\", "/")
                    Write-Host "     [ADD] $relPath" -ForegroundColor Cyan
                    
                    "`n--- START OF FILE $relPath ---`n" | Add-Content -Path $OutputFile -Encoding UTF8
                    
                    try {
                        $content = Get-Content -Path $item.FullName -Raw -ErrorAction Stop
                        $content | Add-Content -Path $OutputFile -Encoding UTF8
                    } catch {
                        "[Error reading file]" | Add-Content -Path $OutputFile -Encoding UTF8
                    }
                    
                    "`n--- END OF FILE $relPath ---`n" | Add-Content -Path $OutputFile -Encoding UTF8
                    $processed++
                }
            }
        }
    }
    
    return $processed
}

# --- MAIN ---
$RootPath = (Get-Location).Path
Clear-Host

Write-Host "=============================================" -ForegroundColor Magenta
Write-Host "   INTELLIGENT CODE COMBINER - ASCII v3.0" -ForegroundColor Magenta
Write-Host "   Auto Detect Project Structure" -ForegroundColor Magenta
Write-Host "=============================================" -ForegroundColor Magenta

# Save structure
Save-FolderStructure -RootPath $RootPath

# Detect modules
Write-Host ""
Write-Host "[2] Detecting modules..." -ForegroundColor Yellow
$modules = Get-AvailableModules -RootPath $RootPath

if ($modules.Count -gt 0) {
    Write-Host "     Found $($modules.Count) modules:" -ForegroundColor Green
    foreach ($m in $modules.Keys | Sort-Object) {
        Write-Host "       - $m (" + $modules[$m].FileCount + " files)" -ForegroundColor Cyan
    }
} else {
    Write-Host "     No specific modules found" -ForegroundColor Yellow
}

# User selection
Write-Host ""
Write-Host "[3] Module selection..." -ForegroundColor Yellow
$selected = Get-UserSelection -AvailableModules $modules -RootPath $RootPath

if ($selected.Count -gt 0) {
    Write-Host "     Selected modules:" -ForegroundColor Green
    foreach ($s in $selected) { Write-Host "       - $s" -ForegroundColor Cyan }
} else {
    Write-Host "     Mode: ALL modules and files" -ForegroundColor Green
}

# Process files
Write-Host ""
Write-Host "[4] Processing files..." -ForegroundColor Yellow
if (Test-Path $OutputFile) { Remove-Item $OutputFile }

$total = Process-Files -Path $RootPath -SelectedModules $selected

Write-Host ""
Write-Host "=============================================" -ForegroundColor Magenta
Write-Host "         PROCESS COMPLETE!" -ForegroundColor Magenta
Write-Host "=============================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "Structure file: $StructureFile" -ForegroundColor Cyan
Write-Host "Context file: $OutputFile" -ForegroundColor Cyan
Write-Host "Files processed: $total" -ForegroundColor Green

if (Test-Path $OutputFile) {
    $size = [math]::Round((Get-Item $OutputFile).Length / 1KB, 2)
    Write-Host "File size: $size KB" -ForegroundColor Green
}