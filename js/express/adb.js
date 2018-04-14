const spawn = require('child_process').exec;
const ls = spawn(' ~/Desktop/adt-bundle-mac-x86_64-20140702/sdk/platform-tools/adb devices');
ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});