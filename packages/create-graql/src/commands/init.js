import spawn from 'cross-spawn';

function create(project) {
  const spawnOptions = ['graql', project];

  spawn('yo', spawnOptions, { shell: true, stdio: 'inherit' });
}

export default create;
