
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Visit, User } from "@/types";

interface VisitPlannerProps {
  currentUser: User;
  visits: Visit[];
  onAddVisit: (visit: Omit<Visit, 'id'>) => void;
  onUpdateVisit: (visitId: string, status: 'current' | 'planned') => void;
}

const VisitPlanner = ({ currentUser, visits, onAddVisit, onUpdateVisit }: VisitPlannerProps) => {
  const [showPlanner, setShowPlanner] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');

  const userVisits = visits.filter(v => v.userId === currentUser.id);
  const currentVisit = userVisits.find(v => v.status === 'current');

  const handleMarkInTown = () => {
    if (currentVisit) {
      onUpdateVisit(currentVisit.id, 'planned');
    } else {
      onAddVisit({
        userId: currentUser.id,
        userName: currentUser.name,
        startDate: new Date(),
        status: 'current',
        notes: 'Currently in town!'
      });
    }
  };

  const handlePlanVisit = () => {
    if (!startDate) return;

    onAddVisit({
      userId: currentUser.id,
      userName: currentUser.name,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      status: 'planned',
      notes: notes.trim() || undefined
    });

    setStartDate('');
    setEndDate('');
    setNotes('');
    setShowPlanner(false);
  };

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <MapPin className="h-6 w-6" />
          Your Visits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentVisit ? (
          <div className="text-center">
            <Badge className="bg-green-500 text-white text-lg px-4 py-2">
              Currently in town!
            </Badge>
            <Button 
              onClick={handleMarkInTown}
              variant="outline"
              className="mt-2 block mx-auto border-green-600 text-green-600"
            >
              Mark as left town
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleMarkInTown}
            size="lg"
            className="w-full bg-green-500 hover:bg-green-600 text-white text-lg py-6"
          >
            I'm in town now!
          </Button>
        )}

        <div className="border-t pt-4">
          {!showPlanner ? (
            <Button 
              onClick={() => setShowPlanner(true)}
              variant="outline"
              className="w-full border-blue-500 text-blue-500"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Plan a visit
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <Input
                  placeholder="Any details about your visit..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handlePlanVisit} disabled={!startDate}>
                  Plan Visit
                </Button>
                <Button variant="outline" onClick={() => setShowPlanner(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {userVisits.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-700 mb-2">Your planned visits:</h4>
            <div className="space-y-2">
              {userVisits.filter(v => v.status === 'planned').map((visit) => (
                <div key={visit.id} className="bg-white p-3 rounded border flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {visit.startDate.toLocaleDateString()}
                      {visit.endDate && ` - ${visit.endDate.toLocaleDateString()}`}
                    </div>
                    {visit.notes && (
                      <div className="text-sm text-gray-600">{visit.notes}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VisitPlanner;
