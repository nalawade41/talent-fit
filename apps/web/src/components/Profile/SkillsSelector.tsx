import { useState, useMemo } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { X, Plus, Search } from 'lucide-react';
import { SKILL_CATEGORIES, ALL_SKILLS } from '../../types/profile';

interface SkillsSelectorProps {
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  maxSkills?: number;
}

export function SkillsSelector({ selectedSkills, onSkillsChange, maxSkills = 20 }: SkillsSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredSkills = useMemo(() => {
    let skills: string[] = ALL_SKILLS;
    
    // Filter by category
    if (selectedCategory !== 'All') {
      skills = [...(SKILL_CATEGORIES[selectedCategory as keyof typeof SKILL_CATEGORIES] || [])];
    }
    
    // Filter by search term
    if (searchTerm) {
      skills = skills.filter(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Exclude already selected skills
    return skills.filter(skill => !selectedSkills.includes(skill));
  }, [searchTerm, selectedCategory, selectedSkills]);

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill) && selectedSkills.length < maxSkills) {
      onSkillsChange([...selectedSkills, skill]);
    }
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const removeSkill = (skillToRemove: string) => {
    onSkillsChange(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const addCustomSkill = () => {
    if (searchTerm && !(ALL_SKILLS as string[]).includes(searchTerm) && !selectedSkills.includes(searchTerm)) {
      addSkill(searchTerm);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Skills ({selectedSkills.length}/{maxSkills})</label>
        
        {/* Search Input */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Add skills..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={selectedSkills.length >= maxSkills}
            />
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && (searchTerm || selectedCategory !== 'All') && (
            <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="p-3">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-1 mb-3">
                  <Button
                    variant={selectedCategory === 'All' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('All')}
                    type="button"
                  >
                    All
                  </Button>
                  {Object.keys(SKILL_CATEGORIES).map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      type="button"
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                {/* Skill Suggestions */}
                <div className="space-y-1">
                  {searchTerm && !(ALL_SKILLS as string[]).includes(searchTerm) && !selectedSkills.includes(searchTerm) && (
                    <button
                      onClick={addCustomSkill}
                      className="w-full text-left p-2 hover:bg-gray-100 rounded flex items-center gap-2"
                      type="button"
                    >
                      <Plus className="w-4 h-4 text-green-500" />
                      Add "{searchTerm}" as custom skill
                    </button>
                  )}
                  
                  {filteredSkills.slice(0, 10).map((skill) => (
                    <button
                      key={skill}
                      onClick={() => addSkill(skill)}
                      className="w-full text-left p-2 hover:bg-gray-100 rounded"
                      type="button"
                    >
                      {skill}
                    </button>
                  ))}
                  
                  {filteredSkills.length === 0 && searchTerm && (
                    <div className="p-2 text-gray-500 text-sm">
                      No skills found matching "{searchTerm}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Selected Skills */}
        {selectedSkills.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-white">
            {selectedSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="flex items-center gap-1 pr-1">
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-1 p-1 rounded-full hover:bg-gray-200 transition-colors"
                  type="button"
                  aria-label={`Remove ${skill}`}
                >
                  <X className="w-3 h-3 text-gray-500 hover:text-gray-700" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Quick Add Popular Skills */}
      {selectedSkills.length === 0 && (
        <div>
          <div className="text-sm text-gray-600 mb-2">Popular skills:</div>
          <div className="flex flex-wrap gap-2">
            {['React', 'JavaScript', 'Python', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'MongoDB'].map((skill) => (
              <button
                key={skill}
                onClick={() => addSkill(skill)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-100"
                type="button"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hide suggestions when clicking elsewhere */}
      {showSuggestions && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}
