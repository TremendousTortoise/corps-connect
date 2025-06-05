
import { useState, useEffect } from "react";
import { Users, Calendar } from "lucide-react";
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

  const getUserByVisit = (visit: Visit) => {
    return users.find(u => u.id === visit.userId);
  };

  const currentVisits = visits.filter(v => v.status === 'current');
  const upcomingVisits = visits.filter(v => v.status === 'planned');

  return (
    <div className="min-h-screen bg-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-yellow-500 rounded border-2 border-yellow-600">
              <Users className="h-8 w-8 text-blue-950" />
            </div>
            <h1 className="text-5xl font-bold text-yellow-400 font-crimson">
              CorpsConnect
            </h1>
          </div>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto font-crimson">
            Connect with your corps. Plan visits, see who's in town, and coordinate activities.
          </p>
        </div>

        {/* Current User Status */}
        {currentUser && (
          <div className="mb-8 p-6 bg-blue-800 border-2 border-yellow-500 rounded">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-yellow-500 text-blue-950 font-bold">
                    {getInitials(currentUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-yellow-400 font-crimson text-lg">
                    Welcome back, {currentUser.name}!
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentUser.organizations.map((org) => (
                      <Badge key={org} className="bg-yellow-600 text-blue-950 text-xs border border-yellow-500">
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
                  className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-blue-950"
                >
                  Edit Profile
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
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
              <div className="p-6 bg-blue-800 border-2 border-yellow-500 rounded">
                <h3 className="flex items-center gap-2 text-yellow-400 font-crimson text-xl font-semibold mb-4">
                  <Users className="h-5 w-5" />
                  Currently in Town ({currentVisits.length})
                </h3>
                {currentVisits.length === 0 ? (
                  <p className="text-blue-200 text-center py-4">No one is currently in town</p>
                ) : (
                  <div className="space-y-3">
                    {currentVisits.map((visit) => {
                      const user = getUserByVisit(visit);
                      return (
                        <div key={visit.id} className="flex items-center gap-3 p-3 bg-blue-900 rounded border border-yellow-500">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-yellow-500 text-blue-950 font-bold">
                              {getInitials(visit.userName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium text-yellow-400">{visit.userName}</div>
                            <div className="text-sm text-blue-200">Since {visit.startDate.toLocaleDateString()}</div>
                            {user && user.organizations.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {user.organizations.map((org) => (
                                  <Badge key={org} className="bg-yellow-600 text-blue-950 text-xs border border-yellow-500">
                                    {org}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="p-6 bg-blue-800 border-2 border-yellow-500 rounded">
                <h3 className="flex items-center gap-2 text-yellow-400 font-crimson text-xl font-semibold mb-4">
                  <Calendar className="h-5 w-5" />
                  Upcoming Visits ({upcomingVisits.length})
                </h3>
                {upcomingVisits.length === 0 ? (
                  <p className="text-blue-200 text-center py-4">No upcoming visits planned</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingVisits.slice(0, 5).map((visit) => {
                      const user = getUserByVisit(visit);
                      return (
                        <div key={visit.id} className="flex items-center gap-3 p-3 bg-blue-900 rounded border border-yellow-500">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-yellow-500 text-blue-950 font-bold">
                              {getInitials(visit.userName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium text-yellow-400">{visit.userName}</div>
                            <div className="text-sm text-blue-200">
                              {visit.startDate.toLocaleDateString()}
                              {visit.endDate && ` - ${visit.endDate.toLocaleDateString()}`}
                            </div>
                            {user && user.organizations.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {user.organizations.map((org) => (
                                  <Badge key={org} className="bg-yellow-600 text-blue-950 text-xs border border-yellow-500">
                                    {org}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Activity Suggestions */}
            <div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-4 font-crimson">Activity Suggestions</h2>
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
