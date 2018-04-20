var electronInstaller = require('electron-winstaller');
resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: '点餐-win32-x64',
    outputDirectory: 'installer64',
    authors: 'My App Inc.',
    exe: '点餐.exe'
  });