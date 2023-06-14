import Hours from './Hours'


export function formatDate(now) {

  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}





export function unadjust_hour(hour) {
  hour = hour + 4

  let type = "am";
  if (hour == 24) {
    hour = 12;
  }
  else if (hour > 24) {
    hour = hour - 24;
  }
  else if (hour > 12) {
    hour = hour - 12;
    type = "pm";
  }

  var min = hour % 1;
  hour = hour - min;
  min = min * 60;
  if (min == 0) {
    return hour + type;
  }
  return hour + ":" + min + type;
}

export function wind_back_hour(hour) {
  hour = hour + 4

  let type = "am";
  if (hour == 24) {
    hour = 12;
  }
  else if (hour > 24) {
    hour = hour - 24;
  }
  else if (hour > 12) {
    hour = hour - 12;
    type = "pm";
  }

  var min = hour % 1;
  hour = hour - min;
  min = min * 60;
  if (min == 0) {
    return hour;
  }
  return hour
}