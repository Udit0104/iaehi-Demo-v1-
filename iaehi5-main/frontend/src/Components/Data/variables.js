import { questions } from "./questionsData";
import axios from "axios";
export const cond1 = "Very Happy";
export const cond2 = "Happy";
export const cond3 = "Unhappy";
export const cond4 = "Very Unhappy";
export const level1 = 180;
export const level2 = 140;
export const level3 = 90;
export const level4 = 40;
export const level5 = 20;

// --- CATEGORY-BASED RANDOM QUESTION SELECTION ---

// How many questions from each category (edit as needed)
export const categoryConfig = {
  1: 2, // 2 from category 1(finance)
  2: 2, // 2 from category 2(generic)
  3: 1, // 1 from category 3(health and well being)
  4: 2, // 2 from category 4(Joyful Expression)
  5: 1, // 1 from category 5(Mandatory)
  6: 1, // 1 from category 6(Social Connection)
  // Add more categories as needed
};

// Utility to get N random items from an array
function getRandomItems(arr, n) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

// Main function to get random questions by category
export function getQuestionsByCategory(questions, config) {
  let selected = [];
  Object.entries(config).forEach(([cat, count]) => {
    const catQuestions = questions.filter(
      (q) => String(q.category) === String(cat)
    );
    selected = selected.concat(getRandomItems(catQuestions, count));
  });
  // Optionally shuffle the final set
  return selected.sort(() => 0.5 - Math.random());
}

// This is your question bank for the session
export const queBank = getQuestionsByCategory(questions, categoryConfig);

// --- END CATEGORY-BASED LOGIC ---

export const genderGroups = [
  { id: 1, title: "Female", titleHindi: "महिला" },
  { id: 2, title: "Male", titleHindi: "पुरुष" },
  { id: 3, title: "Other", titleHindi: "अन्य" },
];

export const ageGroups = [
  { id: 1, title: "< 25 yrs", titleHindi: "< 25 वर्ष" },
  { id: 2, title: "25-30 yrs", titleHindi: "25-30 वर्ष" },
  { id: 3, title: "31-35 yrs", titleHindi: "31-35 वर्ष" },
  { id: 4, title: "36-40 yrs", titleHindi: "36-40 वर्ष" },
  { id: 5, title: "41-45 yrs", titleHindi: "41-45 वर्ष" },
  { id: 6, title: "46-50 yrs", titleHindi: "46-50 वर्ष" },
  { id: 7, title: "51-55 yrs", titleHindi: "51-55 वर्ष" },
  { id: 8, title: ">55 yrs", titleHindi: ">55 वर्ष" },
];

export const chartSelection = [
  { id: 1, title: "Overall", titleHindi: "समग्र", value: "" },
  { id: 2, title: "Departments", titleHindi: "विभाग", value: "department" },
  { id: 3, title: "Age Groups", titleHindi: "आयु समूह", value: "ageGroup" },
  { id: 4, title: "Gender", titleHindi: "लिंग", value: "gender" },
];
export const chartType = [
  { id: 1, title: "Stacked", titleHindi: "स्टैक्ड", value: "stacked" },
  { id: 2, title: "Grouped", titleHindi: "समूहीकृत", value: "grouped" },
];

export const presentation = [
  {
    id: 1,
    title: "Happiness View",
    titleHindi: "खुशी का दृश्य",
    value: "happinessView",
  },
  {
    id: 2,
    title: "Category View",
    titleHindi: "श्रेणी दृश्य",
    value: "categoryView",
  },
];

// Fetch departments from backend
export const departments = async () => {
  const res = await axios.get("http://localhost:5000/api/departments");
  return res.data; // array of departments from DB
};
