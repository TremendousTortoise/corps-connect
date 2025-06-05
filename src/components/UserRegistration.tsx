
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X, User } from "lucide-react";
import { User as UserType } from "@/types";

interface UserRegistrationProps {
  onRegister: (user: UserType) => void;
  onCancel?: () => void;
  existingUser?: UserType | null;
}

const UserRegistration = ({ onRegister, onCancel, existingUser }: UserRegistrationProps) => {
  const [name, setName] = useState(existingUser?.name || '');
  const [bio, setBio] = useState(existingUser?.bio || '');
  const [organizations, setOrganizations] = useState<string[]>(existingUser?.organizations || []);
  const [newOrg, setNewOrg] = useState('');

  const addOrganization = () => {
    if (newOrg.trim() && !organizations.includes(newOrg.trim())) {
      setOrganizations([...organizations, newOrg.trim()]);
      setNewOrg('');
    }
  };

  const removeOrganization = (org: string) => {
    setOrganizations(organizations.filter(o => o !== org));
  };

  const handleSubmit = () => {
    if (!name.trim()) return;

    const user: UserType = {
      id: existingUser?.id || Date.now().toString(),
      name: name.trim(),
      organizations,
      bio: bio.trim() || undefined
    };

    onRegister(user);
  };

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <User className="h-6 w-6" />
          {existingUser ? "Update Profile" : "Create Account"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name *
          </label>
          <Input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio (optional)
          </label>
          <Input
            placeholder="Tell your friends about yourself"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organizations
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Add organization (work, school, club...)"
              value={newOrg}
              onChange={(e) => setNewOrg(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addOrganization()}
              className="bg-white"
            />
            <Button onClick={addOrganization} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {organizations.map((org) => (
              <Badge key={org} variant="secondary" className="flex items-center gap-1">
                {org}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeOrganization(org)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {existingUser ? "Update Profile" : "Create Account"}
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserRegistration;
