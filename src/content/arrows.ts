enum KEY_CODES {
  LEFT_ARROW = 37,
  UP_ARROW = 38,
  RIGHT_ARROW = 39,
  DOWN_ARROW = 40,
  DELETE = 46,
  BACKSPACE = 8,
}

function getMode(): string {
  return document.querySelector('.selected-navbar')?.textContent ?? 'None';
}

function getKarnaughCells(): HTMLInputElement[][] {
  const table = document.querySelector('.rightside > table');

  const rows = Array.from(table.querySelectorAll('tr')).slice(1);

  const cells = rows.map((row) => Array.from(row.querySelectorAll('input')));

  return cells;
}

function makeKeymaps(cells: HTMLInputElement[][], skipOnInput = false): void {
  const n = cells.length;
  const m = cells[0].length;

  for (let i = 0; i < n; ++i) {
    for (let j = 0; j < m; ++j) {
      const iUpper = (i - 1 + n) % n;
      const iLower = (i + 1) % n;

      const jLeft = (j - 1 + m) % m;
      const jRight = (j + 1) % m;

      cells[i][j].addEventListener('keyup', (evt) => {
        // event.code is not supported by all browsers apparently
        const eventKeyCode = evt.code ?? evt.keyCode;
        console.log(
          `[Arrows - INFO] ${eventKeyCode} pressed on cell (${i}, ${j})`
        );

        // move to prev
        if (
          eventKeyCode === 'ArrowLeft' ||
          eventKeyCode === KEY_CODES.LEFT_ARROW
        ) {
          const iPrev = j == 0 ? iUpper : i;

          cells[iPrev][jLeft].focus();

          return;
        }

        // move one up
        if (eventKeyCode === 'ArrowUp' || eventKeyCode === KEY_CODES.UP_ARROW) {
          cells[iUpper][j].focus();
          return;
        }

        // move one down
        if (
          eventKeyCode === 'ArrowDown' ||
          eventKeyCode === KEY_CODES.DOWN_ARROW
        ) {
          cells[iLower][j].focus();
          return;
        }

        // move to the next
        if (
          skipOnInput ||
          eventKeyCode === 'ArrowRight' ||
          eventKeyCode === KEY_CODES.RIGHT_ARROW
        ) {
          const iNext = j == m - 1 ? iLower : i;

          cells[iNext][jRight].focus();
        }
      });
    }
  }
}

async function setKeyListeners(triesRemaining = 20) {
  if (triesRemaining === 0) {
    console.log(
      `[Arrows - ERROR] Found no cells and no tries left (this should not happen), exiting...`
    );
    return;
  }

  console.log(`[Arrows - INFO] Setting Key Listeners ...`);
  const siteMode = getMode();

  let cells = [[]];

  if (siteMode === 'Karnaugh') {
    cells = getKarnaughCells();
  }

  if (cells.length === 0) {
    console.log(
      `[Arrows - WARN] Found no cells, retrying after 100ms (${triesRemaining} tries remaining)`
    );
    await new Promise((r) => setTimeout(r, 100));
    setKeyListeners(triesRemaining - 1);
    return;
  }

  console.log(`[Arrows - INFO] Found cells`, cells);
  makeKeymaps(cells);
}

function main() {
  console.log(`[Arrows - INFO] running...`);

  // once when page loads
  setKeyListeners();

  // reset every time a navbar link is clicked
  const navbarLinks = Array.from(document.querySelectorAll('.navbar > a'));
  navbarLinks.forEach((link) => {
    link.addEventListener('click', async (evt) => {
      // await new Promise((r) => setTimeout(r, 1000)); // maybe?
      setKeyListeners();
    });
  });
}

main();
