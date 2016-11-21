const log = (...args) => window.name === 'TRUNGDQ_DEBUG' && console.log.call(console, '[chrome-vim]', ...args);

// notation => function
const COMMANDS = {
  'C-u': () => {
    window.scrollBy(0, -window.innerHeight/2)
  },
  'C-d': () => {
    window.scrollBy(0, window.innerHeight/2)
  },
}
const keyStack = [];

function composeNotation(metaKey, key) {
  return metaKey + '-' + key;
}

function execute(notation) {
  COMMANDS[notation]();
}

function match(notation) {
  const find = Object.keys(COMMANDS).filter(
    n => n.startsWith(notation)
  );

  log(find);

  switch (find.length) {
      case 0: return 'not_found';
      case 1: return 'found';
      default: return 'found_multiple_commands';
  }
}

window.addEventListener('keydown', e => {
  log(e);
  const metaKey = e.ctrlKey ? 'C' : '';
  const key = e.key;
  keyStack.push(key);

  const notation = composeNotation(metaKey, keyStack.join(''));
  const check = match(notation);
  log(notation);
  log(check);
  if (check === 'found_multiple_commands') {
    // wait for further keys
  } else if (check === 'found') {
    execute(notation);
    keyStack.length = 0;
  } else if (check === 'not_found') {
    keyStack.length = 0;
  } else {
    console.error('[chrome-vim] Developer sucks! check: ', check);
  }
}, false);
