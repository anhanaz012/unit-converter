const units = [
  {
    label: "length",
    active: true,
    options: [
      {
        label: "Millimeter (mm)",
        value: "mm",
      },
      {
        label: "Centimeter (cm)",
        value: "cm",
      },
      {
        label: "Meter (m)",
        value: "m",
      },
      {
        label: "Kilometer (km)",
        value: "km",
      },
    ],
  },
  {
    label: "weight",
    active: false,
    options: [
      {
        label: "Milligram (mg)",
        value: "mg",
      },
      {
        label: "Gram (g)",
        value: "g",
      },
      {
        label: "Kilogram (kg)",
        value: "kg",
      },
    ],
  },
  {
    label: "temperature",
    active: false,
    options: [
      {
        label: "Celsius (°C)",
        value: "C",
      },
      {
        label: "Fahrenheit (°F)",
        value: "F",
      },
      {
        label: "Kelvin (K)",
        value: "K",
      },
    ],
  },
];
const selectTab = (event, tabName) => {
  // mark unit as active
  units.forEach((unit) => {
    unit.active = unit.label === tabName;
  });
  //remove active class from all tabs
  document.querySelectorAll(".tab-link").forEach((tab) => {
    tab.classList.remove("active");
  });
  //set dropdown options
  setDropdownOptions();

  //add active class to the selected tab
  event.currentTarget.classList.add("active");
};
const setDropdownOptions = () => {
  const activeTab = units.find((unit) => unit.active);
  document.querySelectorAll(".unit-dropdown").forEach((dropdown) => {
    dropdown.innerHTML = activeTab.options.map(
      (opt) => `<option value="${opt.value}">${opt.label}</option>`,
    );
  });
};

setDropdownOptions();
const validUnits = ["mm", "cm", "m", "km", "mg", "g", "kg", "C", "F", "K"];
const validateForm = (data) => {
  if (!data.from || !data.to || !data.value) {
    alert("Please fill all the fields");
    return;
  }
  if (!validUnits.includes(data.from)) {
    alert("Please select valid conversion units");
    return;
  }
  if (Number.isNaN(Number(data.value)) || data.value < 0) {
    alert("Please enter a valid number");
    return;
  }
  return true;
};
const form = document.getElementById("converter-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const { value, from, to } = data;
  const isValid = validateForm(data);
  if (!isValid) return;
  fetch(`http://localhost:3000/convert?value=${value}&from=${from}&to=${to}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      document.getElementById("result").innerHTML =
        `Value after conversion is: ${data.result}`;
    })
    .catch((err) => {
      console.log("Error from fetch", err);
    });
});
