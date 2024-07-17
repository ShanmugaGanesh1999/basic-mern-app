const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const requiredAttributes = ["emailId", "name", "height", "weight"];
const genderList = ["male", "female", "others"];
const bmiChart = ["under", "normal", "over", "obese"];

function validate(record) {
  return new Promise((resolve, reject) => {
    try {
      let { name, height, weight, dob, gender, emailId, action, id } = record;
      let tenYears = new Date().getFullYear() - 10;
      if (action === "edit") {
        if (!id) {
          reject("id attribute missing");
        }
      } else {
        requiredAttributes.forEach((attr) => {
          if (record[attr] === undefined) reject(`${attr} attribute mission`);
        });
      }
      if (name.length < 3) {
        reject(`name must be greater than or equal to 3 characters`);
      }
      if (!emailRegex.test(emailId)) {
        reject(`${emailId} is not a valid email`);
      }
      if (height < 55) {
        reject(`${height} is not a valid height`);
      }
      if (weight < 35) {
        reject(`${weight} is not a valid weight`);
      }
      if (!genderList.includes(gender)) {
        reject(`${gender} is not a valid gender`);
      }
      if (tenYears >= new Date(dob)) {
        reject(`dob must be greater than or equal to 10 year`);
      }
      resolve({ name, height, weight, dob, gender, emailId });
    } catch (error) {
      reject(`error occured while validating the record, ${error.message}`);
    }
  });
}

function calculateBMI({ weight, height }) {
  let bmi = weight / (height * height);
  if (bmi <= 18.4) return bmiChart[0];
  else if (bmi > 18.4 && bmi <= 24.9) return bmiChart[1];
  else if (bmi > 24.9 && bmi <= 29.9) return bmiChart[2];
  else if (bmi > 29.9) return bmiChart[3];
}

function filterOut(object, from) {
  let data = {};
  for (const [key, value] of Object.entries(object)) {
    if (value !== from) data[key] = value;
  }
  return data;
}

module.exports = { validate, calculateBMI, filterOut };
