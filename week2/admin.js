let listSidebars = document.querySelectorAll(".sidebar-item-text");
let listBodys = document.querySelectorAll(".main-body > div");
let tableDevice = document.querySelector(".dashboard tbody");
let tableLogs = document.querySelector(".logs-body tbody");
let listPagigation = document.querySelector(".pagigation");

// console.log(Auth);
// if (Auth) {
//   let app = document.querySelector(".app");
//   app.classList.remove("none");
// } else {
//   let pageNotFound = document.querySelector(".page-not-found");
//   pageNotFound.classList.remove("none");
// }

// set, get localstorage
function setStoreage(name, data) {
  localStorage.setItem(name, JSON.stringify(data));
}

function getStoreage(name) {
  return JSON.parse(localStorage.getItem(name));
}

if (!getStoreage("searchHistory")) {
  setStoreage("searchHistory", []);
}

if (!getStoreage("dataDevice")) {
  setStoreage("dataDevice", dataDevice);
}

if (getStoreage("auth")) {
  let app = document.querySelector(".app");
  app.classList.remove("none");
} else {
  let pageNotFound = document.querySelector(".page-not-found");
  pageNotFound.classList.remove("none");
}

function onRedirectLogin() {
  window.location.href = "./auth.html";
}

//--------------------------

function onSidebarClick(t) {
  Array.from(listSidebars).map((item, index1) => {
    item.classList.remove("active");

    if (t === item) {
      Array.from(listBodys).map((item, index2) => {
        item.classList.add("none");
        if (index1 == index2) {
          item.classList.remove("none");
        }
      });
    }
  });

  t.classList.add("active");
}

//Render table device

function renderTableDevice() {
  let data = getStoreage("dataDevice");
  let html = "";
  let total = 0;
  data.forEach((item) => {
    let name = item.name;
    let address = item.address;
    let ip = item.ip;
    let createDate = item.createDate;
    let power = item.power;
    let row = `
    <tr>
        <td >${name}</td>
        <td >${address}</td>
        <td >${ip}</td>
        <td >${createDate}</td>
        <td >${power}</td>
    </tr>
    `;

    html += row;
    total += power;
  });
  html += `
    <tr class="total">
        <td >Total</td>
        <td ></td>
        <td ></td>
        <td ></td>
        <td > ${total}</td>
    </tr>
    `;

  tableDevice.innerHTML = html;
}

renderTableDevice();

// ADD Device
function onAddDeviceClick(e) {
  let data = getStoreage("dataDevice");
  let inputName = document.querySelector("#name");
  let inputId = document.querySelector("#id");
  let formPower = document.querySelector(".form-item-power");
  let inputPower = document.querySelector("#power");
  let mesageDevice = document.querySelector(".form-message-device");

  // validate
  if (inputName.value !== "" && inputId.value !== "") {
    var vnf_regex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (vnf_regex.test(inputId.value)) {
      formPower.classList.remove("none");
      mesageDevice.innerHTML = "Vui lòng nhập Power";
    } else {
      mesageDevice.innerHTML = "Địa chỉ IP không hợp lệ";
    }
  } else {
    mesageDevice.innerHTML = "Vui lòng nhập đủ các trường";
  }

  if (inputPower.value) {
    const today = new Date();
    const date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    data.push({
      name: inputName.value,
      address: "",
      ip: inputId.value,
      createDate: date,
      power: parseInt(inputPower.value),
    });

    setStoreage("dataDevice", data);

    // clear input value,  ẩn power input
    formPower.classList.add("none");
    inputName.value = "";
    inputId.value = "";
    mesageDevice.innerHTML = "";
    inputPower.value = "";

    ChartPower();
    renderTableDevice();
  }
}

//Chart

function ChartPower() {
  let dataChart = getStoreage("dataDevice");
  const data = {
    labels: [],
    datasets: [
      {
        label: "My First Dataset",
        data: [],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "#04aa6d",
          "#9933cc",
        ],
        hoverOffset: 4,
      },
    ],
  };

  dataChart.forEach((e) => {
    data.labels.push(e.name);
    data.datasets[0].data.push(e.power);
  });

  const config = {
    type: "doughnut",
    data: data,
    options: {
      plugins: {
        title: {
          display: true,
          text: "Power",
        },
      },
    },
  };

  let chart = document.querySelector(".main-chart");

  chart.innerHTML = `<canvas width="400" id="myChart"></canvas>`;
  const myChart = new Chart(document.getElementById("myChart"), config);
}

ChartPower();

// Render action logs

let dataRenderLog = dataActionLogs;

