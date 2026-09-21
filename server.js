const http = require("node:http");

const lengthUnits = ["km", "m", "mm", "cm"];
const weightUnits = ["mg", "g", "kg"];
const tempUnits = ["C", "F", "K"];

const getLengthBase = (from, val) => {
  const value = Number(val);
  let base;
  if (from == "mm") {
    base = value / 1000;
  } else if (from == "cm") {
    base = value / 100;
  } else if (from == "m") {
    base = value;
  } else if (from == "km") {
    base = value * 1000;
  }
  return base;
};

const getWeightBase = (from, val) => {
  const value = Number(val);
  let base;
  if (from == "kg") {
    base = value * 1000;
  } else if (from == "g") {
    base = value;
  } else if (from == "mg") {
    base = value / 1000;
  }
  return base;
};

const convertLength = (from, to) => {
  let result;
  if (to == "mm") {
    result = from * 1000;
  } else if (to == "cm") {
    result = from * 100;
  } else if (to == "m") {
    result = from;
  } else if (to == "km") {
    result = from / 1000;
  }
  return result;
};

const convertWeight = (from, to) => {
  let result;
  if (to == "kg") {
    result = from / 1000;
  } else if (to == "g") {
    result = from;
  } else if (to == "mg") {
    result = from * 1000;
  }
  return result;
};

const convertTemp = (from, to, val) => {
  const value = Number(val);
  let result;
  if (from == "C" && to == "F") {
    result = (value * 9) / 5 + 32;
  } else if (from == "C" && to == "K") {
    result = value + 273.15;
  } else if (from == "C" && to == "C") {
    result = value;
  } else if (from == "F" && to == "C") {
    result = ((value - 32) * 5) / 9;
  } else if (from == "F" && to == "K") {
    result = ((value - 32) * 5) / 9 + 273.15;
  } else if (from == "F" && to == "F") {
    result = value;
  } else if (from == "K" && to == "C") {
    result = value - 273.15;
  } else if (from == "K" && to == "F") {
    result = ((value - 273.15) * 9) / 5 + 32;
  } else if (from == "K" && to == "K") {
    result = value;
  }
  return result;
};

const convert = (from, to, value) => {
  let result;
  if (lengthUnits.includes(from)) {
    const base = getLengthBase(from, value);
    result = convertLength(base, to);
  } else if (weightUnits.includes(from)) {
    const base = getWeightBase(from, value);
    result = convertWeight(base, to);
  } else if (tempUnits.includes(from)) {
    result = convertTemp(from, to, value);
  }
  return result;
};
const extractValues = (req) => {
  const url = new URL(req.url, "http://localhost:3000");
  const formData = {
    from: url.searchParams.get("from"),
    to: url.searchParams.get("to"),
    value: url.searchParams.get("value"),
  };
  return formData;
};
const server = http.createServer((req, res) => {
  const data = extractValues(req);
  const result = convert(data.from, data.to, data.value);
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ result: result }));
});

server.listen(3000);
