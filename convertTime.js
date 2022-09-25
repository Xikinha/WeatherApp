/// Function to convert unixtime

const convertTime = (time) => {
  let unixTimestamp = time;
  let hours = new Date(unixTimestamp * 1000)
    .getHours()
    .toString()
    .padStart(2, "0");
  let minutes = new Date(unixTimestamp * 1000)
    .getMinutes()
    .toString()
    .padStart(2, "0");
  return hours + ":" + minutes;
};

export { convertTime };
