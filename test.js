console.log("bye");
addTask("hello", 8, 1);
addTask("hi", 8, 1);
addTask("hii", 8, 1);
function createTask(title, done) {
  this.title = title;
  this.done = done;
}
function showList(List) {
  let code = "";
  List.forEach((element, index) => {
    code += `<li>
    <input
      type="checkbox"
      id="task${index}"
      data-id="12"
      class="custom-checkbox"
    />
    <label for="task${index}">${element.title}</label>
    <button
      type="button"
      class="btn-close"
      aria-label="Close"
    ></button>
  </li>`;
  });
}
function addTask(title, month, day) {
  console.log("yo");
  let task = new createTask(title, false);
  if (localStorage.getItem(month + "") == null) {
    let arr = [];
    arr[day - 1] = [];
    arr[day - 1].push(task);
    localStorage.setItem(month + "", JSON.stringify(arr));
    console.log(1);
    return;
  }
  let monthArr = JSON.parse(localStorage.getItem(month + ""));
  console.log(monthArr);
  if (monthArr[day - 1] == null) {
    monthArr[day - 1] = [];
    monthArr[day - 1].push(task);
    localStorage.setItem(month + "", JSON.stringify(monthArr));
    return;
  }
  monthArr[day - 1].push(task);
  localStorage.setItem(month + "", JSON.stringify(monthArr));
}
