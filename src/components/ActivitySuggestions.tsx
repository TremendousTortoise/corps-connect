
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Calendar } from "lucide-react";
import { ActivitySuggestion, Visit, User } from "@/types";

interface ActivitySuggestionsProps {
  currentUser: User;
  visits: Visit[];
  suggestions: ActivitySuggestion[];
  onAddSuggestion: (suggestion: Omit<ActivitySuggestion, 'id' | 'createdAt'>) => void;
}

const ActivitySuggestions = ({ currentUser, visits, suggestions, onAddSuggestion }: ActivitySuggestionsProps) => {
  const [showForm, setShowForm] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [suggestedDate, setSuggestedDate] = useState('');

  const activeVisits = visits.filter(v => v.status === 'current' || v.status === 'planned');

  const handleSubmit = (visitId: string) => {
    if (!title.trim() || !description.trim()) return;

    onAddSuggestion({
      userId: currentUser.id,
      userName: currentUser.name,
      visitId,
      title: title.trim(),
      description: description.trim(),
      suggestedDate: suggestedDate ? new Date(suggestedDate) : undefined
    });

    setTitle('');
    setDescription('');
    setSuggestedDate('');
    setShowForm(null);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (activeVisits.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No active visits to suggest activities for</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {activeVisits.map((visit) => {
        const visitSuggestions = suggestions.filter(s => s.visitId === visit.id);
        
        return (
          <Card key={visit.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-500 text-white text-sm">
                      {getInitials(visit.userName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-lg">{visit.userName}'s visit</div>
                    <div className="text-sm text-gray-600">
                      {visit.status === 'current' ? 'Currently in town' : 
                       `${visit.startDate.toLocaleDateString()}${visit.endDate ? ` - ${visit.endDate.toLocaleDateString()}` : ''}`}
                    </div>
                  </div>
                </div>
                {showForm !== visit.id && (
                  <Button 
                    size="sm" 
                    onClick={() => setShowForm(visit.id)}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Suggest Activity
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {showForm === visit.id && (
                <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                  <div className="space-y-3">
                    <div>
                      <Input
                        placeholder="Activity title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Description and details"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Input
                        type="date"
                        value={suggestedDate}
                        onChange={(e) => setSuggestedDate(e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleSubmit(visit.id)}
                        disabled={!title.trim() || !description.trim()}
                        size="sm"
                      >
                        Add Suggestion
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowForm(null)}
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {visitSuggestions.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Activity Suggestions:</h4>
                  {visitSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="bg-gray-50 p-3 rounded border">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-purple-500 text-white text-xs">
                            {getInitials(suggestion.userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">{suggestion.title}</div>
                          <div className="text-sm text-gray-600">{suggestion.description}</div>
                          {suggestion.suggestedDate && (
                            <div className="text-xs text-gray-500 mt-1">
                              Suggested for: {suggestion.suggestedDate.toLocaleDateString()}
                            </div>
                          )}
                          <div className="text-xs text-gray-400 mt-1">
                            Suggested by {suggestion.userName}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No activity suggestions yet
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ActivitySuggestions;
