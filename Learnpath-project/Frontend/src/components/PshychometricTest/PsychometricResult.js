import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Trophy, ArrowRight, PieChart, Briefcase, GraduationCap, Lightbulb, Building } from "lucide-react";
import { saveUserProfile } from '../../api/api';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const PsychometricResult = () => {
  const location = useLocation();
  const scores = location.state?.scores;
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (!scores) return;
    // Determine the winning goal key
    const { placement, masters, entrepreneur, govt } = scores;
    const maxScore = Math.max(placement, masters, entrepreneur, govt);
    let derivedGoal = 'placement';
    if (maxScore === masters)       derivedGoal = 'masters';
    else if (maxScore === entrepreneur) derivedGoal = 'startup';
    else if (maxScore === govt)     derivedGoal = 'govt';

    // Persist to backend so Dashboard can use it
    saveUserProfile({ goal: derivedGoal }).catch(() => {
      // Silent fail — user can still see results
    });
  }, [scores]);

  if (!scores) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">No result available</h2>
        <Link to="/psychometric-test" className="text-primary hover:underline">Take the test</Link>
      </div>
    );
  }

  const { placement, masters, entrepreneur, govt } = scores;
  const maxScore = Math.max(placement, masters, entrepreneur, govt);

  let resultTitle = "";
  let ResultIcon = Trophy;
  let resultDescription = "";

  if (maxScore === placement) {
    resultTitle = "Placement / Software Job";
    ResultIcon = Briefcase;
    resultDescription = "Your profile aligns strongly with immediate industry roles. Focus on DSA, development frameworks, and interview preparation.";
  } else if (maxScore === masters) {
    resultTitle = "Higher Studies (MS/MTech)";
    ResultIcon = GraduationCap;
    resultDescription = "You show a strong inclination towards research and advanced learning. Start preparing for exams like GRE or GATE.";
  } else if (maxScore === entrepreneur) {
    resultTitle = "Startup / Entrepreneurship";
    ResultIcon = Lightbulb;
    resultDescription = "You have the mindset of a founder. Focus on building products, understanding markets, and networking.";
  } else {
    resultTitle = "Government Jobs";
    ResultIcon = Building;
    resultDescription = "Your preferences lean towards stability and public service. Begin structured preparation for competitive exams.";
  }

  const totalScore = placement + masters + entrepreneur + govt;

  const getPercentage = (score) => Math.round((score / totalScore) * 100) || 0;

  const scoreData = [
    { label: "Placement", score: placement, percentage: getPercentage(placement) },
    { label: "Masters", score: masters, percentage: getPercentage(masters) },
    { label: "Entrepreneur", score: entrepreneur, percentage: getPercentage(entrepreneur) },
    { label: "Government", score: govt, percentage: getPercentage(govt) },
  ];

  const chartData = {
    labels: scoreData.map((s) => s.label),
    datasets: [
      {
        data: scoreData.map((s) => s.percentage),
        backgroundColor: ['#3b82f6', '#a855f7', '#f97316', '#22c55e'],
        borderColor: isDarkMode ? '#1e293b' : '#ffffff',
        borderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDarkMode ? '#f8fafc' : '#0f172a',
          padding: 16,
          font: { size: 13 },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`,
        },
      },
    },
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">Your Career Recommendation</h2>
        <p className="mt-2 text-text-muted-light dark:text-text-muted-dark">Based on your psychometric profile</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Main Result Card */}
        <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-1 shadow-lg h-full">
          <div className="bg-surface-light dark:bg-surface-dark rounded-[23px] h-full p-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-6">
              <ResultIcon size={40} className="text-primary" />
            </div>

            <h3 className="text-sm font-bold tracking-widest text-primary uppercase mb-2">Top Recommendation</h3>
            <h4 className="text-2xl sm:text-3xl font-bold text-text-light dark:text-text-dark mb-4">
              {resultTitle}
            </h4>

            <p className="text-text-muted-light dark:text-text-muted-dark mb-8">
              {resultDescription}
            </p>

            <Link
              to="/dashboard"
              className="mt-auto w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-md"
            >
              Go to Dashboard
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Score Analysis Card */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-md border border-gray-100 dark:border-slate-700 p-8 h-full">
          <div className="flex items-center gap-3 mb-8">
            <PieChart className="text-secondary" size={24} />
            <h3 className="text-xl font-bold text-text-light dark:text-text-dark">Score Analysis</h3>
          </div>

          <div className="relative h-56 w-full flex items-center justify-center">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default PsychometricResult;