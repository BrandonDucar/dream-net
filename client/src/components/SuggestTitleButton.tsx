import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SuggestTitleButtonProps {
  onTitleSuggested: (title: string) => void;
  description: string;
  tags: string[];
  remix?: boolean;
  fusion?: boolean;
  style?: 'inline' | 'button';
  disabled?: boolean;
}

export default function SuggestTitleButton({
  onTitleSuggested,
  description,
  tags,
  remix = false,
  fusion = false,
  style = 'inline',
  disabled = false
}: SuggestTitleButtonProps) {
  const [generatingTitle, setGeneratingTitle] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSaveDraft = async () => {
    // Example implementation following user pattern
    console.log('Draft save functionality - implement with your dream state');
    // setSaving(true);
    // const res = await fetch('/api/save-dream', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ ...dream, isDraft: true })
    // });
    // const data = await res.json();
    // setSaving(false);
    // if (data.success) {
    //   router.push(`/vault`);
    // } else {
    //   alert('❌ Save failed');
    // }
  };

  const handleAutoName = async () => {
    if (!description || !tags.length) {
      alert('Please add a description and tags first');
      return;
    }

    setGeneratingTitle(true);
    try {
      const response = await fetch('/api/dream-titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tags,
          description,
          remix,
          fusion
        })
      });

      const data = await response.json();
      
      if (data.titleSuggestions && data.titleSuggestions.length > 0) {
        setSuggestions(data.titleSuggestions);
        setShowSuggestions(true);
        // Auto-select first suggestion for inline style
        if (style === 'inline') {
          onTitleSuggested(data.titleSuggestions[0]);
        }
      } else {
        // Fallback suggestions like your examples
        const fallbackSuggestions = [
          "Neural Bloom",
          "The Lucid Key", 
          "Fractal Thread"
        ];
        setSuggestions(fallbackSuggestions);
        setShowSuggestions(true);
        if (style === 'inline') {
          onTitleSuggested(fallbackSuggestions[0]);
        }
      }
    } catch (error) {
      console.error('Title generation error:', error);
      alert('Failed to generate title');
    } finally {
      setGeneratingTitle(false);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    onTitleSuggested(suggestion);
    setShowSuggestions(false);
  };

  if (style === 'inline') {
    return (
      <div>
        <button
          onClick={handleAutoName}
          disabled={generatingTitle || disabled}
          style={{ background: '#888', color: '#fff', padding: 8, marginBottom: 10 }}
        >
          {generatingTitle ? '🔄 Generating...' : '🎲 Suggest Title'}
        </button>
        
        {showSuggestions && suggestions.length > 0 && (
          <Card className="mb-4 border-gray-600">
            <CardContent className="p-3">
              <div className="text-sm font-medium mb-2">Choose a title:</div>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="block w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-700 border border-gray-600"
                    style={{ background: '#333', color: '#fff' }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-600">
                <button
                  onClick={handleSaveDraft}
                  style={{ background: '#ffa500', color: '#000', padding: 10, marginLeft: 10 }}
                >
                  📦 Save as Draft
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleAutoName}
        disabled={generatingTitle || disabled}
        className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm disabled:opacity-50"
      >
        {generatingTitle ? '🔄' : '🎲'}
      </button>
      
      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 mt-1 z-10 w-64 border-gray-600">
          <CardContent className="p-2">
            <div className="text-xs font-medium mb-2">Choose a title:</div>
            <div className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs h-8"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}