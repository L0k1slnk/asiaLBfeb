Detectizr.detect();
var scene = document.getElementById('scene');
if (Detectizr.device.type !== 'mobile') {
    new Parallax(scene);
}

let lbData = [];
let counter = 1;
const perPage = 20;

const lbURL = 'http://pt.l0k1.pro/feb/request-jsons/response-';
// const lbURL = 'https://www.88leaderboard.com/request-jsons/<file_name>';

const loadMoreBtn = document.getElementById('loadMore');

function getNewResponse(type) {
    fetch(lbURL + type + '.json', {
        credentials: 'same-origin'
    })
        .then(response => response.json())
        .catch((error) => console.error(error))
        .then((leaderboards) => {
            lbData = getLB(leaderboards.data);
            addRows();
            setMaxWidth();
        });
}

/*********/
Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
        (mm>9 ? '' : '0') + mm,
        (dd>9 ? '' : '0') + dd
    ].join('-');
};
const today = new Date();
const fromDate = new Date(2021,1,1);
const toDate = new Date(today.getFullYear(),today.getMonth(),today.getDate());

const data = [];
for (let day = fromDate; day < toDate; day.setDate(day.getDate() + 1)) {
    data.push({
        counter: 1,
        lb: [],
        day: day.yyyymmdd()
    });
}

document.addEventListener('DOMContentLoaded', () => {
    getNewResponse('day');

    completedDailyHolder.innerHTML = m;
    for (let i = 0; i < data.length; i++) {
        getCompletedResponse(data[i].day, 'day');
    }
});

function getLB(data) {
    data.sort((a, b) => b.Points - a.Points);
    return data;
}

function addRows() {
    const page = lbData.splice(0, perPage);
    const tableBody = document.getElementById('lbTableBody');
    let htmlRows = '';
    page.forEach((el) => {
        htmlRows += '<div class="table_body_row">';
        htmlRows += '<div class="table_body_col table_body_col--pos">' + counter++ + '</div>';
        htmlRows += '<div class="table_body_col table_body_col--name">' + el.Username + '</div>';
        htmlRows += '<div class="table_body_col table_body_col--val">' + Number(el.Points).toFixed(3) + '</div>';
        htmlRows += '</div>';
    });
    tableBody.innerHTML = tableBody.innerHTML + htmlRows;

    if (counter > 11) {
        tableBody.scrollTo(0, tableBody.scrollHeight);
    }

    if (!lbData.length) {
        loadMoreBtn.style.display = 'none';
    }
}

function addRowsC(data,tableId) {
    const page = data.lb.splice(0, perPage);
    const tableBody = document.getElementById(tableId);
    let htmlRows = '';
    page.forEach((el) => {
        htmlRows += '<div class="table_body_row">';
        htmlRows += '<div class="table_body_col table_body_col--pos">' + data.counter++ + '</div>';
        htmlRows += '<div class="table_body_col table_body_col--name">' + el.Username + '</div>';
        htmlRows += '<div class="table_body_col table_body_col--val">' + Number(el.Points).toFixed(3) + '</div>';
        htmlRows += '</div>';
    });
    tableBody.innerHTML = tableBody.innerHTML + htmlRows;

    if (data.counter > 11) {
        tableBody.scrollTo(0, tableBody.scrollHeight);
    }

    if (!data.lb.length) {
        // loadMoreBtn.style.display = 'none';
    }
}

loadMoreBtn.onclick = e => {
    e.preventDefault();
    addRows();
};

function setMaxWidth(tableId = 'lbTableBody') {
    const tableBody = document.getElementById(tableId);
    tableBody.style.maxHeight = (tableBody.querySelector('.table_body_row').offsetHeight * 20) + 'px';
}

