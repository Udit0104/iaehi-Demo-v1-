import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Chart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
import Style from "./DetailedSummary.module.css";
import { url } from "../Data/apiData";
import * as variables from "../Data/variables";
import Button from "../ReUsable/ButtonComp";
import Loader from "../ReUsable/Loader";

const DetailedSummary = () => {
  const navigate = useNavigate();
  const reportRef = useRef();
  const isMounted = useRef(true);

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [overallStats, setOverallStats] = useState(null);

  const categories = [
    variables.cond1,
    variables.cond2,
    variables.cond3,
    variables.cond4,
  ];

  /* ---------------- ROLE FILTER PLACEHOLDER ---------------- */
  const applyRoleFiltering = (data) => {
    return data; // future admin filter hook
  };

  /* ---------------- FETCH USERS ---------------- */
  useEffect(() => {
    isMounted.current = true;

    axios.get(`${url}/users`).then((res) => {
      if (!isMounted.current) return;

      const filtered = applyRoleFiltering(res.data);
      setUsers(filtered);
      computeOverall(filtered);
      setLoading(false);
    });

    return () => {
      isMounted.current = false;
    };
  }, []);

  /* ---------------- OVERALL STATS ---------------- */
  const computeOverall = (data) => {
    const total = data.length || 1;

    const counts = categories.map(
      (cat) => data.filter((u) => u.result === cat).length
    );

    const percentages = counts.map((c) =>
      Number(((c * 100) / total).toFixed(1))
    );

    const avgScore = (
      data.reduce((acc, u) => acc + (u.score || 0), 0) / total
    ).toFixed(1);

    setOverallStats({ total, counts, percentages, avgScore });
  };

  /* ---------------- AGE BREAKDOWN ---------------- */
  const ageBreakdown = [...new Set(users.map((u) => u.age).filter(Boolean))].map(
    (age) => {
      const ageUsers = users.filter((u) => u.age === age);
      const total = ageUsers.length || 1;

      const counts = categories.map(
        (cat) => ageUsers.filter((u) => u.result === cat).length
      );

      const percentages = counts.map((c) =>
        Number(((c * 100) / total).toFixed(1))
      );

      const maxIdx = percentages.indexOf(Math.max(...percentages));

      return {
        name: age,
        total,
        counts,
        percentages,
        topCategory: categories[maxIdx],
        topPercentage: percentages[maxIdx],
      };
    }
  );

  /* ---------------- GENDER BREAKDOWN ---------------- */
  const genderBreakdown = [
    ...new Set(users.map((u) => u.gender).filter(Boolean)),
  ].map((gender) => {
    const genderUsers = users.filter((u) => u.gender === gender);
    const total = genderUsers.length || 1;

    const counts = categories.map(
      (cat) => genderUsers.filter((u) => u.result === cat).length
    );

    const percentages = counts.map((c) =>
      Number(((c * 100) / total).toFixed(1))
    );

    const maxIdx = percentages.indexOf(Math.max(...percentages));

    return {
      name: gender,
      total,
      counts,
      percentages,
      topCategory: categories[maxIdx],
      topPercentage: percentages[maxIdx],
    };
  });

  /* ---------------- DEPARTMENT BREAKDOWN ---------------- */
  const departmentBreakdowns = [
    ...new Set(users.map((u) => u.department).filter(Boolean)),
  ].map((dept) => {
    const deptUsers = users.filter((u) => u.department === dept);
    const total = deptUsers.length || 1;

    const counts = categories.map(
      (cat) => deptUsers.filter((u) => u.result === cat).length
    );

    const percentages = counts.map((c) =>
      Number(((c * 100) / total).toFixed(1))
    );

    const maxIdx = percentages.indexOf(Math.max(...percentages));

    return {
      name: dept,
      total,
      counts,
      percentages,
      topCategory: categories[maxIdx],
      topPercentage: percentages[maxIdx],
    };
  });

  /* ---------------- DYNAMIC CONCLUSION ---------------- */
  const positive =
    overallStats?.percentages[0] + overallStats?.percentages[1];
  const negative =
    overallStats?.percentages[2] + overallStats?.percentages[3];

  /* ---------------- CHART OPTIONS ---------------- */
  const chartOptions = (labels) => ({
    chart: { toolbar: { show: false }, animations: { enabled: false } },
    plotOptions: { bar: { borderRadius: 6, columnWidth: "50%" } },
    colors: ["#001f3f", "#ffc815", "#2ecc71", "#e74c3c"],
    xaxis: { categories: labels },
    yaxis: { max: 100 },
    legend: { show: false },
  });

  /* ---------------- SAFE PDF DOWNLOAD ---------------- */
  const downloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const sections = reportRef.current.querySelectorAll(
        `.${Style.pdfPage}`
      );

      for (let i = 0; i < sections.length; i++) {
        if (!isMounted.current) return;

        const canvas = await html2canvas(sections[i], {
          scale: 2,
          useCORS: true,
          logging: false,
        });

        const imgData = canvas.toDataURL("image/png");
        const pW = pdf.internal.pageSize.getWidth();
        const pH = (canvas.height * pW) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pW, pH);
        if (i < sections.length - 1) pdf.addPage();
      }

      pdf.save("IAEHI_Organizational_Report.pdf");
    } catch (err) {
      console.error("PDF stopped safely:", err);
    }
  };

  /* ---------------- CONCLUSION INSIGHTS ---------------- */

