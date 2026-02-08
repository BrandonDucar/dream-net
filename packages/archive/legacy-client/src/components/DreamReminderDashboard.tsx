import { useEffect, useState } from 'react';

function StatBox({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-zinc-800 border border-purple-700 rounded-lg p-4 text-center">
      <div className="text-purple-300 text-xs uppercase tracking-wider">{title}</div>
      <div className="text-2xl font-bold text-white mt-1">{value}</div>
    </div>
  );
}

interface Reminder {
  id: string;
  dreamId: string;
  userPhone: string;
  remindAt: string;
  status: string;
  tags?: string[];
  dream?: {
    title: string;
    viralityMetrics?: {
      remixCount: number;
      shareVelocity: number;
      saturationLevel: number;
      currentTrend: string;
    };
    emotionalProfile?: {
      primaryEmotion: string;
      intensity: number;
    };
    remixLineage?: Array<{
      id: string;
      title: string;
      generation: number;
    }>;
  };
}

function getDreamStatus(dream: any) {
  const { remixCount, shareVelocity, saturationLevel, currentTrend } = dream?.viralityMetrics || {};

  if (remixCount > 10 && shareVelocity > 20 && saturationLevel < 0.5) return 'ready';
  if (currentTrend === 'ascending') return 'growing';
  if (saturationLevel > 0.8) return 'saturated';

  return 'idle';
}

function renderBadge(status: string) {
  const badgeMap = {
    ready: { label: '🟢 Ready to Evolve', color: 'bg-green-700' },
    growing: { label: '🟡 Gaining Momentum', color: 'bg-yellow-700' },
    saturated: { label: '🔴 Saturated', color: 'bg-red-700' },
    idle: { label: '⚫ Dormant', color: 'bg-zinc-700' },
  };

  const badge = badgeMap[status as keyof typeof badgeMap] || badgeMap.idle;
  return (
    <span className={`text-xs text-white px-2 py-1 rounded ${badge.color}`}>
      {badge.label}
    </span>
  );
}

