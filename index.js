const log = (...args) => window.name === 'TRUNGDQ_DEBUG' && console.log.call(console, '[chrome-vim]', ...args);

// notation => function
const COMMANDS = {
  'C-u': () => {
    window.scrollBy(0, -window.innerHeight/2);
  },
  'C-d': () => {
    window.scrollBy(0, window.innerHeight/2);
  },
  'gg': () => {
    window.scrollTo(0, 0);
  },
  'G': () => {
    window.scrollTo(0, Number.MAX_SAFE_INTEGER)
  },
}

const keyStack = [];

function composeNotation(metaKey, key) {
  return metaKey + key;
}

function showIncompleteCommand(notation) {
  let element = document.getElementById('chrome-vim');
  if (!element) {
    document.body.insertAdjacentHTML('beforeend', `
      <div id="chrome-vim" style="position: fixed; background: yellow; bottom: 0; right: 0"></div>
    `);
    element = document.getElementById('chrome-vim');
  }
  element.innerText = notation;
}

function hideIncompleteCommand() {
  let element = document.getElementById('chrome-vim');
  element && element.parentNode.removeChild(element);
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
    case 1:
      if (find[0].length === notation.length) {
        return 'found';
      } else {
        return 'found_but_not_complete';
      }
    default: return 'found_multiple_commands';
  }
}

window.addEventListener('keydown', e => {
  log(e);
  const metaKey = e.ctrlKey ? 'C-' : '';
  const key = e.key;
  keyStack.push(key);

  const notation = composeNotation(metaKey, keyStack.join(''));
  const check = match(notation);
  log(notation);
  log(check);
  if (check === 'found_multiple_commands' || check === 'found_but_not_complete') {
    // wait for further keys
    showIncompleteCommand(notation);
  } else if (check === 'found') {
    execute(notation);
    keyStack.length = 0;
    hideIncompleteCommand();
  } else if (check === 'not_found') {
    keyStack.length = 0;
    hideIncompleteCommand();
  } else {
    console.error('[chrome-vim] Developer sucks! check: ', check);
  }
}, false);

log('Loaded.');
