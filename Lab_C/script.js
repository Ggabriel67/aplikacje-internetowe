const canvasWidth = 900;
const canvasHeight = 616;
const gridDim = 4;
let remainingFragments = gridDim ** 2;

let map = L.map('map').setView([53.430127, 14.564802], 17);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);

setTimeout(() => {
  map.invalidateSize();
}, 500);


function notifyUser() {
  if (Notification.permission === "granted") {
    new Notification("Udało ci się ułożyć puzzle!");
  }
}

function fragmentpos(fragment, cell) {
  const correctX = fragment.dataset.correctX;
  const correctY = fragment.dataset.correctY;
  const cellX = cell.dataset.posX;
  const cellY = cell.dataset.posY;

  return correctX === cellX && correctY === cellY;
}


function updatePuzzleData() {
  const cells = document.querySelectorAll("#grid td");
  let incorrectCount = 0;

  cells.forEach((c) => {
    const fragment = c.firstChild;
    if (fragment && fragment.dataset) {
      const correctX = fragment.dataset.correctX;
      const correctY = fragment.dataset.correctY;
      const cellX = c.dataset.posX;
      const cellY = c.dataset.posY;

      if (correctX !== cellX || correctY !== cellY) {
        incorrectCount++;
      }
    } else {
      incorrectCount++;
    }
  });

  remainingFragments = incorrectCount;

  if (remainingFragments === 0) {
    notifyUser();
  }
}

function generatePuzzleGrid(gridDim) {
  const puzzleDiv = document.getElementById("puzzle");
  puzzleDiv.innerHTML = "";

  const table = document.createElement("table");
  table.id = "grid";

  for (let y = 0; y < gridDim; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < gridDim; x++) {
      const cell = document.createElement("td");
      cell.dataset.posX = x;
      cell.dataset.posY = y;

      cell.addEventListener("dragenter", function () {
        this.style.border = "2px solid #7FE9D9";
      });
      cell.addEventListener("dragleave", function () {
        this.style.border = "2px solid #333";
      });
      cell.addEventListener("dragover", function (e) {
        e.preventDefault();
      });
      cell.addEventListener("drop", function (e) {
        e.preventDefault();
        this.style.border = "2px solid #333";

        const fragmentId = e.dataTransfer.getData("text");
        const fragment = document.getElementById(fragmentId);

        let wasReplaced = false;
        if (this.firstChild) {
          document.getElementById("fragments").appendChild(this.firstChild);
          wasReplaced = true;
        }

        this.appendChild(fragment);
        const fragmentCorrect = fragmentpos(fragment, this);
        updatePuzzleData(wasReplaced, fragmentCorrect);
      });

      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  puzzleDiv.appendChild(table);
}


document.getElementById("saveMap").addEventListener("click", function () {
  map.invalidateSize();

  setTimeout(() => {
    leafletImage(map, function (error, canvas) {
      if (error || !canvas) {
        alert("Nie udało się pobrać mapy");
        return;
      }

      const fragmentWidth = canvasWidth / gridDim;
      const fragmentHeight = canvasHeight / gridDim;

      const fragmentContainer = document.getElementById("fragments");
      fragmentContainer.innerHTML = "";

      // let raster = document.getElementById("raster");
      // raster.width = canvasWidth;
      // raster.height = canvasHeight
      // raster.getContext("2d").drawImage(canvas, 0, 0, canvasWidth, canvasHeight);

      const fragments = [];
      let fragmentId = 0;
      for (let y = 0; y < gridDim; y++) {
        for (let x = 0; x < gridDim; x++) {
          const canvasFragment = document.createElement("canvas");
          canvasFragment.width = fragmentWidth;
          canvasFragment.height = fragmentHeight;
          const ctx = canvasFragment.getContext("2d");

          ctx.drawImage(canvas, x * fragmentWidth, y * fragmentHeight, fragmentWidth, fragmentHeight, 0, 0, fragmentWidth, fragmentHeight);

          const img = document.createElement("img");
          img.id = fragmentId;
          img.src = canvasFragment.toDataURL();

          img.height = fragmentHeight;
          img.width = fragmentWidth;

          img.dataset.correctX = x;
          img.dataset.correctY = y;
          
          img.draggable = true;
          
          img.classList.add("fragment");

          fragments.push(img);
          fragmentId++;
        }
      }

      for (let i = fragments.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fragments[i], fragments[j]] = [fragments[j], fragments[i]];
      }

      fragments.forEach((f) => fragmentContainer.appendChild(f));
    });
  }, 500);
});


document.addEventListener("dragstart", function (e) {
  if (e.target.classList.contains("fragment")) {
    e.dataTransfer.setData("text", e.target.id);
  }
});

document.getElementById("loadLocation").addEventListener("click", function () {
  if (!navigator.geolocation) {
    alert("Błąd geolokacji");
    return;
  }

  navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      map.setView([lat, lon]);
      marker = L.marker([lat, lon]).addTo(map);
    }, (error) => {
      alert(`Błąd geolokacji: ${error.message}`);
    }
  );
});

document.addEventListener("DOMContentLoaded", function () {
  Notification.requestPermission();
  generatePuzzleGrid(gridDim);
});
