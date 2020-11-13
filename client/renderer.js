// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const calendar = require('../services/google-calendar');
const oauth = require('../services/google-oauth-client');
const {shell} = require('electron');

function start(){
  calendar.init(oauth.get());
  document.querySelector('.login-slides').classList.add('hidden')
  document.querySelector('.events-editor').classList.remove('hidden')
  listEvents();
}

function login(){
  oauth.init();
  if(oauth.hasToken()){
    oauth.loginWithToken().then(start);
  } else {
    const loginUrl = oauth.generateLoginAuthUrl();
    shell.openExternal(loginUrl);
    document.querySelector('.login-slides').setAttribute('current-slide', 2);
  }
}
function loginWithCode(){
  let code = document.querySelector('#txt-login-code').value;
  oauth.loginWithCode(code).then(start);
}

function listEvents(){
  let minDate = document.querySelector('#date-start').valueAsDate;
  console.log(minDate);
  calendar.listEvents(minDate).then(setEventsList);
}

function setEventsList(events){
  console.log(events);
  document.querySelector('#events-list').innerHTML =
    `<tr>
      <th>Summary</th>
      <th>Date</th>
      <th>Select</th>
    </tr>` +
    events.map(event =>
      `<tr data-event-id="${event.id}">
        <td>${event.summary}</td>
        <td>${formatDate(new Date(event.start.dateTime || event.start.date))}</td>
        <td><input type="checkbox" class="chk-select" /></td>
      </tr>`
    ).join('');
}

function formatDate(date){

  let year = date.getFullYear();
  let month = date.getMonth()+1;
  let day = date.getDate();
  if(day < 10) day = '0' + day;
  if(month < 10) month = '0' + month;
  return `${day}/${month}/${year}`;
}

function deleteEvents(onlySelected){
  let ids = [];
  Array.from(document.querySelectorAll('#events-list tr')).forEach(tr => {
    let id = tr.dataset.eventId;
    if(!id) return;
    let doDelete = true;
    if(onlySelected)
      doDelete = tr.querySelector('.chk-select').checked;
    if(doDelete){
      ids.push(id);
    }
  })
  if(ids.length){
    calendar.deleteEvents(ids).then(listEvents);
  }
}

document.querySelector('#btn-login').addEventListener('click', login);
document.querySelector('#btn-login-with-code').addEventListener('click', loginWithCode);
document.querySelector('#btn-refresh').addEventListener('click', listEvents);
document.querySelector('#btn-delete-selected').addEventListener('click', function(){
  deleteEvents(true);
});
document.querySelector('#btn-delete-all').addEventListener('click', function(){
  deleteEvents(false);
});
document.querySelector('#date-start').valueAsDate = new Date();
document.querySelector('#date-start').addEventListener('change', listEvents);
