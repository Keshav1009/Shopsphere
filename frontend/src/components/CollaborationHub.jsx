import React, { useState, useEffect } from 'react';
import {
  Code2,
  Plus,
  MessageSquare,
  Send,
  User,
  Filter,
  CheckCircle,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CollaborationHub() {
  const { user, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [skillFilter, setSkillFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New project form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTechInput, setNewTechInput] = useState('React, Node.js, Tailwind CSS');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [statusFilter, skillFilter]);

  const fetchProjects = async () => {
    try {
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (skillFilter.trim()) params.skill = skillFilter.trim();
      const res = await api.getProjects(params);
      if (res?.success) {
        setProjects(res.projects);
        if (res.projects.length > 0 && !selectedProject) {
          selectProject(res.projects[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectProject = async (proj) => {
    setSelectedProject(proj);
    try {
      const res = await api.getMessages(proj.id);
      if (res?.success) {
        setMessages(res.messages);
      }
    } catch (err) {
      console.error('Failed to load project messages:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedProject || !isAuthenticated) return;
    try {
      const res = await api.sendMessage({
        reference_id: selectedProject.id,
        receiver_id: selectedProject.creator_id,
        message_text: newMessage.trim()
      });
      if (res?.success) {
        setMessages((prev) => [...prev, res.data]);
        setNewMessage('');
      }
    } catch (err) {
      alert(err.message || 'Failed to send message');
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    setCreating(true);
    try {
      const techArray = newTechInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await api.createProject({
        title: newTitle.trim(),
        description: newDesc.trim(),
        required_technologies: techArray,
        status: 'Open'
      });

      if (res?.success) {
        setShowCreateModal(false);
        setNewTitle('');
        setNewDesc('');
        fetchProjects();
        selectProject(res.project);
        alert('Collaborative initiative posted successfully!');
      }
    } catch (err) {
      alert(err.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Code2 className="w-6 h-6 text-mnb-600" />
            Developer Collaboration Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Bridge e-commerce storefront management with peer developer collaboration, custom hardware requests, and open tasks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-mnb-600 hover:bg-mnb-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Post Initiative
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
        <span className="font-bold text-slate-700 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-slate-400" /> Status:
        </span>
        {['All', 'Open', 'In Progress', 'Completed'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              statusFilter === st
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {st}
          </button>
        ))}

        <div className="ml-auto w-full sm:w-auto mt-2 sm:mt-0">
          <input
            type="text"
            placeholder="Filter by skill (e.g., Python, React)..."
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-mnb-500"
          />
        </div>
      </div>

      {/* Main Grid: Projects List (Left) & Active Thread (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Projects List */}
        <div className="lg:col-span-5 space-y-3">
          {loading ? (
            <div className="text-center py-10 text-slate-400 text-xs">Loading initiatives...</div>
          ) : projects.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              No open initiatives found matching filters.
            </div>
          ) : (
            projects.map((proj) => {
              const isSelected = selectedProject?.id === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => selectProject(proj)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-mnb-600 shadow-md ring-1 ring-mnb-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        proj.status === 'Open'
                          ? 'bg-emerald-100 text-emerald-700'
                          : proj.status === 'In Progress'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {proj.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(proj.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">{proj.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {proj.description}
                  </p>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1">
                    {(proj.required_technologies || []).slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="bg-slate-100 text-slate-700 text-[10px] font-mono px-2 py-0.5 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {(proj.required_technologies || []).length > 4 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{(proj.required_technologies || []).length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Active Thread & Initiative Details */}
        <div className="lg:col-span-7">
          {selectedProject ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[650px]">
              {/* Project Meta Bar */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/60">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-mnb-600 uppercase tracking-wider">
                      Initiative Details
                    </span>
                    <h2 className="text-lg font-black text-slate-900 mt-0.5 leading-snug">
                      {selectedProject.title}
                    </h2>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase ${
                      selectedProject.status === 'Open'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {selectedProject.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-2.5">
                  {selectedProject.description}
                </p>

                {/* Tech tags & Creator */}
                <div className="mt-3 pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-500">Target Tech:</span>
                    {(selectedProject.required_technologies || []).map((t) => (
                      <span
                        key={t}
                        className="bg-mnb-50 text-mnb-700 border border-mnb-200 text-[10px] font-mono px-2 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <span className="text-slate-500 text-[11px]">
                    Created by: <strong className="text-slate-800">{selectedProject.creator_name}</strong>
                  </span>
                </div>
              </div>

              {/* Discussion Thread Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50/30">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Peer Discussion & Contributor Chat ({messages.length})
                </p>

                {messages.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 text-xs">
                    No contributions or discussion yet. Be the first to express interest or offer technical advice!
                  </div>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-mnb-600" />
                          {m.sender_name}
                          <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-1.5 py-0.5 rounded uppercase">
                            {m.sender_role}
                          </span>
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{m.message_text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input Box */}
              <div className="p-4 bg-white border-t border-slate-200">
                {isAuthenticated ? (
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Comment on architecture, propose pull request, or volunteer to build..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-mnb-500"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="bg-mnb-600 hover:bg-mnb-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition-colors disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post</span>
                    </button>
                  </form>
                ) : (
                  <p className="text-xs text-slate-500 text-center italic">
                    Please sign in to participate in the collaborative discussion thread.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center text-slate-400 text-xs">
              Select an initiative to view full specs and contributor discussions.
            </div>
          )}
        </div>
      </div>

      {/* Post Initiative Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fade-in">
            <h3 className="text-base font-bold text-slate-900">Post New Storefront Feature Initiative</h3>
            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Initiative Title</label>
                <input
                  type="text"
                  placeholder="e.g., Redis Caching for Product Catalog APIs"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 border rounded-lg outline-none focus:border-mnb-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Specification & Problem Statement</label>
                <textarea
                  rows={4}
                  placeholder="Describe the architectural requirements, expected deliverables, and integration points..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 border rounded-lg outline-none focus:border-mnb-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Required Technologies (Comma-Separated)
                </label>
                <input
                  type="text"
                  placeholder="React, Node.js, Express, Docker"
                  value={newTechInput}
                  onChange={(e) => setNewTechInput(e.target.value)}
                  className="w-full p-2.5 border rounded-lg outline-none focus:border-mnb-500"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-mnb-600 hover:bg-mnb-700 text-white font-bold rounded-lg shadow"
                >
                  {creating ? 'Publishing...' : 'Publish Initiative'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
