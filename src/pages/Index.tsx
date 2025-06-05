
import { useState, useEffect } from "react";
import { MapPin, Users, Plus, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  city: string;
  joinedAt: Date;
  bio?: string;
  occupation?: string;
}

const Index = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    bio: "",
    occupation: ""
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();

  // Load users from localStorage on component mount
  useEffect(() => {
    const savedUsers = localStorage.getItem("cityUsers");
    const savedCurrentUser = localStorage.getItem("currentUser");
    
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers).map((user: any) => ({
        ...user,
        joinedAt: new Date(user.joinedAt)
      }));
      setUsers(parsedUsers);
    }
    
    if (savedCurrentUser) {
      const parsedCurrentUser = JSON.parse(savedCurrentUser);
      setCurrentUser({
        ...parsedCurrentUser,
        joinedAt: new Date(parsedCurrentUser.joinedAt)
      });
    }
  }, []);

  // Save to localStorage whenever users change
  useEffect(() => {
    localStorage.setItem("cityUsers", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const handleRegister = () => {
    if (!formData.name.trim() || !formData.city.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both your name and city.",
        variant: "destructive"
      });
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      city: formData.city.trim(),
      bio: formData.bio.trim(),
      occupation: formData.occupation.trim(),
      joinedAt: new Date()
    };

    // Remove current user from previous city if they exist
    if (currentUser) {
      setUsers(prev => prev.filter(user => user.id !== currentUser.id));
    }

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsRegistering(false);
    setFormData({ name: "", city: "", bio: "", occupation: "" });

    toast({
      title: "Welcome!",
      description: `You're now registered in ${newUser.city}!`
    });
  };

  const handleLeaveCity = () => {
    if (currentUser) {
      setUsers(prev => prev.filter(user => user.id !== currentUser.id));
      setCurrentUser(null);
      localStorage.removeItem("currentUser");
      
      toast({
        title: "Left City",
        description: "You've been removed from the city directory."
      });
    }
  };

  const groupedByCity = users.reduce((acc, user) => {
    if (!acc[user.city]) {
      acc[user.city] = [];
    }
    acc[user.city].push(user);
    return acc;
  }, {} as Record<string, User[]>);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CityConnect
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find and connect with people in your city. Register your location and discover who else is around!
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
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-800">
                        You're registered in {currentUser.city}
                      </span>
                    </div>
                    <p className="text-green-600">
                      Joined {currentUser.joinedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsRegistering(true)}
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    Change City
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleLeaveCity}
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    Leave City
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Registration Form */}
        {(!currentUser || isRegistering) && (
          <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Plus className="h-6 w-6" />
                {isRegistering ? "Update Your Location" : "Join a City"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <Input
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <Input
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="bg-white"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Occupation (optional)
                  </label>
                  <Input
                    placeholder="What do you do?"
                    value={formData.occupation}
                    onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio (optional)
                  </label>
                  <Input
                    placeholder="Tell us about yourself"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    className="bg-white"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleRegister}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isRegistering ? "Update Location" : "Register"}
                </Button>
                {isRegistering && (
                  <Button 
                    variant="outline" 
                    onClick={() => setIsRegistering(false)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* City Directory */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-6 w-6 text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              City Directory ({users.length} {users.length === 1 ? 'person' : 'people'})
            </h2>
          </div>

          {Object.keys(groupedByCity).length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No one is registered yet
                </h3>
                <p className="text-gray-500">
                  Be the first to register in a city!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {Object.entries(groupedByCity).map(([city, cityUsers]) => (
                <Card key={city} className="overflow-hidden border-l-4 border-l-blue-500">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-6 w-6 text-blue-600" />
                        <span className="text-xl">{city}</span>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {cityUsers.length} {cityUsers.length === 1 ? 'person' : 'people'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {cityUsers.map((user) => (
                        <div 
                          key={user.id} 
                          className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {user.name}
                              {user.id === currentUser?.id && (
                                <span className="ml-2 text-sm text-green-600">(You)</span>
                              )}
                            </h4>
                            {user.occupation && (
                              <p className="text-sm text-gray-600 truncate">
                                {user.occupation}
                              </p>
                            )}
                            {user.bio && (
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {user.bio}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-2">
                              Joined {user.joinedAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