/*********/
// Date.prototype.yyyymmdd = function() {
//     var mm = this.getMonth() + 1; // getMonth() is zero-based
//     var dd = this.getDate();
//
//     return [this.getFullYear(),
//         (mm>9 ? '' : '0') + mm,
//         (dd>9 ? '' : '0') + dd
//     ].join('-');
// };
// const today = new Date();
// const fromDate = new Date(2021,1,1);
// const toDate = new Date(today.getFullYear(),today.getMonth(),today.getDate());
//
// const data = [];
// for (let day = fromDate; day < toDate; day.setDate(day.getDate() + 1)) {
//     data.push({
//         counter: 1,
//         lb: [],
//         day: day.yyyymmdd()
//     });
// }
function getCompletedResponse(day, type) {
    fetch(lbURL + type + '-' + day + '.json', {
        credentials: 'same-origin'
    })
        .then(response => response.json())
        .catch((error) => console.error(error))
        .then((leaderboards) => {
            let lbItem = data.find((o, i) => {
                if (o.day === day) {
                    data[i].lb = getLB(leaderboards.data);
                    return true;
                }
            });
            addRowsC(lbItem, 'tableBody-' + lbItem.day);
            // setMaxWidth('tableBody-' + lbItem.day);
            // uncheck(lbItem.day);
            let btn = document.getElementById(`loadMore-${lbItem.day}`);
            btn.onclick = e => {
                e.preventDefault();
                addRowsC(lbItem, 'tableBody-' + lbItem.day);
            };

        });
}

function uncheck(id) {
    document.getElementById('chbx-' + id).checked = false;
    document.getElementById('item-' + id).classList.remove('chbx_item--op');
}
function check(id) {
    document.getElementById('chbx-' + id).checked = true;
    document.getElementById('item-' + id).classList.add('chbx_item--op');
}

var completedDailyHolder = document.getElementById('completedDailyHolder');
const m = data.map(item =>
    `<div class="chbx_item chbx_item--op" id="item-${item.day}">
        <input type="checkbox" class="chbx" id="chbx-${item.day}" checked>
        <label for="chbx-${item.day}" class="chbx-label">
            <span><span>${item.day.split('-').reverse().join('.')}</span></span>
        </label>
        <div class="chbx-content">
            <div class="table-wrapper table-wrapper--silver">
                <section class="table table--primary" id="table-${item.day}">
                    <div class="table_header">
                        <div class="table_header_col table_header_col--pos">Rank</div>
                        <div class="table_header_col table_header_col--name">Username</div>
                        <div class="table_header_col table_header_col--val">Points</div>
                    </div>
                    <div class="table_body" id="tableBody-${item.day}">

                    </div>
                    <div class="table_footer">
                        <span class="table_btn-wrapper">
                            <span class="table_btn fn-loadMore" id="loadMore-${item.day}"><span>Show more</span></span>
                        </span>
                    </div>
                </section>
            </div>
        </div>
    </div>`
).join(' ');

var dailyTab = document.getElementById('daily');
var weeklyTab = document.getElementById('weekly');
var competedTab = document.getElementById('completed');

// document.body.addEventListener('change', function(e) {
//     let target = e.target;
//     counter = 1;
//     if(target.value === 'completed') {
//         completedDailyHolder.innerHTML = m;
//     }
//     else {
//         const tableBody = document.getElementById('lbTableBody');
//         tableBody.innerHTML = '';
//         getNewResponse(target.value);
//     }
//
// });

dailyTab.addEventListener('change', function(e) {
    onTabChange(e.target.value)

});
weeklyTab.addEventListener('change', function(e) {
    onTabChange(e.target.value)

});
competedTab.addEventListener('change', function(e) {
    // completedDailyHolder.innerHTML = m;
    for (let i = 0; i < data.length; i++) {
        check(data[i].day);
        setMaxWidth('tableBody-' + data[i].day);
        uncheck(data[i].day);
    }

});

function onTabChange(type) {
    const tableBody = document.getElementById('lbTableBody');
    counter = 1;
    tableBody.innerHTML = '';
    getNewResponse(type);
}


