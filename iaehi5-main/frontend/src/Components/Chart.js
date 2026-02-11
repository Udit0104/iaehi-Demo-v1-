import Style from "./Chart.module.css";
import React, { useState, useEffect } from "react";
import { url } from "./Data/apiData";
import * as variables from "./Data/variables";
import Loader from "./ReUsable/Loader";
import SelectionComp from "./ReUsable/SelectionComp";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material"; 
import axios from "axios";
import Chart from "react-apexcharts";
import Error from "./ReUsable/Error";
import { useLanguage } from "../contexts/LanguageContext";

import {
  chartSelection as originalChartSelection,
  chartType,
  presentation,
  departments,
} from "./Data/variables";

const chartSelection = [
  ...originalChartSelection,
];

export default function ReactChart(props) {
  const { setMsg } = props;
  const [charData, setChartData] = useState(null);
  const [state, setState] = useState(null);
  const [chartDataNumbers, setChartDataNumbers] = useState([]);
  const [chartCategories, setChartCategories] = useState([]);
  const [selected, setSelected] = useState(chartSelection[0].id);
  const [selectedValue, setSelectedValue] = useState("");
  const [showSelectionsComp, setShowSelectionComp] = useState(false);
  const [presentationView, setPresentationView] = useState(true);
  const [chartView, setChartView] = useState(presentation[0].id);
  const [chartTypeView, setChartTypeView] = useState(false);
  const [chartTypeVal, setChartTypeVal] = useState(chartType[1].id);
  const [error, setError] = useState(false);
  const { language, t } = useLanguage();
  const role = sessionStorage.getItem("role");
  const adminDepartment = sessionStorage.getItem("department");

  const theme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#ffc815",
      },
    },
  });

  const percentageCal = (arr, uniqueItems, arrLength = 0) => {
    const totalNumber = arr.length;
    const percentateArr = [];
    uniqueItems.forEach((currVal) => {
      const numItems = arr.filter((val) => val === currVal);
      percentateArr.push(
        arrLength === 0
          ? Number(((numItems.length * 100) / totalNumber).toFixed(2))
          : Number(((numItems.length * 100) / arrLength).toFixed(2))
      );
    });
    return percentateArr;
  };

  const getCountData = (arr, uniqueItems) => {
    const countArr = [];
    uniqueItems.forEach((currVal) => {
      const numItems = arr.filter((val) => val === currVal);
      countArr.push(numItems.length);
    });
    return countArr;
  };

  const getChart = (groupPercentageArr, uniqueItems, countData = null) => {
    const countsMapping = countData ? countData : null;

    const dataNumbersArray = [];
    if (countData && countData.length > 0) {
      countData.forEach((counts, idx) => {
        const dataPoints = [];
        counts.forEach((count, countIdx) => {
          dataPoints.push({
            count: count,
            percentage: groupPercentageArr[idx]
              ? groupPercentageArr[idx].data[countIdx]
              : null,
          });
        });
        dataNumbersArray.push({
          name: groupPercentageArr[idx]
            ? groupPercentageArr[idx].name
            : `Series ${idx + 1}`,
          dataPoints: dataPoints,
        });
      });
    } else {
      groupPercentageArr.forEach((series) => {
        const dataPoints = [];
        series.data.forEach((percentage, idx) => {
          dataPoints.push({
            percentage: percentage,
          });
        });
        dataNumbersArray.push({
          name: series.name,
          dataPoints: dataPoints,
        });
      });
    }

    setChartCategories(uniqueItems);
    setChartDataNumbers(dataNumbersArray);

    setState({
      series: groupPercentageArr,
      options: {
        chart: {
          type: "bar",
          height: 350,
          stacked: chartTypeView,
          // background: "#c5dcee", // <--- Add your background color here (e.g., #ffffff, #f4f4f4)
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: true,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        xaxis: {
          categories: uniqueItems,
        },
        yaxis: {
          title: {
            text: language === "hi" ? "प्रतिशत (%)" : "Percentage (%)",
          },
          labels: {
            formatter: (val, ind) => {
              return val.toFixed(0);
            },
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: function (val, opts) {
              try {
                const sIdx = opts.seriesIndex;
                const dIdx = opts.dataPointIndex;
                const cnt =
                  countsMapping &&
                  countsMapping[sIdx] &&
                  countsMapping[sIdx][dIdx] !== undefined
                    ? countsMapping[sIdx][dIdx]
                    : null;
                if (cnt !== null) return cnt;
              } catch (e) {
                // fallback to percentage if anything goes wrong
              }
              return val + " %";
            },
          },
        },
        theme: {
          mode: "light",
        },
      },
    });
  };
  useEffect(() => {
    const uniqueItems = [
      variables.cond1,
      variables.cond2,
      variables.cond3,
      variables.cond4,
    ];
    const groupPercentageArr = [];

    function normalizeDepartment(dep) {
      if (!dep) return "";
      if (["Production", "उत्पादन"].includes(dep)) return "Production";
      if (["Maintenance", "रखरखाव"].includes(dep)) return "Maintenance";
      if (["Human resources", "मानव संसाधन"].includes(dep))
        return "Human resources";
      if (["Customer service", "ग्राहक सेवा"].includes(dep))
        return "Customer service";
      return dep;
    }

    if (charData === null) {
      setShowSelectionComp(false);
      axios
        .get(`${url}/users`)
        .then((res) => {
          setChartData(res.data);
          const selectedRes = res.data.map((e) => e.result);
          const obj = {};
          obj.name = "Overall";
          obj.data = percentageCal(selectedRes, uniqueItems);
          groupPercentageArr.push(obj);
          const counts = getCountData(selectedRes, uniqueItems);
          getChart(groupPercentageArr, uniqueItems, [counts]);
        })
        .catch((err) => {
          console.log(err);
          setError(true);
        });
    } else {
      let filteredData = Array.isArray(charData) ? charData : [];
      if (role !== "superadmin") {
        filteredData = filteredData.filter(
          (user) =>
            normalizeDepartment(user.department) ===
            normalizeDepartment(adminDepartment)
        );
      }

      console.log("Admin department:", adminDepartment);
      console.log("Filtered users:", filteredData);

      if (selectedValue === "") {
        setShowSelectionComp(false);
        const selectedRes = filteredData.map((e) => e.result);
        const obj = {};
        obj.name = "Overall";
        obj.data = percentageCal(selectedRes, uniqueItems);
        groupPercentageArr.push(obj);
        const counts = getCountData(selectedRes, uniqueItems);
        getChart(groupPercentageArr, uniqueItems, [counts]);
      }
      // else if (selectedValue === "feedback") {
      //   axios
      //     .get(`${url}/feedback`)
      //     .then((res) => {
      //       const feedbackData = res.data;
      //       const happyCount = feedbackData.filter(
      //         (item) => item.isHappyWithResult
      //       ).length;
      //       const unhappyCount = feedbackData.filter(
      //         (item) => !item.isHappyWithResult
      //       ).length;
      //       const total = feedbackData.length || 1;
      //       const feedbackPercentages = [
      //         (happyCount / total) * 100,
      //         (unhappyCount / total) * 100,
      //       ];
      //       const feedbackLabels =
      //         language === "hi"
      //           ? ["संतुष्ट", "असंतुष्ट"]
      //           : ["Satisfied", "Unsatisfied"];
      //       const feedbackObj = {
      //         name: language === "hi" ? "प्रतिक्रिया" : "Feedback",
      //         data: feedbackPercentages,
      //       };
      //       groupPercentageArr.push(feedbackObj);
      //       getChart(groupPercentageArr, feedbackLabels);
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //       setError(true);
      //     });
      // }
      // else if (selectedValue === "role") {
      //   // --- ROLES CHART LOGIC ---
      //   // Get unique roles
      //   const allRoles = filteredData.map((e) => e.role);
      //   const uniqueRoles = [...new Set(allRoles)];
      //   // Calculate percentages for each role
      //   const total = allRoles.length || 1;
      //   const rolePercentages = uniqueRoles.map(roleName =>
      //     (allRoles.filter(r => r === roleName).length / total) * 100
      //   );
      //   const roleLabels = uniqueRoles;
      //   const roleObj = {
      //     name: language === "hi" ? "भूमिकाएँ" : "Roles",
      //     data: rolePercentages,
      //   };
      //   groupPercentageArr.push(roleObj);
      //   getChart(groupPercentageArr, roleLabels);
      // }
      else {
        setShowSelectionComp(true);
        if (presentationView) {
          const selectedRes = filteredData.map((e) => e[selectedValue]);
          const arrLength = selectedRes.length;
          const uniqueSelectedItems = new Set(selectedRes);
          const countDataArray = [];
          uniqueSelectedItems.forEach((item) => {
            const arr = [];
            const obj = {};
            selectedRes.forEach((el, ind) => {
              if (el === item) {
                arr.push(filteredData[ind].result);
              }
            });
            obj.name = item;
            obj.data = percentageCal(arr, uniqueItems, arrLength);
            const counts = getCountData(arr, uniqueItems);
            countDataArray.push(counts);
            groupPercentageArr.push(obj);
          });
          getChart(groupPercentageArr, uniqueItems, countDataArray);
        } else {
          const selectedRes = filteredData.map((e) => e.result);
          const selectedValues = filteredData.map((e) => e[selectedValue]);
          const arrLength = selectedRes.length;
          const uniqueSelectedItems = [...new Set(selectedValues)];
          const countDataArray = [];
          uniqueItems.forEach((item) => {
            const arr = [];
            const obj = {};
            selectedRes.forEach((el, ind) => {
              if (el === item) {
                arr.push(filteredData[ind][selectedValue]);
              }
            });
            obj.name = item;
            obj.data = percentageCal(arr, uniqueSelectedItems, arrLength);
            const counts = getCountData(arr, uniqueSelectedItems);
            countDataArray.push(counts);
            groupPercentageArr.push(obj);
          });
          getChart(groupPercentageArr, uniqueSelectedItems, countDataArray);
        }
      }
    }
  }, [
    selectedValue,
    presentationView,
    charData,
    chartTypeVal,
    language,
    role,
    adminDepartment,
  ]);

  const selectionHandle = (event) => {
    const selectedObj = chartSelection.find((e) => e.id === event.target.value);
    setSelected(event.target.value);
    setSelectedValue(selectedObj.value);
  };
  const chartTypeSelectionHandle = (event) => {
    const selectedObj = chartType.find((e) => e.id === event.target.value);
    setChartTypeVal(event.target.value);
    if (selectedObj.value === "grouped") {
      setChartTypeView(false);
    } else {
      setChartTypeView(true);
    }
  };

  const changePresentaionHandle = (event) => {
    const selectedObj = presentation.find((e) => e.id === event.target.value);
    setChartView(event.target.value);
    if (selectedObj.value === "categoryView") {
      setPresentationView(false);
    } else {
      setPresentationView(true);
    }
  };
  return !error ? (
    sessionStorage.getItem("admin") === "1" ? (
      <>
        <div className={Style.selectionContainer}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {showSelectionsComp && (
              <>
                <SelectionComp
                  mt={3}
                  mr={3}
                  value={chartView}
                  onChange={changePresentaionHandle}
                  menuItems={presentation}
                  label={t.presentation}
                />
                <SelectionComp
                  mt={3}
                  mr={3}
                  value={chartTypeVal}
                  onChange={chartTypeSelectionHandle}
                  menuItems={chartType}
                  label={t.chartType}
                />
              </>
            )}
            <SelectionComp
              mt={3}
              mr={3}
              value={selected}
              onChange={selectionHandle}
              menuItems={chartSelection}
              label={t.groups}
            />
          </ThemeProvider>
        </div>

        {state ? (
          <>
            <div className={Style.container}>
              <Chart
                className={Style.chart}
                options={state.options}
                series={state.series}
                type="bar"
                height={350}
              />
            </div>
            {/* --- DETAILED DATA TABLE ADDED HERE --- */}
            <div style={{ padding: "0 20px 20px 20px" }}>
              <TableContainer component={Paper} elevation={2}>
                <Table size="small" aria-label="simple table">
                  <TableHead style={{ backgroundColor: "#f5f5f5" }}>
                    <TableRow>
                      <TableCell style={{ fontWeight: "bold" }}>
                        {t.groups || "Group / Series"}
                      </TableCell>
                      {chartCategories.map((cat, index) => (
                        <TableCell
                          key={index}
                          align="center"
                          style={{ fontWeight: "bold" }}
                        >
                          {cat}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {chartDataNumbers.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        {row.dataPoints.map((dp, dpIndex) => (
                          <TableCell key={dpIndex} align="center">
                            {dp && dp.count !== undefined ? (
                              <>
                                <div style={{ fontWeight: 500 }}>
                                  {dp.count}
                                </div>
                                <div
                                  style={{
                                    fontSize: "0.8em",
                                    color: "#666",
                                  }}
                                >
                                  ({dp.percentage}%)
                                </div>
                              </>
                            ) : dp && dp.percentage !== undefined ? (
                              // Fallback if only percentage is available
                              `${dp.percentage}%`
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            {/* -------------------------------------- */}
          </>
        ) : (
          <Loader />
        )}
      </>
    ) : (
      <Error setMsg={setMsg} errMsg={t.adminOnlyView} />
    )
  ) : (
    <Error setMsg={setMsg} errMsg={t.networkError} />
  );
}