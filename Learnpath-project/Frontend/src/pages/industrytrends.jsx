import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, RefreshCw, AlertCircle } from 'lucide-react';

//  Import local JSON
import trendsData from './response.json';

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
const departmentKeywords = {
  All: [],

  CSE: ["AI", "Software", "Cloud", "Cybersecurity"],

  Mechanical: ["Robotics", "Automation", "Electric Vehicle", "Manufacturing"],

  Civil: ["Construction", "Infrastructure", "Smart City", "Sustainability"],

  ENTC: ["IoT", "Semiconductor", "VLSI", "5G"],

  Electrical: ["Renewable Energy", "Power Systems", "Battery", "Smart Grid"]
};
const IndustryTrends = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  //  Replace API call with local data
  const fetchTrends = () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate loading delay (optional)
      setTimeout(() => {
        const shuffled = shuffleArray(trendsData.articles);
        setTrends(shuffled);
        setLastUpdated(new Date());
        setLoading(false);
      }, 500);
    } catch (err) {
      setError("Failed to load local data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  // for advancments
const filteredTrends =
  selectedDepartment === "All"
    ? trends
    : trends.filter((trend) =>
        departmentKeywords[selectedDepartment].some((keyword) =>
          (
            trend.title + " " + trend.description
          )
            .toLowerCase()
            .includes(keyword.toLowerCase())
        )
      );
  return (
    <div className="max-w-6xl mx-auto p-6 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Emerging Tech Trends</h1>
        </div>
        <button
          onClick={fetchTrends}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-2xl hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Department Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2">
          Select Department
        </label>
        <select
          className="w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-slate-800 text-text-light dark:text-text-dark font-medium transition-colors"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="All">All Departments</option>
          <option value="CSE">CSE / IT</option>
          <option value="Mechanical">Mechanical</option>
          <option value="Civil">Civil</option>
          <option value="ENTC">ENTC</option>
          <option value="Electrical">Electrical</option>
        </select>
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-6">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-400">Error loading trends</h3>
            <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-slate-800 p-6 animate-pulse transition-colors">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      )}

      {/* Trends Grid */}
      {!loading && trends.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrends.map((trend, index) => (
            <div key={index} className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all mb-4">
              {/* Image */}
              {trend.urlToImage && (
                <div className="w-full h-48 overflow-hidden bg-gray-100 dark:bg-slate-800">
                  <img
                    src={trend.urlToImage}
                    alt={trend.title}
                    className="w-full h-full object-cover"
                    style={{
                      height: "220px",
                      objectFit: "cover",
                      width: "100%"
                    }}
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-text-light dark:text-text-dark mb-2 line-clamp-2">
                    {trend.title}
                  </h3>
                  
                  <p className="text-text-muted-light dark:text-text-muted-dark text-sm mb-4 line-clamp-3">
                    {trend.description}
                  </p>
                </div>

                <div>
                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-text-muted-light dark:text-text-muted-dark mb-4">
                    <span className="font-medium">{trend.source?.name}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(trend.publishedAt)}</span>
                    </div>
                  </div>
  
                  {/* Read More Link */}
                  <a
                    href={trend.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-2xl transition-colors text-sm shadow-sm"
                  >
                    Read Full Article
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && trends.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2">No trends found for selected department</h3>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            No global trends available for {selectedDepartment}
          </p>
        </div>
      )}
    </div>
  );
};

export default IndustryTrends;