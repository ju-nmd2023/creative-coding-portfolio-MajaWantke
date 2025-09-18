const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");
const githubLink = document.getElementById("github");
const nameText = document.getElementById("name");
const descriptionText = document.getElementById("description");
const backgroundText = document.getElementById("background");
const p5container = document.getElementById("p5container");

let currentExperiment = 0;
let experiments = [];

fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    experiments = data;
    if (experiments.length > 0) {
      goToExperiment(0);
    }
  });

function goToExperiment(index) {
  const experiment = experiments[index];
  if (!experiment) {
    return;
  }
  p5container.innerHTML = "";

  const iframe = document.createElement("iframe");
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";

  const iframeHTML = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${experiment.name}</title>
        <script src="https://cdn.jsdelivr.net/npm/p5@1.7.0/lib/p5.js"></script>
        <script src="https://unpkg.com/ml5@latest/dist/ml5.min.js"></script>
        <script src="${experiment.file}"></script>
        <style>
          html, body { margin:0; padding:0; overflow:hidden; }
          canvas { display:block; }
        </style>
      </head>
      <body></body>
    </html>
  `;

  iframe.srcdoc = iframeHTML;
  p5container.appendChild(iframe);

  nameText.innerText = experiment.name;
  descriptionText.innerText = experiment.description;
}

nextButton.addEventListener("click", () => {
  currentExperiment++;
  if (currentExperiment >= experiments.length) {
    currentExperiment = 0;
  }
  goToExperiment(currentExperiment);
});

prevButton.addEventListener("click", () => {
  currentExperiment--;
  if (currentExperiment < 0) {
    currentExperiment = experiments.length - 1;
  }
  goToExperiment(currentExperiment);
});
