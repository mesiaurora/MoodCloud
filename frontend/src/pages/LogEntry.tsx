import { useEffect, useState } from "react";
import { getFields, type Field } from "../api/fields";
import { createLogEntry } from "../api/logentry";
import { Link, useNavigate } from "react-router-dom";

export default function LogEntry() {

  const [fields, setFields] = useState<Field[]>([]);
  const [values, setValues] = useState<Record<number, string | number | boolean>>({});
  const navigate = useNavigate();

  useEffect(() => {
    getFields().then(setFields);
  }, []);

  const handleSaveEntry = () => {
    createLogEntry({ field_values: Object.entries(values).map(([field_id, value]) => {
      const field = fields.find(f => f.id === Number(field_id));
      if (!field) return null;

      const fieldValue: any = { field_id: Number(field_id) };
      if (field.field_type === 'numeric') {
        fieldValue.numeric_value = value as number;
      } else if (field.field_type === 'boolean') {
        fieldValue.boolean_value = value as boolean;
      } else if (field.field_type === 'text') {
        fieldValue.text_value = value as string;
      }
      return fieldValue;
    }).filter(v => v !== null) }).then(() => {
      navigate('/');
      setValues({});
    }).catch(() => {
      alert('Failed to save log entry. Please try again.');
    });  }

  if (fields.length === 0) {
  return (
    <div className="min-h-screen bg-frost flex flex-col items-center pt-16 px-4">
      <p className="text-plum text-2xl font-bold mb-8">Log an Entry</p>
      <div className="bg-mint rounded-2xl shadow-lg p-6 w-full max-w-sm text-center">
        <p className="text-plum mb-4">No fields yet.</p>
        <Link to="/settings" className="text-teal font-medium hover:underline">Go to Settings to add some</Link>
      </div>
    </div>
  );
}

  return (<div className="min-h-screen bg-frost flex flex-col items-center pt-16 px-4">
    <p className="text-plum text-2xl font-bold mb-8">Log Entry</p>
      <div className="bg-mint rounded-2xl shadow-lg p-6 flex flex-col items-center mb-4 w-full max-w-sm">
        <p className="text-plum font-medium mb-4">Fill in your fields</p>
        {fields.filter(field => field.is_active).map(field => (
          <div key={field.id} className="flex flex-col items-start w-full mb-4">
            <label className="text-plum font-medium mb-1">{field.name}</label>
            {field.field_type === 'numeric' && (
              <input
                type="number"
                className="bg-mist border border-steel rounded-lg p-2 text-plum outline-none focus:ring-2 focus:ring-teal w-full"
                value={values[field.id] as number || ''}
                onChange={e => setValues({ ...values, [field.id]: e.target.valueAsNumber })}
              />
            )}
            {field.field_type === 'boolean' && (
              <select
                className="bg-mist border border-steel rounded-lg p-2 text-plum outline-none focus:ring-2 focus:ring-teal w-full"
                value={String(values[field.id]) || ''}
                onChange={e => setValues({ ...values, [field.id]: e.target.value === 'true' })}
              >
                <option value="">Select an option</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            )}
            {field.field_type === 'text' && (
              <input
                type="text"
                className="bg-mist border border-steel rounded-lg p-2 text-plum outline-none focus:ring-2 focus:ring-teal w-full"
                value={values[field.id] as string || ''}
                onChange={e => setValues({ ...values, [field.id]: e.target.value })}
              />
            )}
          </div>
        ))}
        <button onClick={handleSaveEntry} className="bg-plum text-lavender rounded-lg py-2 font-semibold hover:opacity-90 transition-opacity w-full">
          Save Entry
        </button>
      </div>
  </div>)
}