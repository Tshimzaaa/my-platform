const curriculum = {
  analytics: {
    title: "Data Analytics",
    modules: [
      module("a1", "Analytics Foundations", "Frame business questions with KPI trees and measurable hypotheses."),
      module("a2", "Excel + Data Cleaning", "Clean messy exports and build repeatable QA checks."),
      module("a3", "SQL for Analysis", "Write business SQL with joins, windows, cohorts, and retention."),
      module("a4", "Python for Analysts", "Use pandas and NumPy for scalable analysis workflows."),
      module("a5", "EDA + Visualization", "Find patterns and communicate insights with clear visuals."),
      module("a6", "Dashboards + Storytelling", "Design decision-ready dashboards and executive narratives."),
      module("a7", "Forecasting + Experiments", "Apply A/B testing and baseline forecasting in business contexts."),
      module("a8", "Capstone + Career Launch", "Deliver portfolio-ready analytics project and interview stories.")
    ]
  },
  science: {
    title: "Data Science",
    modules: [
      module("s1", "Python Foundations", "Build robust coding patterns for data science workflows."),
      module("s2", "Math + Statistics", "Use probability and statistics for trustworthy model decisions."),
      module("s3", "EDA + Feature Engineering", "Create predictive features while preventing leakage."),
      module("s4", "Supervised ML", "Train and evaluate classification and regression models."),
      module("s5", "Unsupervised + Recommenders", "Apply clustering and recommendation strategies."),
      module("s6", "Model Evaluation", "Assess calibration, explainability, and model risks."),
      module("s7", "Deployment Basics", "Package models for APIs, batch pipelines, and monitoring."),
      module("s8", "Capstone + Career Launch", "Build end-to-end ML project and defend decisions professionally.")
    ]
  }
};

function module(id, name, objective) {
  return {
    id,
    name,
    duration: "1 week",
    objective,
    concept: "Core theory explained with intuition, formulas/logic, and practical constraints.",
    intuition: "Understand why methods work before memorizing commands.",
    relevance: "Mapped to real analyst/data scientist workflow and hiring expectations.",
    workedExample: [
      "Problem framing with business context and data constraints.",
      "Step-by-step implementation with decision checkpoints.",
      "Interpretation, tradeoffs, and action recommendation."
    ],
    exercises: {
      beginner: ["2 foundational drills", "1 guided walkthrough"],
      intermediate: ["3 applied coding/SQL tasks", "1 dataset investigation"],
      advanced: ["1 challenge case with rubric", "1 extension prompt"]
    },
    quiz: ["5 concept questions", "5 applied questions"],
    commonMistakes: ["Skipping assumptions", "No validation checks"],
    revision: "Summarize key patterns, edge cases, and interview-ready explanations.",
    assignment: "Submit notebook/SQL/dashboard with rationale and reproducibility notes.",
    dataLabTask: "Complete guided Data Lab task and reflection journal.",
    project: `Project milestone for ${name}`,
    video: "https://www.youtube.com/embed/HXV3zeQKqGY",
    datasets: [
      ["Retail", "https://www.kaggle.com/datasets/vivek468/superstore-dataset-final"],
      ["Marketing", "https://www.kaggle.com/datasets/jackdaoud/marketing-data"],
      ["Finance", "https://www.kaggle.com/datasets/laotse/credit-risk-dataset"]
    ]
  };
}

const missionTemplate = [
  { key: "lesson", label: "Lesson", mins: 35 },
  { key: "exercise", label: "Exercises", mins: 45 },
  { key: "lab", label: "Data Lab", mins: 35 },
  { key: "quiz", label: "Quiz", mins: 20 },
  { key: "revision", label: "Revision", mins: 15 }
];

let selectedPath = localStorage.getItem("path") || "analytics";
let selectedModuleId = localStorage.getItem("moduleId") || curriculum[selectedPath].modules[0].id;
let currentView = "dashboard";
let completed = JSON.parse(localStorage.getItem("completed") || "[]");
const today = new Date().toISOString().split("T")[0];
let mission = JSON.parse(localStorage.getItem("mission") || "{}");
let streak = JSON.parse(localStorage.getItem("streak") || '{"last":null,"count":0,"week":[]}');

const moduleList = document.getElementById("moduleList");
const viewContent = document.getElementById("viewContent");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");

function save() {
  localStorage.setItem("path", selectedPath);
  localStorage.setItem("moduleId", selectedModuleId);
  localStorage.setItem("completed", JSON.stringify(completed));
  localStorage.setItem("mission", JSON.stringify(mission));
  localStorage.setItem("streak", JSON.stringify(streak));
}

function getProgram() {
  return curriculum[selectedPath];
}

function getModule() {
  return getProgram().modules.find((m) => m.id === selectedModuleId) || getProgram().modules[0];
}

