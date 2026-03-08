import { useState, useEffect } from "react";
import { getLogEntries, type LogEntry } from "../api/logentry";

export default function History() {
  const [entries, setEntries] = useState<LogEntry[]>([]);

  useEffect(() => {
    getLogEntries().then(setEntries);
  }, []);

  return (<div className="min-h-screen bg-frost flex flex-col items-center pt-16 px-4">
    <p className="text-plum text-2xl font-bold mb-8">History</p>
    <div className="bg-mint rounded-2xl shadow-lg p-6 flex flex-col items-center mb-4 w-full max-w-sm">
      {entries.length === 0 ? (
        <p className="text-plum text-sm">No log entries yet.</p>
      ) : (
        <div className="w-full max-h-[600px] overflow-y-auto">
        {entries.map(entry => (
          <div key={entry.id} className="bg-mist rounded-lg p-4 mb-2 w-full">
            <p className="text-plum text-sm mb-1">{new Date(entry.logged_at).toLocaleString('fi-FI')}</p>
            {entry.field_values.map(fv => (
              <div key={fv.id} className="ml-2 flex justify-between">
                <p className="text-plum font-medium">{fv.field.name}</p>
                <p className="text-plum">
                  {fv.field.field_type === 'numeric' && fv.numeric_value !== null ? fv.numeric_value : ''}
                  {fv.field.field_type === 'boolean' && fv.boolean_value !== null ? (fv.boolean_value ? 'Yes' : 'No') : ''}
                  {fv.field.field_type === 'text' && fv.text_value !== null ? fv.text_value : ''}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
      )}
    </div>
    </div>)
}