const positivePercentage =
  (overallStats?.percentages?.[0] || 0) +
  (overallStats?.percentages?.[1] || 0);

const negativePercentage =
  (overallStats?.percentages?.[2] || 0) +
  (overallStats?.percentages?.[3] || 0);

// Strongest & weakest category
const strongestIdx = overallStats?.percentages
  ? overallStats.percentages.indexOf(
      Math.max(...overallStats.percentages)
    )
  : 0;

const weakestIdx = overallStats?.percentages
  ? overallStats.percentages.indexOf(
      Math.min(...overallStats.percentages)
    )
  : 0;

const strongestCategory = categories[strongestIdx] || "";
const weakestCategory = categories[weakestIdx] || "";

// Strongest & weakest department
let strongestDept = null;
let weakestDept = null;

if (departmentBreakdowns.length > 0) {
  strongestDept = departmentBreakdowns.reduce((prev, curr) =>
    curr.topPercentage > prev.topPercentage ? curr : prev
  );

  weakestDept = departmentBreakdowns.reduce((prev, curr) =>
    curr.topPercentage < prev.topPercentage ? curr : prev
  );
}

  if (loading || !overallStats) return <Loader />;

  return (
    <div className={Style.pageWrapper}>
      <div className={Style.actionButtons} data-html2canvas-ignore="true">
        <Button title="← Back" onClick={() => navigate(-1)} />
        <Button title="Download Professional PDF" onClick={downloadPDF} />
      </div>

      <div ref={reportRef} className={Style.reportContainer}>

        {/* EXECUTIVE SUMMARY */}
        <section className={Style.pdfPage}>
          <h1 className={Style.mainTitle}>Organizational Happiness Report</h1>
          <p className={Style.subtitle}>
            Generated on {new Date().toLocaleDateString()}
          </p>

          <table className={Style.insightTable}>
            <tbody>
              <tr>
                <td>Total Employees</td>
                <td>{overallStats.total}</td>
              </tr>
              <tr>
                <td>Average Score</td>
                <td>{overallStats.avgScore}</td>
              </tr>
            </tbody>
          </table>

          <Chart
            options={chartOptions(categories)}
            series={[{ data: overallStats.percentages }]}
            type="bar"
            height={350}
          />
        </section>

        {/* AGE PAGE */}
{ageBreakdown.length > 0 && (
  <section className={Style.pdfPage}>
    <h2 className={Style.sectionTitle}>Age-wise Distribution</h2>

    {ageBreakdown.map((age, i) => (
      <div key={i} style={{ marginBottom: "40px" }}>
        <h4>{age.name} (Sample: {age.total})</h4>

        <Chart
          options={chartOptions(categories)}
          series={[{ name: "Percentage (%)", data: age.percentages }]}
          type="bar"
          height={300}
        />

        <table className={Style.insightTable}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Count</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, idx) => (
              <tr key={idx}>
                <td>{cat}</td>
                <td>{age.counts[idx]}</td>
                <td>{age.percentages[idx]}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={Style.writtenInsight}>
          <p>
            The dominant wellbeing state in this age group is{" "}
            <strong>{age.topCategory}</strong> ({age.topPercentage}%).
          </p>
        </div>
      </div>
    ))}
  </section>
)}

        {/* GENDER PAGE */}
{genderBreakdown.length > 0 && (
  <section className={Style.pdfPage}>
    <h2 className={Style.sectionTitle}>Gender-wise Distribution</h2>

    {genderBreakdown.map((g, i) => (
      <div key={i} style={{ marginBottom: "40px" }}>
        <h4>{g.name} (Sample: {g.total})</h4>

        <Chart
          options={chartOptions(categories)}
          series={[{ name: "Percentage (%)", data: g.percentages }]}
          type="bar"
          height={300}
        />

        <table className={Style.insightTable}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Count</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, idx) => (
              <tr key={idx}>
                <td>{cat}</td>
                <td>{g.counts[idx]}</td>
                <td>{g.percentages[idx]}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={Style.writtenInsight}>
          <p>
            The highest representation among {g.name} employees
            falls under <strong>{g.topCategory}</strong> ({g.topPercentage}%).
          </p>
        </div>
      </div>
    ))}
  </section>
)}

        {/* DEPARTMENT BREAKDOWN */}
{departmentBreakdowns.map((dept, idx) => (
  <section key={idx} className={Style.pdfPage}>
    <h2 className={Style.sectionTitle}>Department: {dept.name}</h2>

    <p className={Style.sampleSize}>
      Sample Size: {dept.total} employees
    </p>

    <Chart
      options={chartOptions(categories)}
      series={[{ name: "Percentage (%)", data: dept.percentages }]}
      type="bar"
      height={350}
    />

    <table className={Style.insightTable}>
      <thead>
        <tr>
          <th>Category</th>
          <th>Count</th>
          <th>Percentage</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((cat, i) => (
          <tr key={i}>
            <td>{cat}</td>
            <td>{dept.counts[i]}</td>
            <td>{dept.percentages[i]}%</td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className={Style.writtenInsight}>
      <p>
        The dominant wellbeing state in {dept.name} is{" "}
        <strong>{dept.topCategory}</strong> ({dept.topPercentage}%).
      </p>
    </div>
  </section>
))}

        {/* FINAL PAGE – DYNAMIC EXECUTIVE CONCLUSION */}
<section className={Style.pdfPage}>
  <h2 className={Style.sectionTitle}>Executive Conclusion</h2>

  <div className={Style.writtenInsight}>
    <p>
      This assessment evaluated the wellbeing landscape of{" "}
      <strong>{overallStats.total}</strong> employees across
      multiple organisational dimensions. The analysis reveals
      an overall positive engagement level of{" "}
      <strong>{positivePercentage.toFixed(1)}%</strong>,
      while{" "}
      <strong>{negativePercentage.toFixed(1)}%</strong> of
      employees fall within categories requiring structured
      improvement initiatives.
    </p>

    <p>
      The most prominent wellbeing segment within the
      organisation is{" "}
      <strong>{strongestCategory}</strong>,
      indicating areas of cultural strength and resilience.
      Conversely,{" "}
      <strong>{weakestCategory}</strong> represents
      the smallest segment, highlighting a critical zone that
      demands targeted strategic intervention.
    </p>

    {strongestDept && weakestDept && (
      <p>
        From a departmental perspective,{" "}
        <strong>{strongestDept.name}</strong> demonstrates
        the strongest wellbeing concentration, with{" "}
        <strong>{strongestDept.topPercentage}%</strong> of
        employees aligned within its dominant category.
        In contrast,{" "}
        <strong>{weakestDept.name}</strong> presents
        comparatively lower positive alignment and would
        benefit from focused engagement programs and leadership
        reinforcement.
      </p>
    )}

    <p>
      The data clearly indicates that employee happiness is
      not merely a cultural metric but a strategic performance
      driver. Higher engagement levels directly influence
      productivity, collaboration, innovation capacity, and
      long-term retention stability.
    </p>

    <p>
      A balanced transformation roadmap combining proactive
      listening frameworks, structured career development
      pathways, recognition systems, and empathetic leadership
      alignment can significantly elevate the organisation’s
      overall Happiness Index and sustainable growth potential.
    </p>

    <p>
      These insights provide executive leadership with a
      data-backed foundation to strengthen organisational
      culture, empower teams, and unlock the full
      performance potential of the workforce.
    </p>
  </div>
</section>
      </div>
    </div>
  );
};

export default DetailedSummary;