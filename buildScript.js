import fs from 'fs';
import fse from 'fs-extra';
import childProcess from 'child_process';

if (fs.existsSync('./build')) {
  fse.removeSync('./build')
}

// Run 'react-scripts build' script
childProcess.execSync('react-scripts build', { stdio: 'inherit' })

// Move app build to server/build directory
fse.moveSync('./build', './public/build', { overwrite: true })
