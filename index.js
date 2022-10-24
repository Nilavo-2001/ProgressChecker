let title = document.getElementById("taskTitle");
let add = document.getElementById("button-addon2"); // add button
let dlist = document.getElementById("list"); // item list
let progressBar = document.querySelector(".progress-bar");
let option = document.querySelector("option");
let select = document.getElementById("selectMonth");
const input = document.getElementById("datepicker");
let date = new Date();
function createTask(title, done) {
  //constructor to create a task
  this.title = title;
  this.done = done;
}
function createDay(progress, tasks) {
  //constructor to create a day
  this.progress = progress;
  this.tasks = tasks;
}
const picker = MCDatepicker.create({
  // intialising the date picker object
  el: "#datepicker",
  theme: {
    theme_color: "#7F8487",
  },
});
picker.onSelect((date) => {
  // on selecting a date
  let month = JSON.parse(localStorage.getItem(picker.getMonth() + "")); // fetching month array
  if (month && month[picker.getDate() - 1]) {
    // checks if the month and day exsists
    showList(month[picker.getDate() - 1].tasks);
  } else {
    showList(null);
  }
  showProgress(calDayProgress()); // to re-render the progress bar
  if (input.getAttribute("value") == "") {
    input.setAttribute("value", "Select Date"); // if no date is selected then show Select Date
  }
});
picker.onCancel(() => {
  if (input.getAttribute("value") == "") {
    input.setAttribute("value", "Select Date"); // if no date is selected then show Select Date
  }
});
startPage();
function showList(List) {
  console.log(List);
  if (List == null || List.length == 0) {
    // if the list is null or of zero length then show no task to show
    dlist.innerHTML = `<h1 class="display-3">No Task to show </h1>`;
    return;
  }
  //console.log(List);
  let code = "";
  List.forEach((element, index) => {
    // using the list array to create li tags to show each task
    code += `<li>       
    <input
      type="checkbox"
      id="${index}"
      data-id="${index}"
      class="custom-checkbox"
      onCLick="toggle(event)"
      ${element.done ? "checked" : ""}
    />
    <label for="${index}">${element.title}</label>
    <button
      type="button"
      class="btn-close"
      aria-label="Close"
      onclick="deleteTask(event)"
      data-id="${index}"
    ></button>
  </li>`;
  });
  // appneding all the li tags inside the ul tah
  dlist.innerHTML = code;
}
function addTask(title, month, day) {
  // checking if the month has null and assigning it current month
  if (month == null) {
    month = date.getMonth();
  }
  if (day == null) {
    day = date.getDate();
  }
  // creating a new task
  let task = new createTask(title, false);
  // if the month does'nt exsist the creating month and then day and the task array for that day
  let monthArr = [];

  if (localStorage.getItem(month + "") != null) {
    monthArr = JSON.parse(localStorage.getItem(month + ""));
  }
  if (monthArr.length == 0 || monthArr[day - 1] == null) {
    monthArr[day - 1] = new createDay(0, []);
  }
  monthArr[day - 1].tasks.push(task);
  localStorage.setItem(month + "", JSON.stringify(monthArr));
  console.log(monthArr[day - 1].tasks);
  return monthArr[day - 1].tasks;
}

add.addEventListener("click", () => {
  //function called on clicking the add task button
  // console.log("Button Clicked");
  if (title.value != "") {
    let reqList = addTask(title.value, picker.getMonth(), picker.getDate());
    showList(reqList);
    showProgress(calDayProgress());
    showGraph();
    title.value = "";
  } else {
    console.log("Nothing Entered");
  }
});
title.addEventListener("keydown", (event) => {
  if (event.key != "Enter") {
    //console.log("Not enter");
    return;
  }
  if (title.value != "") {
    let reqList = addTask(title.value, picker.getMonth(), picker.getDate());
    showList(reqList);
    showProgress(calDayProgress());
    showGraph();
    title.value = "";
  } else {
    console.log("Nothing Entered");
  }
});
function startPage() {
  // fucntion to be invoked on starting the page
  console.log("Started");
  // setting the monthly value for month progress option as current month
  select.value = date.getMonth();
  let month = JSON.parse(localStorage.getItem(date.getMonth() + ""));
  if (month && month[date.getDate() - 1]) {
    showList(month[date.getDate() - 1].tasks);
  } else {
    showList(null);
  }
  showProgress(calDayProgress());
  showGraph();
}
function getDates() {
  let curMonth = picker.getMonth();
  let curDate = picker.getDate();
  if (picker.getMonth() == null) {
    curMonth = date.getMonth();
    curDate = date.getDate();
  }
  return [curMonth, curDate];
}
function deleteTask(event) {
  //function to delete a task
  let curMonth, curDate;
  [curMonth, curDate] = getDates();
  let month = JSON.parse(localStorage.getItem(curMonth + ""));
  month[curDate - 1].tasks.splice(event.target.getAttribute("data-id"), 1);
  localStorage.setItem(curMonth + "", JSON.stringify(month));
  showList(month[curDate - 1].tasks);
  //console.log(calDayProgress());
  showProgress(calDayProgress());
  showGraph();
}
function toggle(event) {
  let curMonth, curDate;
  [curMonth, curDate] = getDates();
  let month = JSON.parse(localStorage.getItem(curMonth + ""));
  month[curDate - 1].tasks[event.target.getAttribute("data-id")].done =
    !month[curDate - 1].tasks[event.target.getAttribute("data-id")].done;
  localStorage.setItem(curMonth + "", JSON.stringify(month));
  showList(month[curDate - 1].tasks);
  //console.log(calDayProgress());
  showProgress(calDayProgress());
  showGraph();
}
function calDayProgress() {
  // function to calculate the day progress
  let curMonth, curDate;
  [curMonth, curDate] = getDates();
  let month = JSON.parse(localStorage.getItem(curMonth + ""));
  if (!month || month.length == 0 || !month[curDate - 1]) {
    return 0;
  }
  let arr = month[curDate - 1].tasks;
  if (!arr || arr.length == 0) {
    return 0;
  }
  let count = 0;
  arr.forEach((ele) => {
    if (ele.done) {
      count++;
    }
  });
  month[curDate - 1].progress = (count / arr.length) * 100;
  localStorage.setItem(curMonth + "", JSON.stringify(month));
  return month[curDate - 1].progress;
}
function showProgress(percent) {
  percent = percent.toFixed(2);
  progressBar.style.width = `${percent}%`;
  progressBar.innerHTML = `${percent}%`;
}

function getY() {
  let curMonth = select.value;
  let monthArr = JSON.parse(localStorage.getItem(curMonth));
  let y = [];
  if (monthArr && monthArr.length != 0) {
    monthArr.forEach((ele) => {
      if (ele) {
        y.push(ele.progress);
      } else {
        y.push(0);
      }
    });
  }
  return y;
}
function getX() {
  let curMonth = select.value;
  let n = new Date(2022, curMonth + 1, 0).getDate();
  x = [];
  for (let i = 1; i <= n; i++) {
    x.push(i);
  }
  return x;
}
function showGraph() {
  new Chart("myChart", {
    type: "line",
    data: {
      labels: getX(),
      datasets: [
        {
          fill: false,
          lineTension: 0,
          backgroundColor: "black",
          borderColor: "light-grey",
          data: getY(),
        },
      ],
    },
    options: {
      legend: { display: false },
      scales: {
        yAxes: [{ ticks: { min: 0, max: 100 } }],
      },
    },
  });
}
select.addEventListener("change", (event) => {
  showGraph();
});
