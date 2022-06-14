const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const $TASK_TEMPLATE = $("#task-template").content;
const $TASK_FORM = $("#task-form");
const $TASKS_SECT = $(".tasks-sect");
const $ERROR_PGPH = $(".error-pgph");
const $TASK_PGPH = $("#task-pgph");
const $MINUTES_SPAN = $("#minutes");
const $SECONDS_SPAN = $("#seconds");

let isErrorMessageOn = false;
let lastErrorType = "";

function addTask(e) {
  e.preventDefault();
  try {
    let [task] = [...new FormData($TASK_FORM).values()];
    const TASK = task.trim();
    console.log(TASK);
    if (TASK.length === 0)
      throw { type: "length", warn: "Please enter at least 1 character" };

    const $TEMPLATE_CLONE = $TASK_TEMPLATE.cloneNode(true);
    const $TASK_TITLES = Array.from($$("h2.task__title")).map(
      (el) => el.textContent
    );

    if ($TASK_TITLES.includes(TASK))
      throw { type: "already exists", warn: "This task already exists" };
    else {
      $ERROR_PGPH.style.display = "none";
      $TEMPLATE_CLONE.querySelector(".task__title").textContent = TASK;
      $TASKS_SECT.appendChild($TEMPLATE_CLONE);
    }
    e.target.task.value = "";
  } catch (error) {
    if (!isErrorMessageOn || lastErrorType !== error.type) {
      $ERROR_PGPH.textContent = error.warn;
      $ERROR_PGPH.style.display = "block";
      isErrorMessageOn = true;
      setTimeout(() => {
        $ERROR_PGPH.style.display = "none";
        isErrorMessageOn = false;
      }, 2000);
    }
    return;
  }
}

let interval;
let isIntervalActive = false;

function renderTimer(e) {
  if (isIntervalActive) return console.log("returned in renderTimer");
  isIntervalActive = true;

  $TASK_PGPH.textContent =
    e.target.parentElement.parentElement.querySelector(".task__title").textContent;
  e.target.textContent = "Finish";
  e.target.classList.add("finish-task-btn");
  e.target.classList.remove("task__start-btn");
  e.target.parentElement.querySelector(".task__status").textContent =
    "In progress...";
  e.target.parentElement.parentElement.classList.add("in-progress");
  let minutes = 24;
  let seconds = 59;

  $SECONDS_SPAN.textContent = seconds.toString().padStart(2, 0);
  $MINUTES_SPAN.textContent = minutes.toString().padStart(2, 0);

  interval = setInterval(() => {
    if (seconds === 0) {
      minutes -= 1;
      seconds = 59;
    } else seconds -= 1;
    console.log({ seconds, minutes });
    $SECONDS_SPAN.textContent = seconds.toString().padStart(2, 0);
    $MINUTES_SPAN.textContent = minutes.toString().padStart(2, 0);
    if (minutes === 0 && seconds === 0) {
      clearInterval(interval);
      // isIntervalActive = false;
      renderBreak(e);

      e.target.parentElement.querySelector(".task__status").textContent =
        "break";
    }
  }, 1000);
}

function renderBreak(e) {
  // if (isIntervalActive) return console.log("returned in renderBreak");
  let minutes = 4;
  let seconds = 59;
  $TASK_PGPH.textContent = "Take a break"
  $SECONDS_SPAN.textContent = seconds.toString().padStart(2, 0);
  $MINUTES_SPAN.textContent = minutes.toString().padStart(2, 0);

  interval = setInterval(() => {
    if (seconds === 0) {
      minutes -= 1;
      seconds = 59;
    } else seconds -= 1;
    console.log({ seconds, minutes });
    $SECONDS_SPAN.textContent = seconds.toString().padStart(2, 0);
    $MINUTES_SPAN.textContent = minutes.toString().padStart(2, 0);
    if (minutes === 0 && seconds === 0) {
      clearInterval(interval);
      isIntervalActive = false;
      renderTimer(e);
    }
  }, 1000);
}

function finishTask(e) {
  clearInterval(interval);
  isIntervalActive = false;

  $TASK_PGPH.textContent = "Your task will be here"
  $SECONDS_SPAN.textContent = "00";
  $MINUTES_SPAN.textContent = "00";
  e.target.parentElement.parentElement.classList.remove("in-progress");
  e.target.parentElement.parentElement.classList.add("completed");
  e.target.parentElement.querySelector(".task__status").textContent =
    "Completed";

  e.target.textContent = "Delete";
  e.target.classList.add("delete-task-btn");
  e.target.classList.remove("finish-task-btn");
}

// function deleteTask(e) {}

$TASK_FORM.addEventListener("submit", addTask);

document.addEventListener("click", (e) => {
  if (e.target.matches(".task__start-btn")) {
    renderTimer(e);
    console.log("task started :)");
  } else if (e.target.matches(".finish-task-btn")) {
    finishTask(e);
    console.log("task finished :)");
  } else if (e.target.matches(".delete-task-btn")) {
    e.target.parentElement.parentElement.outerHTML = "";
    console.log("task deleted :)");
  }
});
