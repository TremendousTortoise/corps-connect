
import { useState, useEffect } from "react";
import { Users, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import UserRegistration from "@/components/UserRegistration";
import VisitPlanner from "@/components/VisitPlanner";
import ActivitySuggestions from "@/components/ActivitySuggestions";
import { User, Visit, ActivitySuggestion } from "@/types";

const Index = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [suggestions, setSuggestions] = useState<ActivitySuggestion[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedUsers = localStorage.getItem("friendUsers");
    const savedCurrentUser = localStorage.getItem("currentUser");
    const savedVisits = localStorage.getItem("friendVisits");
    const savedSuggestions = localStorage.getItem("activitySuggestions");
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    
    if (savedCurrentUser) {
      setCurrentUser(JSON.parse(savedCurrentUser));
    }

    if (savedVisits) {
      const parsedVisits = JSON.parse(savedVisits).map((visit: any) => ({
        ...visit,
        startDate: new Date(visit.startDate),
        endDate: visit.endDate ? new Date(visit.endDate) : undefined
      }));
      setVisits(parsedVisits);
    }

    if (savedSuggestions) {
      const parsedSuggestions = JSON.parse(savedSuggestions).map((suggestion: any) => ({
        ...suggestion,
        createdAt: new Date(suggestion.createdAt),
        suggestedDate: suggestion.suggestedDate ? new Date(suggestion.suggestedDate) : undefined
      }));
      setSuggestions(parsedSuggestions);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("friendUsers", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("friendVisits", JSON.stringify(visits));
  }, [visits]);

  useEffect(() => {
    localStorage.setItem("activitySuggestions", JSON.stringify(suggestions));
  }, [suggestions]);

  const handleRegister = (user: User) => {
    if (currentUser) {
      // Update existing user
      setUsers(prev => prev.map(u => u.id === user.id ? user : u));
      setCurrentUser(user);
      toast({
        title: "Profile Updated!",
        description: "Your profile has been updated successfully."
      });
    } else {
      // New user registration
      setUsers(prev => [...prev, user]);
      setCurrentUser(user);
      toast({
        title: "Welcome!",
        description: `Account created for ${user.name}!`
      });
    }
    setIsRegistering(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    toast({
      title: "Logged Out",
      description: "You've been logged out successfully."
    });
  };

  const handleAddVisit = (visitData: Omit<Visit, 'id'>) => {
    const newVisit: Visit = {
      ...visitData,
      id: Date.now().toString()
    };
    setVisits(prev => [...prev, newVisit]);
    
    toast({
      title: visitData.status === 'current' ? "Marked as in town!" : "Visit planned!",
      description: visitData.status === 'current' ? 
        "Your friends will see you're currently in town." :
        "Your visit has been added to the schedule."
    });
  };

  const handleUpdateVisit = (visitId: string, status: 'current' | 'planned') => {
    setVisits(prev => prev.map(visit => 
      visit.id === visitId ? { ...visit, status } : visit
    ));
  };

  const handleAddSuggestion = (suggestionData: Omit<ActivitySuggestion, 'id' | 'createdAt'>) => {
    const newSuggestion: ActivitySuggestion = {
      ...suggestionData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setSuggestions(prev => [...prev, newSuggestion]);
    
    toast({
      title: "Activity Suggested!",
      description: "Your activity suggestion has been added."
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const currentVisits = visits.filter(v => v.status === 'current');
  const upcomingVisits = visits.filter(v => v.status === 'planned');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FriendConnect
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay connected with your friend group. Plan visits, see who's in town, and suggest activities!
          </p>
        </div>

        {/* Current User Status */}
        {currentUser && (
          <Card className="mb-8 border-2 border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-green-500 text-white">
                      {getInitials(currentUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-green-800">
                      Welcome back, {currentUser.name}!
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentUser.organizations.map((org) => (
                        <Badge key={org} variant="secondary" className="text-xs">
                          {org}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsRegistering(true)}
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    Edit Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Registration Form */}
        {(!currentUser || isRegistering) && (
          <div className="mb-8">
            <UserRegistration 
              onRegister={handleRegister}
              onCancel={isRegistering ? () => setIsRegistering(false) : undefined}
              existingUser={isRegistering ? currentUser : null}
            />
          </div>
        )}

        {currentUser && (
          <>
            {/* Visit Planner */}
            <div className="mb-8">
              <VisitPlanner 
                currentUser={currentUser}
                visits={visits}
                onAddVisit={handleAddVisit}
                onUpdateVisit={handleUpdateVisit}
              />
            </div>

            {/* Who's in Town */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Currently in Town ({currentVisits.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentVisits.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No one is currently in town</p>
                  ) : (
                    <div className="space-y-3">
                      {currentVisits.map((visit) => (
                        <div key={visit.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-green-500 text-white">
                              {getInitials(visit.userName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{visit.userName}</div>
                            <div className="text-sm text-gray-600">Since {visit.startDate.toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Visits ({upcomingVisits.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingVisits.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No upcoming visits planned</p>
                  ) : (
                    <div className="space-y-3">
                      {upcomingVisits.slice(0, 5).map((visit) => (
                        <div key={visit.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-500 text-white">
                              {getInitials(visit.userName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{visit.userName}</div>
                            <div className="text-sm text-gray-600">
                              {visit.startDate.toLocaleDateString()}
                              {visit.endDate && ` - ${visit.endDate.toLocaleDateString()}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Activity Suggestions */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Activity Suggestions</h2>
              <ActivitySuggestions 
                currentUser={currentUser}
                visits={visits}
                suggestions={suggestions}
                onAddSuggestion={handleAddSuggestion}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
