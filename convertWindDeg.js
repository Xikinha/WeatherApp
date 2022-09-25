/// Function to convert wind direction in deg to orientations

const convertWindDeg = (windDeg) => {
  let windDirectionInDeg = windDeg;
  // 8 directions: N-0deg => 0, NE-45deg, E-90deg => 2, SE-135deg, S-180deg => 4, SW-225deg, W-270deg => 6, NE-315deg]
  let directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  let degrees = (windDirectionInDeg * 8) / 360;
  degrees = Math.round(degrees, 0);
  degrees = (degrees + 8) % 8;
  return directions[degrees];
};

export { convertWindDeg };
