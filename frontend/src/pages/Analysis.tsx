import { useEffect, useState } from "react"
import { getAnalysis, type BooleanResult, type FieldAnalysis, type NumericResult, type TextResult } from "../api/analysis";

export default function Analysis() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showCustom, setShowCustom] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<FieldAnalysis[]>([]);
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // TODO: buttons to analyse week, analyse month, analyse custom range (show date pickers when clicking this one)

  const handleDataAnalysis = (startDate?: string, endDate?: string) => {
    getAnalysis(startDate || '', endDate || '').then(response => {
      setAnalysisResults(response.analysis);
    }).catch(() => {
      alert('Failed to fetch analysis. Please try again.');
    });
  }

  const handleCustomAnalysis = () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }
    handleDataAnalysis(startDate, endDate);
    setShowCustom(false);
    setStartDate('');
    setEndDate('');
  }

  
  return (<div className="min-h-screen bg-frost flex flex-col items-center pt-16 px-4">
    <p className="text-plum text-2xl font-bold mb-8">Analysis</p>
    {/* Buttons */}
    <div className="bg-mint rounded-2xl shadow-lg p-6 flex flex-col items-center mb-4 w-full max-w-sm flex gap-2">
      <p className="text-plum font-medium mb-4">Analyse your data</p>
      <div className="flex gap-2">
      <button onClick={() => handleDataAnalysis(weekAgo, today)} className="bg-plum text-lavender rounded-lg px-6 py-2 font-semibold hover:opacity-90 transition-opacity">
        Analyse this week
      </button>
      <button onClick={() => handleDataAnalysis(monthAgo, today)} className="bg-plum text-lavender rounded-lg px-6 py-2 font-semibold hover:opacity-90 transition-opacity">
        Analyse this month
      </button>
      <button onClick={() => setShowCustom(true)} className="bg-plum text-lavender rounded-lg px-6 py-2 font-semibold hover:opacity-90 transition-opacity">
        Analyse custom range
      </button>
      </div>
      {showCustom && (
        <div className="flex flex-col gap-2 mt-4 w-full">
          <div className="flex gap-2">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} 
              className="bg-mist border border-steel rounded-lg p-2 text-plum flex-1" />
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="bg-mist border border-steel rounded-lg p-2 text-plum flex-1" />
          </div>
          <button onClick={handleCustomAnalysis} className="bg-plum text-lavender rounded-lg px-3 py-2 font-semibold hover:opacity-90 w-full">
            Go
          </button>
        </div>
      )}
    </div>

    {/* Analysis Results */}
    {analysisResults.length > 0 ? ( 
      <div className="bg-mint rounded-2xl shadow-lg p-6 flex flex-col items-center mb-4 w-full max-w-sm">
      {analysisResults.map(result => (
        <div key={result.field} className="w-full mb-4">
          <p className="text-plum font-medium mb-2">{result.field}</p>
          {result.type === 'numeric' && (
            <div className="bg-mist rounded-lg p-4">    
              <p className="text-plum text-3xl font-bold text-center">{(result as NumericResult).median}</p>
              <p className="text-plum text-xs text-center mb-2">median</p>
              <p className="text-plum text-sm text-center">mean: {(result as NumericResult).mean.toFixed(1)}</p>
            </div>
          )}
          {result.type === 'boolean' && (
            <div className="bg-mist rounded-lg p-4">
              <div className="flex w-full h-8 rounded overflow-hidden mb-2 bg-gray-200">
                <div 
                  className="bg-teal" 
                  style={{ width: `${((result as BooleanResult).true_count / ((result as BooleanResult).true_count + (result as BooleanResult).false_count)) * 100}%` }}
                />
                <div 
                  className="bg-plum" 
                  style={{ width: `${((result as BooleanResult).false_count / ((result as BooleanResult).true_count + (result as BooleanResult).false_count)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-plum">
                <span>True: {(result as BooleanResult).true_count}</span>
                <span>False: {(result as BooleanResult).false_count}</span>
              </div>
            </div>
          )}
          {result.type === 'text' && (
            <div className="bg-mist rounded-lg p-4">
              <div className="flex flex-wrap gap-2">
                {(() => {
                  const maxCount = Math.max(...(result as TextResult).word_counts.map(w => w.count));
                  return (result as TextResult).word_counts.map(({ word, count }) => {
                    const fontSize = Math.max(12, Math.min(32, (count / maxCount) * 32));
                    const colors = ['#557F84', '#583366', '#77a3aa', '#4d2c59', '#346668 ', '#6b4c7b', '#35524a', '#8c5c9c', '#4e8098', '#7a4069'];
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    return (
                      <span key={word} className="text-plum" style={{ fontSize: `${fontSize}px`, color }}>
                        {word}
                      </span>
                    );
                  });
                })()}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>) : (
      <div className="bg-mint rounded-2xl shadow-lg p-6 flex flex-col items-center mb-4 w-full max-w-sm">
      <p className="text-plum text-sm">No analysis results to display. Please run an analysis.</p>
      </div>
    )}
  </div>)
}
