// components/UserDetailsTooltip.tsx
'use client';
import { useState } from 'react';

interface Props {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    credits: number;
  };
  onClose: () => void;
  onSave: (updatedUser: any) => void;
}

export default function UserDetailsTooltip({ user, onClose, onSave }: Props) {
  const [role, setRole] = useState(user.role);
  const [credits, setCredits] = useState(user.credits || 0);

  return (
    <div className="absolute z-50 bg-white shadow-xl rounded-lg p-4 border border-gray-200 w-64">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">Edit {user.name}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-600">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600">Credits</label>
          <input
            type="number"
            value={credits}
            onChange={(e) => setCredits(parseInt(e.target.value))}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <button
          onClick={() => onSave({ ...user, role, credits })}
          className="w-full bg-indigo-600 text-white py-1 rounded hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