function percentDone() {
  const modules = getProgram().modules;
  const done = modules.filter((m) => completed.includes(m.id)).length;
  return { done, total: modules.length, pct: Math.round((done / modules.length) * 100) };
}

function ensureMissionDay() {
  if (!mission[today]) {
    mission[today] = { lesson: false, exercise: false, lab: false, quiz: false, revision: false };
  }
}

function updateStreak() {
  const allDone = Object.values(mission[today]).every(Boolean);
  if (allDone && streak.last !== today) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const yesterday = d.toISOString().split("T")[0];
    streak.count = streak.last === yesterday ? streak.count + 1 : 1;
    streak.last = today;
    streak.week = [...new Set([...(streak.week || []), today])].slice(-7);
  }
}

function renderModules() {
  moduleList.innerHTML = "";
  const modules = getProgram().modules;
  modules.forEach((mod, index) => {
    const done = completed.includes(mod.id);
    const unlocked = index <= modules.filter((m) => completed.includes(m.id)).length;
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = `btn module-btn ${selectedModuleId === mod.id ? "active" : ""}`;
    btn.disabled = !unlocked && !done;
    btn.innerHTML = `<span>${done ? "✅" : unlocked ? "•" : "🔒"}</span><span>${mod.name}</span>`;
    btn.onclick = () => {
      selectedModuleId = mod.id;
      currentView = "lesson";
      save();
      render();
    };
    li.appendChild(btn);
    moduleList.appendChild(li);
  });

  const p = percentDone();
  progressText.textContent = `${p.pct}%`;
  progressBar.style.width = `${p.pct}%`;
}

function renderDashboard() {
  ensureMissionDay();
  const active = getModule();
  const p = percentDone();
  const doneToday = Object.values(mission[today]).filter(Boolean).length;
  const weekly = (streak.week || []).length;

  viewContent.innerHTML = `
    <section class="hero">
      <div>
        <h2>Today's Mission</h2>
        <p>${today} • ${active.name}</p>
      </div>
      <span class="badge">${Math.round((doneToday / missionTemplate.length) * 100)}% complete</span>
    </section>

    <section class="kpi-grid">
      <article class="kpi-card"><h3>Program Progress</h3><p>${p.done}/${p.total} modules</p></article>
      <article class="kpi-card"><h3>Weekly Progress</h3><p>${weekly}/5 target days</p></article>
      <article class="kpi-card"><h3>Learning Streak</h3><p>${streak.count || 0} days</p></article>
      <article class="kpi-card"><h3>Upcoming Module</h3><p>${nextModuleName()}</p></article>
    </section>

    <section class="grid-2">
      <article class="panel-card">
        <h3>Mission Checklist</h3>
        <ul class="checklist" id="missionList"></ul>
      </article>
      <article class="panel-card">
        <h3>Recent Achievements</h3>
        <ul class="achievements">
          ${achievementItems().map((a) => `<li>${a}</li>`).join("")}
        </ul>
      </article>
    </section>
  `;

  const missionList = document.getElementById("missionList");
  missionTemplate.forEach((item) => {
    const checked = mission[today][item.key];
    const li = document.createElement("li");
    li.innerHTML = `
      <label>
        <input type="checkbox" data-key="${item.key}" ${checked ? "checked" : ""}/>
        <span>${item.label}</span>
      </label>
      <small>~${item.mins} min</small>
    `;
    missionList.appendChild(li);
  });

  missionList.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", (e) => {
      mission[today][e.target.dataset.key] = e.target.checked;
      updateStreak();
      save();
      renderDashboard();
    });
  });
}

function renderRoadmap() {
  const modules = getProgram().modules;
  const completedCount = modules.filter((m) => completed.includes(m.id)).length;
  viewContent.innerHTML = `
    <h2>Learning Roadmap</h2>
    <p>Track completed sections, current focus, and locked future modules.</p>
    <div class="roadmap">
      ${modules
        .map((m, i) => {
          const status = completed.includes(m.id) ? "completed" : i === completedCount ? "current" : "locked";
          return `<article class="roadmap-item ${status}"><h3>${m.name}</h3><p>${m.objective}</p><span>${status}</span></article>`;
        })
        .join("")}
    </div>
  `;
}

