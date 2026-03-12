import { useEffect, useState } from "react"
import { getFields, createField, deleteField, type Field } from "../api/fields";
import { auth } from "../api/auth";
import { Navigate, useNavigate } from "react-router-dom";

export default function Settings() {

  const [fields, setFields] = useState<Field[]>([]);
  const [fieldType, setFieldType] = useState<'numeric' | 'boolean' | 'text'>('numeric');
  const [newFieldName, setNewFieldName] = useState('');
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showUsernameChange, setShowUsernameChange] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    getFields().then(setFields);
  }, []);

  const handleAddField = () => {
    if (newFieldName.trim() === '') return;

    createField({ name: newFieldName, field_type: fieldType }).then(newField => {
      setFields(prev => [...prev, newField]);
      setNewFieldName('');
    });
  }

  const handleDeactivateField = (fieldId: number) => {
    deleteField(fieldId).then(() => {
      setFields(prev => prev.filter(f => f.id !== fieldId));
    });
  }

  const handleUpdateUsername = () => {
    auth.changeUsername(username).then(() => {
      alert('Username changed successfully');
    });
  }

  const handlePasswordChange = () => {
    auth.changePassword(oldPassword, newPassword, newPasswordConfirm).then(() => {
        alert('Password changed successfully');
    });
  }

  const handleDeleteAccount = () => {
    if(window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      auth.deleteAccount().then(() => {
        auth.logout();
        navigate('/login');
      });
    }
  }

  return (<div className="min-h-screen bg-frost flex flex-col items-center pt-16 px-4">
    <p className="text-plum text-2xl font-bold mb-8">Settings</p>

  {/* Field management */}
  <div className="bg-mint rounded-2xl shadow-lg p-6 flex flex-col items-center mb-4 w-full max-w-sm">
    <p className="text-plum font-medium mb-4">Manage your fields</p>
    <div className="flex gap-2 w-full mb-4">
      <input
        className="bg-mist border border-steel rounded-lg p-2 text-plum outline-none focus:ring-2 focus:ring-teal"
        placeholder="New field name"
        value={newFieldName}
        onChange={(e) => setNewFieldName(e.target.value)}
      />
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
    <button onClick={handleAddField} className="bg-plum text-lavender rounded-lg py-2 font-semibold hover:opacity-90 transition-opacity w-full mb-4">
      Add a field
    </button>
    <div className="w-full max-h-60 overflow-y-auto">
      {fields.map(field => (
        <div key={field.id} className="flex items-center justify-between bg-mist rounded-lg p-2 mb-1">
          <p className="text-plum font-medium w-32 text-left">{field.name}</p>
          <p className="text-sm text-plum w-18">{field.field_type}</p>
          <button onClick={() => handleDeactivateField(field.id)} className="bg-darklavender text-mist rounded-lg px-3 py-1 text-sm font-medium hover:opacity-90">
            Deactivate
          </button>
        </div>
      ))}
    </div>
  </div>

  {/* Account settings */}
  <div className="bg-mint rounded-2xl shadow-lg p-6 flex flex-col items-center mb-4 w-full max-w-sm">
    <p className="text-plum font-medium mb-6">Account settings</p>
    <input type="text" placeholder="New username" value={username} onChange={(e) => setUsername(e.target.value)}
      className="bg-mist border border-steel rounded-lg p-2 text-plum outline-none focus:ring-2 focus:ring-teal w-full mb-4" />
    <button onClick={handleUpdateUsername} className="bg-plum text-lavender rounded-lg px-6 py-2 font-semibold hover:opacity-90 transition-opacity w-full mb-4">
      Update username
    </button>
    <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}
      className="bg-mist border border-steel rounded-lg p-2 text-plum outline-none focus:ring-2 focus:ring-teal w-full mb-4" />
    <input
      type="password"
      placeholder="New password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      className="bg-mist border border-steel rounded-lg p-2 text-plum outline-none focus:ring-2 focus:ring-teal w-full mb-4"
    />
    <input
      type="password"
      placeholder="Confirm new password"
      value={newPasswordConfirm}
      onChange={(e) => setNewPasswordConfirm(e.target.value)}
      className="bg-mist border border-steel rounded-lg p-2 text-plum outline-none focus:ring-2 focus:ring-teal w-full mb-4"
    />
    <button onClick={handlePasswordChange} className="bg-plum text-lavender rounded-lg px-6 py-2 font-semibold hover:opacity-90 transition-opacity w-full mb-4">
      Change password
    </button>
    <button onClick={handleDeleteAccount} className="bg-red text-lavender rounded-lg px-6 py-2 font-semibold hover:opacity-90 transition-opacity w-full">
      Delete account
    </button>
  </div>
  </div>)
}