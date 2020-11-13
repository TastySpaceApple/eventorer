const {google} = require('googleapis');
module.exports = {
  calendarId: 'primary',
  init: function(auth){
    this.auth = auth;
    this.calendar = google.calendar({version: 'v3', auth});
  },
  listEvents: function (startDate, maxResults) {
    return new Promise((resolve, reject) => {
     this.calendar.events.list({
       calendarId: this.calendarId,
       timeMin: (startDate || new Date()).toISOString(),
       maxResults: maxResults || 10,
       singleEvents: true,
       orderBy: 'startTime',
     }, (err, res) => {
       if (err) throw 'The API returned an error: ' + err;
       const events = res.data.items;
       resolve(events);
     });
   });
  },
  deleteEvent: function(eventId){
    return new Promise((resolve, reject) => {
     this.calendar.events.delete({
       calendarId: this.calendarId,
       eventId: eventId
     }, (err, res) => {
       console.log(err);
       if (err) reject('The API returned an error: ' + err);
       resolve();
     });
   });
 },
 deleteEvents: function(eventIds){
   return new Promise((resolve, reject) => {
     let self = this;
     let eventIndex=0;
     function loop(){
       self.deleteEvent(eventIds[eventIndex]).then( () => {
         eventIndex++;
         if(eventIndex < eventIds.length)
          loop();
        else
          resolve();
       })
     }
     loop();
   });
 }
};
