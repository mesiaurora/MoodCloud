import { useEffect, useState } from "react"
import { getFields, type Field } from "../api/fields";

export default function Settings() {

  const [fields, setFields] = useState<Field[]>([]);
  const [fieldType, setFieldType] = useState<'numeric' | 'boolean' | 'text'>('numeric');

  useEffect(() => {
    getFields().then(setFields);
  }, []);

  // TODO: REMOVE THIS - only for testing without backend
  if (fields.length === 0) setFields([
    { id: 1, name: 'Sleep quality', field_type: 'numeric', created_at: '', is_active: true },
    { id: 2, name: 'Exercise', field_type: 'boolean', created_at: '', is_active: true },
    { id: 3, name: 'Notes', field_type: 'text', created_at: '', is_active: true },
    { id: 4, name: 'Mood', field_type: 'numeric', created_at: '', is_active: true },
    { id: 5, name: 'Stress level', field_type: 'numeric', created_at: '', is_active: true },
    { id: 6, name: 'Social interaction', field_type: 'boolean', created_at: '', is_active: true },
    { id: 7, name: 'Medication', field_type: 'boolean', created_at: '', is_active: true },
  ]);

  return (<div className="min-h-screen bg-frost flex flex-col items-center pt-16 px-4">
    <p className="text-plum text-2xl font-bold mb-8">Settings</p>

  {/* Field management */}
  <div className="bg-mint rounded-2xl shadow-lg p-6 flex flex-col items-center mb-4 w-full max-w-sm">
    <p className="text-plum font-medium mb-4">Manage your fields</p>
    <div className="flex gap-2 w-full mb-4">
      <input className="bg-mist border border-steel rounded-lg p-2 text-plum outline-none focus:ring-2 focus:ring-teal" placeholder="New field name" />
     <select 
        value={fieldType} 
        onChange={(e) => setFieldType(e.target.value as 'numeric' | 'boolean' | 'text')}
        className="bg-mist border border-steel rounded-lg p-2 text-plum outline-none focus:ring-2 focus:ring-teal w-full"
      >
        <option value="numeric">Numeric</option>
        <option value="boolean">Boolean</option>
        <option value="text">Text</option>
      </select>
    </div>
    <button className="bg-plum text-lavender rounded-lg py-2 font-semibold hover:opacity-90 transition-opacity w-full mb-4">
      Add a field
    </button>
    <div className="w-full max-h-60 overflow-y-auto">
      {fields.map(field => (
        <div key={field.id} className="flex items-center justify-between bg-mist rounded-lg p-2 mb-1">
          <p className="text-plum font-medium w-32 text-left">{field.name}</p>
          <p className="text-sm text-plum w-18">{field.field_type}</p>
          <button className="bg-darklavender text-mist rounded-lg px-3 py-1 text-sm font-medium hover:opacity-90">
            Deactivate
          </button>
        </div>
      ))}
    </div>
  </div>

  {/* Account settings */}
  <div className="bg-mint rounded-2xl shadow-lg p-6 flex flex-col items-center mb-4 w-full max-w-sm">
    <p className="text-plum font-medium mb-6">Account settings</p>
    <button className="bg-plum text-lavender rounded-lg px-6 py-2 font-semibold hover:opacity-90 transition-opacity w-full mb-4">
      Update username
    </button>
    <button className="bg-plum text-lavender rounded-lg px-6 py-2 font-semibold hover:opacity-90 transition-opacity w-full mb-4">
      Change password
    </button>
    <button className="bg-plum text-lavender rounded-lg px-6 py-2 font-semibold hover:opacity-90 transition-opacity w-full">
      Delete account
    </button>
  </div>
  </div>)
}