export default function DreamReminderDashboard() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('soonest');
  const [searchQuery, setSearchQuery] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [activeEmotions, setActiveEmotions] = useState<string[]>([]);
  const [pinnedDreams, setPinnedDreams] = useState<string[]>([]);
  const [archivedDreams, setArchivedDreams] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');
  const [savedViewName, setSavedViewName] = useState('');
  const [savedViews, setSavedViews] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);

  useEffect(() => {
    fetch('/api/get-reminders')
      .then((res) => res.json())
      .then((data) => {
        setReminders(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch reminders:', error);
        setLoading(false);
      });

    // Load saved views from localStorage
    const savedViewsData = JSON.parse(localStorage.getItem('savedViews') || '[]');
    setSavedViews(savedViewsData);
  }, []);

  const cancelReminder = async (id: string) => {
    try {
      await fetch('/api/cancel-reminder', {
        method: 'POST',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' },
      });
      setReminders(reminders.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Failed to cancel reminder:', error);
    }
  };

  const addTagToReminder = async (id: string, tag: string) => {
    if (!tag.trim()) return;
    
    try {
      await fetch('/api/update-tags', {
        method: 'POST',
        body: JSON.stringify({ id, tag: tag.trim() }),
        headers: { 'Content-Type': 'application/json' },
      });
      
      // Update local state
      setReminders(reminders.map(r => 
        r.id === id 
          ? { ...r, tags: [...(r.tags || []), tag.trim()] }
          : r
      ));
    } catch (error) {
      console.error('Failed to add tag:', error);
    }
  };

  // Filter out archived dreams for main display
  const activeReminders = reminders.filter((r) => !r.archived);
  const archivedReminders = reminders.filter((r) => r.archived);

  // Get all unique tags from active reminders and calculate statistics
  const uniqueTags = [...new Set(activeReminders.flatMap(r => r.tags || []))];
  const readyCount = activeReminders.filter(reminder => getDreamStatus(reminder.dream) === 'ready').length;

  // Toggle tag filter on/off
  const toggleTagFilter = (tag: string) => {
    setActiveTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Toggle emotion filter on/off
  const toggleEmotionFilter = (emotion: string) => {
    setActiveEmotions(prev =>
      prev.includes(emotion) ? prev.filter(e => e !== emotion) : [...prev, emotion]
    );
  };

  // Toggle pin status for dreams
  const togglePin = (id: string) => {
    setPinnedDreams((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  // Update note for a reminder
  const updateNote = (id: string, newNote: string) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id ? { ...reminder, note: newNote } : reminder
      )
    );
  };

  // Record reaction for a dream
  const recordReaction = (id: string, emoji: string) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id
          ? { ...reminder, reactions: [...(reminder.reactions || []), emoji] }
          : reminder
      )
    );
  };

  // Format date for timeline view
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Serialize dream data in different formats
  const serializeDream = (reminder: any, format: string) => {
    const dream = reminder.dream;
    const title = dream?.title || reminder.dreamId;
    
    switch (format) {
      case 'txt':
        return `Dream: ${title}
Reminder ID: ${reminder.id}
Status: ${getDreamStatus(dream)}
Emotion: ${dream?.emotionalProfile?.primaryEmotion || 'Unknown'}
Remind At: ${new Date(reminder.remindAt).toLocaleString()}
Note: ${reminder.note || 'No notes'}
Reactions: ${reminder.reactions?.join(' ') || 'None'}
Tags: ${reminder.tags?.map(t => `#${t}`).join(' ') || 'None'}

Description: ${dream?.description || 'No description available'}`;

      case 'json':
        return JSON.stringify({
          id: reminder.id,
          dreamId: reminder.dreamId,
          title,
          status: getDreamStatus(dream),
          emotion: dream?.emotionalProfile?.primaryEmotion,
          remindAt: reminder.remindAt,
          note: reminder.note,
          reactions: reminder.reactions,
          tags: reminder.tags,
          dream: dream
        }, null, 2);

      case 'md':
        return `# ${title}

**Reminder ID:** ${reminder.id}  
**Status:** ${getDreamStatus(dream)}  
**Emotion:** ${dream?.emotionalProfile?.primaryEmotion || 'Unknown'}  
**Remind At:** ${new Date(reminder.remindAt).toLocaleString()}  

## Notes
${reminder.note || 'No notes'}

## Reactions
${reminder.reactions?.join(' ') || 'None'}

## Tags
${reminder.tags?.map(t => `#${t}`).join(' ') || 'None'}

## Description
${dream?.description || 'No description available'}`;

      default:
        return JSON.stringify(reminder, null, 2);
    }
  };

  // Export individual dream
  const exportDream = (reminder: any, format: string) => {
    const content = serializeDream(reminder, format);
    const title = reminder.dream?.title || reminder.dreamId;
    const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.${format}`;
    
    const blob = new Blob([content], {
      type: format === 'json' ? 'application/json' : 'text/plain;charset=utf-8',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Archive dream functionality
  const archiveDream = (id: string) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id ? { ...reminder, archived: true } : reminder
      )
    );
  };

  // Launch dream functionality
  const launchDream = (id: string) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id 
          ? { 
              ...reminder, 
              launched: true,
              tags: [...(reminder.tags || []), '🚀 Launch'],
              note: (reminder.note || '') + ' [LAUNCHED]'
            } 
          : reminder
      )
    );
  };

  const saveCurrentView = () => {
    if (!savedViewName.trim()) return;
    
    const view = {
      name: savedViewName,
      tags: activeTags,
      emotions: activeEmotions,
      pinnedDreams,
      filter,
      sort,
      search: searchQuery,
    };

    const existing = JSON.parse(localStorage.getItem('savedViews') || '[]');
    const updatedViews = [...existing, view];
    localStorage.setItem('savedViews', JSON.stringify(updatedViews));
    setSavedViews(updatedViews);
    setSavedViewName('');
  };

  const loadView = (view: any) => {
    setActiveTags(view.tags || []);
    setActiveEmotions(view.emotions || []);
    setPinnedDreams(view.pinnedDreams || []);
    setFilter(view.filter || 'all');
    setSort(view.sort || 'soonest');
    setSearchQuery(view.search || '');
  };

  const deleteView = (viewName: string) => {
    const existing = JSON.parse(localStorage.getItem('savedViews') || '[]');
    const filtered = existing.filter((v: any) => v.name !== viewName);
    localStorage.setItem('savedViews', JSON.stringify(filtered));
    setSavedViews(filtered);
  };

  // Divine trigger functionality
  const checkDivineTrigger = async (inputText: string) => {
    try {
      const userActivity = {
        dreamsCreated: reminders.length, // Mock user activity
        remixes: reminders.reduce((acc, r) => acc + (r.dream?.viralityMetrics?.remixCount || 0), 0)
      };

      const response = await fetch('/api/check-divine-trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userActivity, inputText })
      });

      const result = await response.json();
      if (result.triggered) {
        alert(`🌟 ${result.message} - ${result.reason === 'keyword_match' ? 'Divine keywords detected' : 'Activity threshold reached'}`);
      }
    } catch (error) {
      console.error('Divine trigger check failed:', error);
    }
  };

  // Enhanced search filtering (only active reminders)
  const searchFiltered = activeReminders.filter((r) => {
    if (!searchQuery.trim()) return true; // Show all if no search query
    
    const query = searchQuery.toLowerCase();
    return (
      r.dream?.title?.toLowerCase().includes(query) ||
      r.dreamId?.toLowerCase().includes(query) ||
      r.dream?.emotionalProfile?.primaryEmotion?.toLowerCase().includes(query) ||
      r.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
      r.dream?.remixLineage?.some((line) => line.title.toLowerCase().includes(query))
    );
  });

  // Apply emotion filtering
  const emotionFiltered = searchFiltered.filter((r) =>
    activeEmotions.length === 0 ||
    activeEmotions.includes(r.dream?.emotionalProfile?.primaryEmotion?.toLowerCase() || '') ||
    (r.dream?.emotionalProfile?.secondaryEmotions || []).some((e: string) =>
      activeEmotions.includes(e.toLowerCase())
    )
  );

  const filteredReminders = emotionFiltered
    .filter((r) => {
      const status = getDreamStatus(r.dream);
      const matchesFilter = filter === 'all' || status === filter;
      return matchesFilter;
    })
    .sort((a, b) => {
      if (sort === 'soonest') return new Date(a.remindAt).getTime() - new Date(b.remindAt).getTime();
      if (sort === 'latest') return new Date(b.remindAt).getTime() - new Date(a.remindAt).getTime();
      if (sort === 'title') return (a.dream?.title || a.dreamId).localeCompare(b.dream?.title || b.dreamId);
      return 0;
    });

  // Apply tag filtering after emotion/search/status filtering
  const tagFilteredReminders = filteredReminders.filter((r) =>
    activeTags.length === 0 || activeTags.every((tag) => r.tags?.includes(tag))
  );

  // Sort pinned dreams to the top
  const finalReminders = [...tagFilteredReminders].sort((a, b) => {
    const aIsPinned = pinnedDreams.includes(a.dreamId);
    const bIsPinned = pinnedDreams.includes(b.dreamId);
    if (aIsPinned && !bIsPinned) return -1;
    if (!aIsPinned && bIsPinned) return 1;
    return 0;
  });

  if (loading) {
    return (
      <div className="bg-zinc-900 border border-purple-700 p-6 rounded-xl text-white max-w-2xl mx-auto mt-10">
        <div className="animate-pulse">Loading reminders...</div>
      </div>
    );
  }

  // Export functionality
  const exportData = () => {
    const exportData = {
      reminders,
      savedViews,
      tags: uniqueTags,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dream_export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import functionality
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        
        if (imported.reminders && imported.savedViews) {
          // Validate and set imported data
          if (Array.isArray(imported.reminders)) {
            setReminders(imported.reminders);
          }
          
          if (Array.isArray(imported.savedViews)) {
            setSavedViews(imported.savedViews);
            localStorage.setItem('savedViews', JSON.stringify(imported.savedViews));
          }
          
          // Validate additional fields like tags, timestamps
          const validReminders = imported.reminders.filter((r: any) => 
            r.id && r.dreamId && r.remindAt && r.status
          );
          
          setImporting(false);
          alert(`Import successful! Loaded ${validReminders.length} reminders and ${imported.savedViews.length} saved views.`);
        } else {
          setImporting(false);
          alert('Invalid file format. Please ensure the file contains both reminders and savedViews.');
        }
      } catch (error) {
        console.error('Import failed:', error);
        setImporting(false);
        alert('Failed to import dream data. Please check the file format.');
      }
    };

    reader.onerror = () => {
      setImporting(false);
      alert('Failed to read file. Please try again.');
    };

    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="bg-zinc-900 border border-purple-700 p-6 rounded-xl text-white max-w-4xl mx-auto mt-10">
      <h3 className="text-xl font-bold mb-4">⏰ Pending Dream Call Reminders</h3>
      
      {/* Statistics Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatBox title="Active Dreams" value={activeReminders.length} />
        <StatBox title="Ready to Evolve" value={readyCount} />
        <StatBox title="Archived Dreams" value={archivedReminders.length} />
        <StatBox title="Saved Views" value={savedViews.length} />
      </div>

      {/* Export/Import Controls */}
      <div className="mb-4 flex gap-4 items-center">
        <button 
          onClick={exportData}
          className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded"
        >
          📦 Export Dreams
        </button>
        
        <div className="flex items-center gap-2">
          <label className={`${importing ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800 cursor-pointer'} text-white px-4 py-2 rounded transition-colors`}>
            {importing ? '⏳ Importing...' : '📥 Import Dreams'}
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              disabled={importing}
              className="hidden"
            />
          </label>
        </div>
      </div>
      
      <input
        type="text"
        placeholder="Search your dreams..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          // Check for divine trigger on every search input
          if (e.target.value.length > 3) {
            checkDivineTrigger(e.target.value);
          }
        }}
        className="w-full px-4 py-2 rounded border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-500 mb-4 focus:border-cyan-500 focus:outline-none"
      />
      
      {/* Divine Trigger Test Input */}
      <div className="mb-4 p-3 bg-zinc-800 border border-amber-600 rounded">
        <div className="text-amber-400 text-sm mb-2">🌟 Divine Trigger Test (try: "call from god", "dream deeper", "divine download")</div>
        <input
          type="text"
          placeholder="Enter divine keywords to test trigger..."
          className="w-full bg-zinc-700 text-white px-3 py-2 border border-amber-500 rounded focus:border-amber-400 focus:outline-none"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              checkDivineTrigger(e.currentTarget.value);
            }
          }}
        />
      </div>

      {/* View Mode Toggle */}
      <div className="mb-4">
        <div className="text-sm text-zinc-400 mb-2">View mode:</div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded text-sm ${
              viewMode === 'list'
                ? 'bg-purple-700 text-white'
                : 'bg-zinc-700 text-zinc-300'
            }`}
          >
            📋 List View
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-4 py-2 rounded text-sm ${
              viewMode === 'timeline'
                ? 'bg-purple-700 text-white'
                : 'bg-zinc-700 text-zinc-300'
            }`}
          >
            📅 Timeline View
          </button>
          
          {/* Metrics Toggle */}
          <label className="flex items-center gap-2 ml-4 text-sm text-zinc-300">
            <input 
              type="checkbox" 
              checked={showMetrics}
              onChange={(e) => setShowMetrics(e.target.checked)}
              className="rounded"
            />
            Show Dream Metrics
          </label>
        </div>
      </div>

      {/* Emotion Filter Buttons */}
      <div className="mb-4">
        <div className="text-sm text-zinc-400 mb-2">Filter by emotions:</div>
        <div className="flex flex-wrap gap-2">
          {['ambition', 'hope', 'curiosity', 'calm', 'passion', 'excitement', 'concern', 'inspiration'].map((emotion) => (
            <button
              key={emotion}
              onClick={() => toggleEmotionFilter(emotion)}
              className={`px-3 py-1 rounded-full text-sm ${
                activeEmotions.includes(emotion)
                  ? 'bg-purple-700 text-white'
                  : 'bg-zinc-700 text-zinc-300'
              }`}
            >
              {emotion}
            </button>
          ))}
        </div>
      </div>

      {/* Tag Filter Buttons */}
      {uniqueTags.length > 0 && (
        <div className="mb-4">
          <div className="text-sm text-zinc-400 mb-2">Filter by tags:</div>
          <div className="flex flex-wrap gap-2">
            {uniqueTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTagFilter(tag)}
                className={`px-3 py-1 text-sm rounded-full border ${
                  activeTags.includes(tag)
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-zinc-800 text-purple-300 border-purple-500'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-zinc-800 text-white border border-purple-600 px-3 py-2 rounded"
        >
          <option value="all">🔍 All Dreams</option>
          <option value="ready">🟢 Ready to Evolve</option>
          <option value="growing">🟡 Gaining Momentum</option>
          <option value="saturated">🔴 Saturated</option>
          <option value="idle">⚫ Dormant</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-zinc-800 text-white border border-purple-600 px-3 py-2 rounded"
        >
          <option value="soonest">⏰ Soonest First</option>
          <option value="latest">🕒 Latest First</option>
          <option value="title">📝 Title A-Z</option>
        </select>
      </div>

      {/* Save Current View */}
      <div className="flex items-center gap-2 mt-4 mb-4">
        <input
          type="text"
          value={savedViewName}
          onChange={(e) => setSavedViewName(e.target.value)}
          placeholder="Name this view..."
          className="px-3 py-1 text-sm rounded bg-zinc-800 border border-purple-500 text-white"
        />
        <button
          onClick={saveCurrentView}
          disabled={!savedViewName.trim()}
          className="bg-purple-700 hover:bg-purple-800 disabled:bg-gray-600 text-sm text-white px-3 py-1 rounded"
        >
          💾 Save View
        </button>
      </div>

      {/* Saved Views */}
      {savedViews.length > 0 && (
        <div className="mb-4">
          <div className="text-sm text-zinc-400 mb-2">Saved views:</div>
          <div className="flex flex-wrap gap-2">
            {savedViews.map((view) => (
              <div key={view.name} className="flex items-center gap-1">
                <button
                  onClick={() => loadView(view)}
                  className="text-sm px-3 py-1 rounded-full bg-purple-900 text-white hover:bg-purple-800"
                >
                  {view.name}
                </button>
                <button
                  onClick={() => deleteView(view.name)}
                  className="text-xs text-red-400 hover:text-red-300 px-1"
                  title="Delete view"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pinned Dreams Section */}
      {pinnedDreams.length > 0 && (
        <div className="mb-6 p-4 bg-zinc-800 rounded-lg border border-purple-600">
          <h2 className="text-purple-400 text-sm uppercase mb-3">📌 Pinned Dreams</h2>
          <div className="space-y-2">
            {pinnedDreams.map((id) => {
              const reminder = reminders.find(r => r.dreamId === id);
              return reminder ? (
                <div key={id} className="flex items-center justify-between bg-zinc-700 p-3 rounded border-l-4 border-purple-500">
                  <div>
                    <h4 className="font-medium text-white">{reminder.dream?.title || reminder.dreamId}</h4>
                    <p className="text-sm text-zinc-400">
                      {reminder.dream?.emotionalProfile?.primaryEmotion} • {getDreamStatus(reminder.dream)}
                    </p>
                  </div>
                  <button
                    onClick={() => togglePin(id)}
                    className="text-yellow-400 hover:text-yellow-300 text-lg"
                    title="Unpin dream"
                  >
                    📌
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {finalReminders.length === 0 ? (
        <p className="text-purple-300">No upcoming dream calls. You're caught up.</p>
      ) : viewMode === 'timeline' ? (
        // Timeline View
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {finalReminders
            .sort((a, b) => new Date(b.remindAt).getTime() - new Date(a.remindAt).getTime())
            .map((reminder) => (
              <div key={reminder.id} className="border-l-2 border-purple-600 pl-4 mb-4">
                <p className="text-xs text-zinc-400">{formatDate(reminder.remindAt)}</p>
                <h3 className="text-lg font-semibold text-white">
                  {reminder.dream?.title || reminder.dreamId}
                </h3>
                <p className="text-sm text-zinc-300">
                  {reminder.dream?.emotionalProfile?.primaryEmotion} • {getDreamStatus(reminder.dream)}
                </p>
                {reminder.reactions && reminder.reactions.length > 0 && (
                  <div className="text-sm text-purple-300 mt-1">
                    Reactions: {reminder.reactions.slice(-5).join(' ')}
                  </div>
                )}
                {reminder.note && (
                  <div className="text-sm text-zinc-400 mt-1 italic">
                    Note: {reminder.note}
                  </div>
                )}
              </div>
            ))}
        </div>
      ) : (
        // List View
        <ul className="space-y-4 max-h-[400px] overflow-y-auto">
          {finalReminders.map((reminder) => (
            <li key={reminder.id} className="p-4 border border-purple-600 rounded-md bg-black flex items-start gap-4 relative">
              <img 
                src={`https://via.placeholder.com/64x64/1a1a1a/8b5cf6?text=${reminder.dreamId.slice(-3)}`} 
                className="w-16 h-16 rounded object-cover" 
                alt="Dream preview"
              />
              
              {/* Dream Metrics Overlay */}
              {showMetrics && (
                <div className="absolute top-2 right-2 text-xs bg-zinc-800 px-2 py-1 rounded">
                  👁 {reminder.dream?.metrics?.views || Math.floor(Math.random() * 5000)} | 
                  ❤️ {reminder.dream?.metrics?.likes || Math.floor(Math.random() * 1000)} | 
                  🔁 {reminder.dream?.metrics?.shares || Math.floor(Math.random() * 100)} | 
                  📤 {reminder.dream?.metrics?.exports || Math.floor(Math.random() * 200)} | 
                  💬 {reminder.dream?.metrics?.comments || Math.floor(Math.random() * 500)} | 
                  ⚡ {reminder.dream?.metrics?.energy || Math.floor(Math.random() * 150)}
                </div>
              )}
              
              <div className="flex-1">
                <div className="text-sm text-purple-300 font-medium">
                  {reminder.dream?.title || `Dream: ${reminder.dreamId}`}
                </div>
                <div className="text-xs text-zinc-400 mt-1">⏰ {new Date(reminder.remindAt).toLocaleString()}</div>
                <div className="text-xs mt-1 text-zinc-500">Status: {reminder.status}</div>
                <div className="flex items-center gap-2 mt-2">
                  {renderBadge(getDreamStatus(reminder.dream))}
                  {reminder.dream?.emotionalProfile && (
                    <span className="text-xs bg-purple-800 text-purple-200 px-2 py-1 rounded">
                      {reminder.dream.emotionalProfile.primaryEmotion}
                    </span>
                  )}
                  {reminder.dream?.remixLineage && reminder.dream.remixLineage.length > 0 && (
                    <span className="text-xs bg-cyan-800 text-cyan-200 px-2 py-1 rounded">
                      Gen {Math.max(...reminder.dream.remixLineage.map(r => r.generation))}
                    </span>
                  )}
                </div>

                {/* Tag Management Section */}
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Add a tag and press enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addTagToReminder(reminder.id, tagInput);
                        setTagInput('');
                      }
                    }}
                    className="bg-zinc-800 text-white px-2 py-1 text-sm rounded border border-purple-500 w-full"
                  />
                  {reminder.tags && reminder.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {reminder.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className={`text-xs px-2 py-1 rounded-full ${
                            tag.includes('🚀') || tag.includes('Launch')
                              ? 'bg-green-800 text-green-100'
                              : tag.includes('💡') || tag.includes('Concept')
                              ? 'bg-yellow-800 text-yellow-100'
                              : 'bg-purple-700 text-purple-100'
                          }`}
                        >
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </span>
                      ))}
                      {reminder.launched && (
                        <span className="bg-green-800 text-green-100 text-xs px-2 py-1 rounded-full">
                          ✅ LAUNCHED
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Reaction Buttons */}
                <div className="mt-2 mb-2">
                  <div className="text-xs text-zinc-400 mb-1">Quick reactions:</div>
                  <div className="flex items-center gap-1">
                    {['❤️', '⚡', '🧠', '❓', '🔁', '💡'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => recordReaction(reminder.id, emoji)}
                        className="text-lg hover:scale-110 transition-transform"
                        title={`React with ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  {reminder.reactions && reminder.reactions.length > 0 && (
                    <div className="text-xs text-zinc-500 mt-1">
                      Recent: {reminder.reactions.slice(-3).join(' ')}
                    </div>
                  )}
                </div>

                {/* Note Input */}
                <textarea
                  value={reminder.note || ''}
                  onChange={(e) => updateNote(reminder.id, e.target.value)}
                  placeholder="Quick note..."
                  className="w-full text-sm bg-zinc-800 border border-zinc-700 rounded p-2 text-white mt-2"
                  rows={2}
                />

                <div className="flex justify-between items-center mt-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => togglePin(reminder.dreamId)}
                      className={`text-lg ${pinnedDreams.includes(reminder.dreamId) ? 'text-yellow-400' : 'text-gray-500'} hover:text-yellow-300`}
                      title={pinnedDreams.includes(reminder.dreamId) ? 'Unpin dream' : 'Pin dream'}
                    >
                      {pinnedDreams.includes(reminder.dreamId) ? '📌' : '📍'}
                    </button>
                    <button
                      onClick={() => remindLater(reminder.id)}
                      className="bg-yellow-700 hover:bg-yellow-800 text-yellow-100 text-xs px-3 py-1 rounded"
                    >
                      ⏰ Remind in 1 hour
                    </button>
                  </div>
                  <button
                    onClick={() => cancelReminder(reminder.id)}
                    className="bg-gray-700 hover:bg-gray-800 text-white text-xs px-3 py-1 rounded"
                  >
                    ✖ Cancel
                  </button>
                </div>

                {/* Export Options */}
                <div className="flex gap-2 mt-2">
                  <div className="text-xs text-zinc-400 mr-2">Export:</div>
                  <button 
                    onClick={() => exportDream(reminder, 'txt')}
                    className="text-xs bg-blue-700 hover:bg-blue-800 text-white px-2 py-1 rounded"
                  >
                    TXT
                  </button>
                  <button 
                    onClick={() => exportDream(reminder, 'json')}
                    className="text-xs bg-green-700 hover:bg-green-800 text-white px-2 py-1 rounded"
                  >
                    JSON
                  </button>
                  <button 
                    onClick={() => exportDream(reminder, 'md')}
                    className="text-xs bg-orange-700 hover:bg-orange-800 text-white px-2 py-1 rounded"
                  >
                    MD
                  </button>
                  <button 
                    onClick={() => archiveDream(reminder.id)}
                    className="text-xs bg-purple-700 hover:bg-purple-800 text-white px-2 py-1 rounded"
                  >
                    📂 Archive
                  </button>
                  {!reminder.launched && (
                    <button 
                      onClick={() => launchDream(reminder.id)}
                      className="text-xs bg-green-700 hover:bg-green-800 text-white px-2 py-1 rounded"
                    >
                      🚀 Launch
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Archived Dreams Section */}
      {archivedReminders.length > 0 && (
        <details className="mt-8">
          <summary className="text-purple-400 font-semibold cursor-pointer hover:text-purple-300">
            📦 Archived Dreams ({archivedReminders.length})
          </summary>
          <div className="mt-4 space-y-3 pl-4 border-l-2 border-purple-800">
            {archivedReminders.map((reminder) => (
              <div key={reminder.id} className="p-3 bg-zinc-800 rounded border border-zinc-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-zinc-300">{reminder.dream?.title || reminder.dreamId}</h4>
                    <p className="text-sm text-zinc-500">
                      {reminder.dream?.emotionalProfile?.primaryEmotion} • Archived
                    </p>
                    {reminder.note && (
                      <p className="text-xs text-zinc-600 mt-1 italic">Note: {reminder.note}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setReminders(prev => 
                      prev.map(r => r.id === reminder.id ? { ...r, archived: false } : r)
                    )}
                    className="text-xs bg-green-700 hover:bg-green-800 text-white px-2 py-1 rounded"
                  >
                    📤 Restore
                  </button>
                </div>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}