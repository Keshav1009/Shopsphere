import React, { useState } from 'react';
import {
  X,
  User,
  Code2,
  Globe,
  Plus,
  Trash2,
  CheckCircle2,
  Building,
  Save,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [region, setRegion] = useState(user?.region || 'Global');
  const [role, setRole] = useState(user?.role || 'customer');
  const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolio_url || '');
  const [techStack, setTechStack] = useState(user?.tech_stack || []);
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen || !user) return null;

  const handleAddSkill = () => {
    if (newSkill.trim() && !techStack.includes(newSkill.trim())) {
      setTechStack([...techStack, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setTechStack(techStack.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser({
        name,
        bio,
        region,
        role,
        portfolio_url: portfolioUrl,
        tech_stack: techStack
      });
      alert('Developer Profile updated successfully!');
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col border border-slate-200 animate-fade-in max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-mnb-600" />
            <h3 className="text-base font-bold text-slate-900">Developer Profile & Tech Portfolio</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg outline-none focus:border-mnb-500 text-xs font-semibold"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Email Address</label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Platform Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg outline-none focus:border-mnb-500 text-xs font-semibold"
              >
                <option value="customer">Customer / Evaluator</option>
                <option value="vendor">Vendor / Hardware Specialist</option>
                <option value="admin">Admin / System Architect</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg outline-none focus:border-mnb-500 text-xs font-semibold"
              >
                <option value="Global">Global</option>
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Professional Bio</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Full-Stack Developer Intern at MNB Soft Solutions Pvt. Ltd..."
              className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-mnb-500 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Portfolio / GitHub Link</label>
            <input
              type="url"
              placeholder="https://github.com/your-username"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-mnb-500 text-xs font-mono"
            />
          </div>

          {/* Interactive Developer Tech-Stack Tag Manager */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
            <p className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-mnb-600" />
              Developer Tech-Stack & Skills
            </p>
            <p className="text-[11px] text-slate-500">
              Showcase your technical proficiencies to collaborators and storefront partners.
            </p>

            {/* Existing Skills Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {techStack.map((skill) => (
                <span
                  key={skill}
                  className="bg-white text-slate-800 border border-slate-300 text-xs font-mono font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-rose-600 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Add New Skill Input */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add technology (e.g., React, Express, SQLite, AWS)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex-1 p-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-mnb-500 text-xs"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
              >
                Add Skill
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-mnb-600 hover:bg-mnb-700 text-white font-bold rounded-xl shadow flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
