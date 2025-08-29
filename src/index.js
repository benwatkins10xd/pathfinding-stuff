const CANVAS_ID = "grid-canvas";
const SQUARE_SIZE_PX = 10;
const CANVAS_HEIGHT_PX = 600;
const CANVAS_WIDTH_PX = 1000;
const COLS = Math.floor(CANVAS_WIDTH_PX / SQUARE_SIZE_PX);
const ROWS = Math.floor(CANVAS_HEIGHT_PX / SQUARE_SIZE_PX);

const NODE_TYPE = {
  EMPTY: 0,
  WALL: 1,
  START: 2,
  END: 3,
};

const NODE_COLORS = {
  [NODE_TYPE.EMPTY]: "#111",
  [NODE_TYPE.WALL]: "#666",
  [NODE_TYPE.START]: "#00FF00",
  [NODE_TYPE.END]: "#FF0000",
};

let gridState = [];
let currentDrawMode = "wall";

function initGrid() {
  for (let col = 0; col < COLS; col++) {
    gridState[col] = [];
    for (let row = 0; row < ROWS; row++) {
      gridState[col][row] = NODE_TYPE.EMPTY;
    }
  }
}

function draw(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, CANVAS_WIDTH_PX, CANVAS_HEIGHT_PX);

  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      const cellType = gridState[col][row];
      const color = NODE_COLORS[cellType];

      const x = col * SQUARE_SIZE_PX;
      const y = row * SQUARE_SIZE_PX;

      ctx.fillStyle = color;
      ctx.fillRect(x, y, SQUARE_SIZE_PX, SQUARE_SIZE_PX);

      ctx.strokeStyle = "#333";
      ctx.strokeRect(x, y, SQUARE_SIZE_PX, SQUARE_SIZE_PX);
    }
  }
}

function clearNodeType(type) {
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      if (gridState[col][row] === type) {
        gridState[col][row] = NODE_TYPE.EMPTY;
      }
    }
  }
}

function setupInteraction(canvas) {
  const drawSelect = document.getElementById("draw-select");
  drawSelect.addEventListener("change", function (event) {
    currentDrawMode = event.target.value;
  });

  canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const col = Math.floor(mouseX / SQUARE_SIZE_PX);
    const row = Math.floor(mouseY / SQUARE_SIZE_PX);

    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) {
      return;
    }

    // only allow 1 start and 1 end node
    if (currentDrawMode === "start") {
      clearNodeType(NODE_TYPE.START);
      gridState[col][row] = NODE_TYPE.START;
    } else if (currentDrawMode === "end") {
      clearNodeType(NODE_TYPE.END);
      gridState[col][row] = NODE_TYPE.END;
    } else if (currentDrawMode === "wall") {
      gridState[col][row] = NODE_TYPE.WALL;
    } else if (currentDrawMode === "erase") {
      gridState[col][row] = NODE_TYPE.EMPTY;
    }

    draw(canvas);
  });
}

function main() {
  const canvas = document.getElementById(CANVAS_ID);
  if (!canvas.getContext) {
    // real IE8 hours
    throw new Error("Error: browser doesn't support canvas");
  }
  canvas.height = CANVAS_HEIGHT_PX;
  canvas.width = CANVAS_WIDTH_PX;

  initGrid();
  setupInteraction(canvas);
  draw(canvas);
}

main();
