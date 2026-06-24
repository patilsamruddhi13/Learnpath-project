import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Rocket, Lightbulb, ExternalLink, Loader2, AlertTriangle, BookOpen, Clock, School } from 'lucide-react';
import api from '../api/api';

function Recommendation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [branch, setBranch] = useState('');
  const [goal, setGoal] = useState(location.state?.goal || '');
  const [exam, setExam] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedStartup, setSelectedStartup] = useState(null);

  const getRecommendation = async () => {
    if (goal === 'not_decided') {
      navigate('/psychometric-test');
      return;
    }
    if (!branch || !goal) {
      setError('Please select both Branch and Goal.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // Call Spring Boot proxy, not Flask directly
      const response = await api.post('/api/recommend/custom', { branch, goal, target_exam: exam });
      setResult(response.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Recommendation service is unavailable. Please ensure the ML service is running.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const isStartupGoal = goal === 'startup';

  return (
    <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-text-light dark:text-text-dark flex items-center gap-3">
          <Rocket className="text-primary" size={32} />
          Career Recommendation
        </h2>
        <p className="mt-2 text-text-muted-light dark:text-text-muted-dark">
          Enter your details to get a personalized roadmap.
        </p>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-8 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Branch */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-light dark:text-text-dark">Branch</label>
            <select value={branch} onChange={(e) => setBranch(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none">
              <option value="">Select Branch</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Electrical">Electrical</option>
              <option value="ENTC">ENTC</option>
              <option value="Civil">Civil</option>
            </select>
          </div>
          {/* Goal */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-light dark:text-text-dark">Goal</label>
            <select value={goal} onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none">
              <option value="">Select Goal</option>
              <option value="placement">Placement / Job</option>
              <option value="masters">Masters / GATE</option>
              <option value="govt">Government Exam</option>
              <option value="startup">Startup</option>
              <option value="not_decided">Not Decided Yet</option>
            </select>
          </div>
          {/* Exam (optional) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-light dark:text-text-dark">Target Exam (optional)</label>
            <select value={exam} onChange={(e) => setExam(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none">
              <option value="">None</option>
              <option value="GATE">GATE</option>
              <option value="CAT">CAT</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400 rounded-xl text-sm flex items-center gap-2">
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        <button onClick={getRecommendation} disabled={loading}
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="animate-spin" size={18} /> Loading...</> : 'Get Recommendation'}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-2">{result.title}</h3>
            <p className="text-indigo-100">{result.description}</p>
          </div>

          {isStartupGoal ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.steps.map((step, index) => (
                <button key={index} onClick={() => setSelectedStartup(step)}
                  className="text-left bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-slate-700 p-6 hover:shadow-md hover:border-primary dark:hover:border-primary transition-all">
                  <div className="text-4xl mb-3">{step.icon}</div>
                  <h4 className="font-bold text-text-light dark:text-text-dark mb-1">{step.name}</h4>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{step.description}</p>
                  <span className="mt-2 inline-block text-xs font-medium text-primary">Investment: {step.investment}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {result.steps.map((step, index) => (
                <div key={index} className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
                  <h4 className="font-bold text-text-light dark:text-text-dark mb-3 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">{index + 1}</span>
                    {step.title}
                  </h4>
                  <div className="space-y-2">
                    {(step.resources || []).map((res, i) => (
                      <a key={i} href={res.link} target="_blank" rel="noreferrer"
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group">
                        <span className="text-sm font-medium text-text-light dark:text-text-dark group-hover:text-primary">
                          🔗 {res.name}
                        </span>
                        <span className="text-xs text-text-muted-light dark:text-text-muted-dark">⭐ {res.rating}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CAT syllabus */}
          {result.syllabus && (
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
              <h4 className="font-bold text-text-light dark:text-text-dark mb-3 flex items-center gap-2">
                <BookOpen className="text-primary" size={20} />
                Syllabus Outline
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-text-muted-light dark:text-text-muted-dark">
                {result.syllabus.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* CAT timeline */}
          {result.timeline && (
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
              <h4 className="font-bold text-text-light dark:text-text-dark mb-3 flex items-center gap-2">
                <Clock className="text-secondary" size={20} />
                Preparation Timeline
              </h4>
              <ol className="relative border-l border-gray-200 dark:border-slate-700 space-y-4 pl-4 ml-2">
                {result.timeline.map((item, index) => (
                  <li key={index} className="relative">
                    <span className="absolute -left-[21px] top-1.5 flex items-center justify-center w-3 h-3 bg-secondary rounded-full ring-4 ring-white dark:ring-slate-900" />
                    <p className="text-sm font-medium text-text-light dark:text-text-dark">{item}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* CAT top colleges */}
          {result.top_colleges && (
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
              <h4 className="font-bold text-text-light dark:text-text-dark mb-3 flex items-center gap-2">
                <School className="text-primary" size={20} />
                Top Colleges / Target Cutoffs
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.top_colleges.map((college, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-xl p-3 flex justify-between items-center text-sm">
                    <span className="font-medium text-text-light dark:text-text-dark">{college.name}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">{college.cutoff}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Startup Detail Modal */}
      {selectedStartup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedStartup(null)}>
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-text-light dark:text-text-dark">{selectedStartup.name}</h3>
              <button onClick={() => setSelectedStartup(null)}
                className="text-text-muted-light dark:text-text-muted-dark hover:text-red-500 transition-colors text-2xl leading-none">×</button>
            </div>
            <p className="text-text-muted-light dark:text-text-muted-dark mb-4">{selectedStartup.description}</p>
            <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
              <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-3">
                <span className="font-semibold text-text-light dark:text-text-dark block">Investment</span>
                <span className="text-text-muted-light dark:text-text-muted-dark">{selectedStartup.investment}</span>
              </div>
              <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-3">
                <span className="font-semibold text-text-light dark:text-text-dark block">Income Potential</span>
                <span className="text-text-muted-light dark:text-text-muted-dark">{selectedStartup.income}</span>
              </div>
            </div>
            {selectedStartup.skills && (
              <div className="mb-4">
                <h4 className="font-bold text-text-light dark:text-text-dark mb-2 flex items-center gap-2"><Lightbulb size={16} className="text-yellow-500" /> Skills Required</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStartup.skills.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-primary dark:text-indigo-300 rounded-full text-sm">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {selectedStartup.how_to_start && (
              <div className="mb-4">
                <h4 className="font-bold text-text-light dark:text-text-dark mb-2">How To Start</h4>
                <ol className="space-y-1">
                  {selectedStartup.how_to_start.map((item, i) => (
                    <li key={i} className="text-sm text-text-muted-light dark:text-text-muted-dark flex gap-2"><span className="font-bold text-primary">{i + 1}.</span>{item}</li>
                  ))}
                </ol>
              </div>
            )}
            {selectedStartup.resources && (
              <div>
                <h4 className="font-bold text-text-light dark:text-text-dark mb-2 flex items-center gap-2"><BookOpen size={16} className="text-green-500" /> Resources</h4>
                <div className="space-y-2">
                  {selectedStartup.resources.map((r, i) => (
                    <a key={i} href={r.link} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <ExternalLink size={14} /> {r.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Recommendation;