function renderLesson() {
  const m = getModule();
  viewContent.innerHTML = `
    <h2>${m.name}</h2>
    <p><strong>Duration:</strong> ${m.duration}</p>
    <p><strong>Lesson explanation:</strong> ${m.concept}</p>
    <p><strong>Intuition:</strong> ${m.intuition}</p>
    <p><strong>Real-world relevance:</strong> ${m.relevance}</p>

    <h3>Code / Worked Example</h3>
    <ol>${m.workedExample.map((x) => `<li>${x}</li>`).join("")}</ol>

    <div class="grid-3">
      <article class="panel-card"><h4>Beginner Exercises</h4><ul>${m.exercises.beginner.map((x) => `<li>${x}</li>`).join("")}</ul></article>
      <article class="panel-card"><h4>Intermediate Exercises</h4><ul>${m.exercises.intermediate.map((x) => `<li>${x}</li>`).join("")}</ul></article>
      <article class="panel-card"><h4>Advanced Challenge</h4><ul>${m.exercises.advanced.map((x) => `<li>${x}</li>`).join("")}</ul></article>
    </div>

    <h3>Quiz</h3>
    <ul>${m.quiz.map((x) => `<li>${x}</li>`).join("")}</ul>
    <p><strong>Common mistakes:</strong> ${m.commonMistakes.join("; ")}</p>
    <p><strong>Revision summary:</strong> ${m.revision}</p>

    <div class="lesson-actions">
      <button class="btn btn-primary" id="completeBtn">Mark Lesson Complete</button>
      <button class="btn btn-ghost" id="prevBtn">Previous</button>
      <button class="btn btn-ghost" id="nextBtn">Next</button>
    </div>
  `;

  document.getElementById("completeBtn").onclick = () => {
    if (!completed.includes(m.id)) completed.push(m.id);
    save();
    render();
  };
  document.getElementById("prevBtn").onclick = () => stepModule(-1);
  document.getElementById("nextBtn").onclick = () => stepModule(1);
}

function renderLab() {
  const m = getModule();
  viewContent.innerHTML = `
    <h2>Data Lab Interface</h2>
    <div class="lab-layout">
      <section class="panel-card">
        <h3>Task Instructions</h3>
        <p>${m.dataLabTask}</p>
        <h4>Dataset Viewer</h4>
        <ul>${m.datasets.map(([name]) => `<li>${name}</li>`).join("")}</ul>
      </section>
      <section class="panel-card">
        <h3>Notebook-style Coding Area</h3>
        <textarea class="code-box" spellcheck="false"># Write your Python or SQL draft\n# 1) inspect data\n# 2) clean\n# 3) analyze/model\n# 4) summarize insight</textarea>
        <h4>Output Visualization</h4>
        <div class="viz-placeholder">Charts and tables preview area</div>
        <button class="btn btn-primary">Submit Lab Task</button>
      </section>
    </div>
  `;
}

function renderProjects() {
  const modules = getProgram().modules;
  viewContent.innerHTML = `
    <h2>Projects</h2>
    <p>Manage available projects, completion status, and portfolio outputs.</p>
    <div class="roadmap">
      ${modules
        .map(
          (m) => `<article class="roadmap-item ${completed.includes(m.id) ? "completed" : "current"}">
            <h3>${m.project}</h3>
            <p>${m.assignment}</p>
            <p><strong>Status:</strong> ${completed.includes(m.id) ? "Completed" : "In progress"}</p>
            <p><strong>Portfolio output:</strong> Notebook/SQL/Dashboard + README</p>
          </article>`
        )
        .join("")}
    </div>
  `;
}

function nextModuleName() {
  const modules = getProgram().modules;
  const done = modules.filter((m) => completed.includes(m.id)).length;
  return modules[Math.min(done, modules.length - 1)].name;
}

function achievementItems() {
  const p = percentDone();
  const base = [`${p.done} modules completed`, `${streak.count || 0}-day streak active`];
  if (p.done >= 3) base.push("Consistency Badge: Momentum Builder");
  if (p.done >= 6) base.push("Execution Badge: Project Driver");
  return base;
}

function stepModule(delta) {
  const modules = getProgram().modules;
  const idx = modules.findIndex((m) => m.id === selectedModuleId);
  const next = Math.min(modules.length - 1, Math.max(0, idx + delta));
  selectedModuleId = modules[next].id;
  save();
  render();
}

function renderMain() {
  if (currentView === "roadmap") renderRoadmap();
  else if (currentView === "lesson") renderLesson();
  else if (currentView === "lab") renderLab();
  else if (currentView === "projects") renderProjects();
  else renderDashboard();
}

function switchPath(path) {
  selectedPath = path;
  selectedModuleId = getProgram().modules[0].id;
  document.getElementById("analyticsBtn").classList.toggle("active", path === "analytics");
  document.getElementById("scienceBtn").classList.toggle("active", path === "science");
  document.getElementById("analyticsBtn").setAttribute("aria-selected", String(path === "analytics"));
  document.getElementById("scienceBtn").setAttribute("aria-selected", String(path === "science"));
  save();
  render();
}

function render() {
  renderModules();
  renderMain();
}

document.getElementById("analyticsBtn").onclick = () => switchPath("analytics");
document.getElementById("scienceBtn").onclick = () => switchPath("science");
document.getElementById("resetBtn").onclick = () => {
  completed = [];
  mission[today] = { lesson: false, exercise: false, lab: false, quiz: false, revision: false };
  streak = { last: null, count: 0, week: [] };
  save();
  render();
};

document.querySelectorAll(".btn-tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".btn-tab").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentView = btn.dataset.view;
    renderMain();
  });
});

render();
