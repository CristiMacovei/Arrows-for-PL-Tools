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

function getSequenceCells(): HTMLInputElement[][] {
  const table = document.querySelector('.rightside-text > table');

  const rows = Array.from(table.querySelectorAll('tr')).slice(1);

  const cells = rows.map((row) => Array.from(row.querySelectorAll('input')));

  return cells;
}

function getOrganigramCells(): HTMLInputElement[][] {
  const table = document.querySelector('.content > div > table:nth-child(3)');

  const rows = Array.from(table.querySelectorAll('tr')).slice(1, -1);

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

  const siteMode = getMode();

  let cells = [[]];

  if (siteMode === 'Karnaugh') {
    cells = getKarnaughCells();
  } else if (siteMode === 'Sequence') {
    cells = getSequenceCells();
  } else if (siteMode === 'Organigram') {
    cells = getOrganigramCells();
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

async function waitForModeChange(
  oldMode,
  triesRemaining = 20
): Promise<string> {
  console.log(
    `[Arrows - INFO] Waiting for mode to change out of '${oldMode}' (${triesRemaining} tries left)`
  );
  const mode = getMode();

  if (mode !== oldMode || triesRemaining === 0) {
    return mode;
  }

  await new Promise((r) => setTimeout(r, 100));
  return await waitForModeChange(oldMode, triesRemaining - 1);
}

function main() {
  console.log(`[Arrows - INFO] running...`);

  // once when page loads
  console.log(`[Arrows - INFO] Setting Key Listeners ...`);
  setKeyListeners();

  // reset every time a navbar link is clicked
  let currentMode = getMode();
  const navbarLinks = Array.from(document.querySelectorAll('.navbar > a'));
  navbarLinks.forEach((link) => {
    link.addEventListener('click', async (evt) => {
      const newMode = await waitForModeChange(currentMode);

      if (newMode !== currentMode) {
        currentMode = newMode;
        console.log(`[Arrows - INFO] Setting Key Listeners ...`);
        setKeyListeners();
      }
    });
  });
}

main();
