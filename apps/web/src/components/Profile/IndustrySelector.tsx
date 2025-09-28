import { useState } from 'react';
import { Badge } from '../ui/badge';
import { X, Search, Plus } from 'lucide-react';
import { INDUSTRIES, IndustryExperience } from '../../types/profile';

type Industry = typeof INDUSTRIES[number];

interface IndustrySelectorProps {
  selectedIndustries: IndustryExperience[];
  onIndustriesChange: (industries: IndustryExperience[]) => void;
  maxIndustries?: number;
}

export function IndustrySelector({ selectedIndustries, onIndustriesChange, maxIndustries = 5 }: IndustrySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<string | null>(null);
  const [tempYears, setTempYears] = useState<string>('');

  const filteredIndustries = INDUSTRIES.filter(industry => 
    industry.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedIndustries.some(selected => selected.industry === industry)
  );

  const addIndustry = (industry: Industry) => {
    if (!selectedIndustries.some(selected => selected.industry === industry) && selectedIndustries.length < maxIndustries) {
      // Start with 1 year as default
      const newIndustryExperience: IndustryExperience = {
        industry,
        years: 1
      };
      onIndustriesChange([...selectedIndustries, newIndustryExperience]);
      // Immediately start editing years
      setEditingIndustry(industry);
      setTempYears('1');
    }
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const removeIndustry = (industryToRemove: Industry) => {
    onIndustriesChange(selectedIndustries.filter(item => item.industry !== industryToRemove));
  };

  const updateYears = (industry: Industry, years: number) => {
    const updatedIndustries = selectedIndustries.map(item => 
      item.industry === industry ? { ...item, years } : item
    );
    onIndustriesChange(updatedIndustries);
  };

  const handleYearsEdit = (industry: Industry) => {
    const currentIndustry = selectedIndustries.find(item => item.industry === industry);
    if (currentIndustry) {
      setEditingIndustry(industry);
      setTempYears(currentIndustry.years.toString());
    }
  };

  const saveYears = () => {
    if (editingIndustry) {
      const years = parseFloat(tempYears);
      if (!isNaN(years) && years >= 0.5 && years <= 50) {
        updateYears(editingIndustry as Industry, years);
      }
      setEditingIndustry(null);
      setTempYears('');
    }
  };

  const cancelEdit = () => {
    setEditingIndustry(null);
    setTempYears('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Industry Experience ({selectedIndustries.length}/{maxIndustries})</label>
        
        {/* Search Input */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Add industries..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={selectedIndustries.length >= maxIndustries}
            />
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute z-10 w-full mt-1 max-h-48 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="p-3">
                <div className="space-y-1">
                  {filteredIndustries.length > 0 ? (
                    filteredIndustries.map((industry) => (
                      <button
                        key={industry}
                        onClick={() => addIndustry(industry)}
                        className="w-full text-left p-2 hover:bg-gray-100 rounded flex items-center gap-2"
                        type="button"
                      >
                        <Plus className="w-4 h-4 text-green-500" />
                        <span>{industry}</span>
                        <span className="text-xs text-gray-500 ml-auto">Click to add</span>
                      </button>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500 text-sm">
                      {searchTerm ? `No industries found matching "${searchTerm}"` : 'All industries added'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Selected Industries with Years */}
        {selectedIndustries.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-white">
            {selectedIndustries.map(({ industry, years }) => (
              <Badge key={industry} variant="secondary" className="flex items-center gap-1 pr-1">
                <span>{industry}</span>
                
                {/* Years Display/Edit */}
                {editingIndustry === industry ? (
                  <div className="flex items-center gap-1 ml-2">
                    <input
                      type="number"
                      value={tempYears}
                      onChange={(e) => setTempYears(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveYears();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      onBlur={saveYears}
                      className="w-12 text-xs px-1 py-0.5 border rounded text-center"
                      min="1"
                      max="50"
                      step="1"
                      autoFocus
                    />
                    <span className="text-xs text-gray-500">yrs</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleYearsEdit(industry)}
                    className="ml-2 px-2 py-0.5 text-xs bg-blue-50 hover:bg-blue-100 rounded transition-colors cursor-pointer"
                    type="button"
                    title="Click to edit years"
                  >
                    <span className="font-medium text-blue-700">
                      {years === 1 ? '1yr' : `${years}yrs`}
                    </span>
                  </button>
                )}

                {/* Remove Button */}
                <button
                  onClick={() => removeIndustry(industry)}
                  className="ml-1 p-1 rounded-full hover:bg-gray-200 transition-colors"
                  type="button"
                  aria-label={`Remove ${industry}`}
                >
                  <X className="w-3 h-3 text-gray-500 hover:text-gray-700" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Quick Add Popular Industries */}
      {selectedIndustries.length === 0 && (
        <div>
          <div className="text-sm text-gray-600 mb-2">Popular industries:</div>
          <div className="flex flex-wrap gap-2">
            {(['Technology', 'Finance', 'Healthcare', 'Consulting', 'E-commerce', 'Fintech'] as Industry[]).map((industry) => (
              <button
                key={industry}
                onClick={() => addIndustry(industry)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                type="button"
              >
                + {industry}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      {selectedIndustries.length > 0 && (
        <div className="text-xs text-gray-500">
          💡 Click the years (e.g., "3yrs") to edit experience duration (0.5 - 50 years)
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
