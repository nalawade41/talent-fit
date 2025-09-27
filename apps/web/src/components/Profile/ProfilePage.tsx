import React, { useState, useRef } from 'react';
import { User, Mail, Briefcase, MapPin, Calendar, CreditCard as Edit2, Save, X, Upload, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateRandomAvatar, getInitials } from '../../utils/avatarUtils';

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    experience: user?.experience || 0,
    skills: user?.skills || [],
  });
  const [newSkill, setNewSkill] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    updateProfile({
      ...formData,
      avatar: avatarUrl,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      department: user?.department || '',
      experience: user?.experience || 0,
      skills: user?.skills || [],
    });
    setAvatarUrl(user?.avatar || '');
    setIsEditing(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateNewAvatar = () => {
    const newAvatar = generateRandomAvatar(user?.id);
    setAvatarUrl(newAvatar);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gray-300 flex items-center justify-center text-gray-600 text-2xl font-bold">
                    {getInitials(user?.name || '')}
                  </div>
                )}
                
                {isEditing && (
                  <div className="absolute -bottom-2 -right-2 flex gap-1">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                    >
                      <Upload className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={generateNewAvatar}
                      className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                    >
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
              
              <div className="text-white">
                <h1 className="text-3xl font-bold">{user?.name}</h1>
                <p className="text-blue-100 mt-1 capitalize">{user?.role} • {user?.department}</p>
                <p className="text-blue-100 text-sm">{user?.email}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900">{user?.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900">{user?.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Engineering, Design, Marketing"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Briefcase className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900">{user?.department || 'Not specified'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="50"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900">{user?.experience || 0} years</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </label>
                  
                  {isEditing && (
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      />
                      <button
                        onClick={addSkill}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {(isEditing ? formData.skills : user?.skills || []).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => removeSkill(skill)}
                            className="ml-1 text-blue-500 hover:text-blue-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))}
                    {(isEditing ? formData.skills : user?.skills || []).length === 0 && (
                      <span className="text-gray-500 text-sm">No skills added yet</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}