function renderTableLogs(data, indexLogsRender) {
  indexLogsRender = indexLogsRender * 10;
  let html = "";
  data.forEach((item, index) => {
    let id = item.id;
    let name = item.name;
    let action = item.action;
    let date = item.date;
    let row = `
      <tr>
          <td >${id}</td>
          <td >${name}</td>
          <td >${action}</td>
          <td >${date}</td>
      </tr>
      `;

    if (indexLogsRender - 10 <= index && index < indexLogsRender) {
      html += row;
    }
  });

  tableLogs.innerHTML = html;
}

renderTableLogs(dataRenderLog, 1);

//pagigation
let currentPage = 1;

function renderPagigation() {
  let amountPagi = Math.ceil(dataRenderLog.length / 10);

  let html = `<div class="next-prev" onclick=" onPrevious()"> < </div>`;

  if (currentPage <= 5) {
    for (var i = 1; i <= 5; i++) {
      html += `
          <div class="pagigation-item " onclick="onPagigationClick(this.innerHTML)">${i}</div>
          `;
    }
  } else if (currentPage <= amountPagi - 2) {
    for (var i = -2; i <= 2; i++) {
      if (i > currentPage - 2 || i < currentPage + 2) {
        html += `
          <div class="pagigation-item " onclick="onPagigationClick(this.innerHTML)">${
            i + currentPage
          }</div>
          `;
      }
    }
  } else {
    for (var i = 4; i >= 0; i--) {
      html += `
          <div class="pagigation-item " onclick="onPagigationClick(this.innerHTML)">${
            amountPagi - i
          }</div>
          `;
    }
  }

  html += `<div class="next-prev" onclick="onNext()"> > </div>`;

  listPagigation.innerHTML = html;
}

renderPagigation(1);

function onPagigationClick(page) {
  console.log(currentPage);
  currentPage = page;
  console.log(currentPage);
  let listPage = document.querySelectorAll(".pagigation-item");

  Array.from(listPage).forEach((e) => {
    e.classList.remove("active2");
    if (e.innerHTML == currentPage) {
      e.classList.add("active2");
    }
  });

  renderTableLogs(dataRenderLog, currentPage);
}

onPagigationClick(1);

function onNext() {
  let amountPagi = Math.ceil(dataRenderLog.length / 10);
  console.log(amountPagi);

  if (currentPage !== amountPagi) {
    currentPage = +currentPage + 1;
    if (currentPage > 5) {
      renderPagigation(currentPage);
      onPagigationClick(currentPage);
      renderTableLogs(dataRenderLog, currentPage);
    } else {
      onPagigationClick(currentPage);
      renderTableLogs(dataRenderLog, currentPage);
    }
  }
}

function onPrevious() {
  let amountPagi = Math.ceil(dataRenderLog.length / 10);
  console.log(amountPagi);

  if (currentPage !== 1) {
    currentPage = +currentPage - 1;
    if (currentPage > 4) {
      renderPagigation(currentPage);
      onPagigationClick(currentPage);
      renderTableLogs(dataRenderLog, currentPage);
    } else {
      onPagigationClick(currentPage);
      renderTableLogs(dataRenderLog, currentPage);
    }
  }
}

// Search

function onSearchClick(t) {
  const history = getStoreage("searchHistory");
  var input;
  // if (t) {
  //   document.querySelector("#search").value = t.value;
  // }

  input = document.querySelector("#search").value;

  dataRenderLog = dataActionLogs.filter((e) =>
    e.name.toUpperCase().includes(input.toUpperCase())
  );

  if (input !== "" && history.indexOf(input) == -1) {
    history.push(input);
  }

  setStoreage("searchHistory", history);
  renderTableLogs(dataRenderLog, 1);
  renderPagigation();
  onPagigationClick(1);
  renderSearchHistory();
}

function renderSearchHistory() {
  let data = getStoreage("searchHistory");
  let history = document.querySelector(".history");
  let html = "";
  data.forEach((e) => {
    html += `<li> ${e} <span>x</span></li>`;
  });

  history.innerHTML = html;
}

renderSearchHistory();

function onDisplayHistory() {
  let history = document.querySelector(".history");
  history.classList.toggle("none");
}

// function onDeleteHistoryClick(t) {
//   const history = getStoreage("searchHistory");
//   console.log("node", t.parentNode.value);
// }

// responsive

function onToggleMenuClick(e) {
  let sidebar = document.querySelector(".sidebar");
  let menu = document.querySelector(".menu-mobie i");
  if (e.target === menu) {
    sidebar.classList.remove("hide");
  } else {
    sidebar.classList.add("hide");
  }
}
