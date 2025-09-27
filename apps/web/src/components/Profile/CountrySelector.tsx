import { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Card } from '../ui/card';
import { LOCATION_OPTIONS } from '../../types/profile';

interface CountrySelectorProps {
  value: string;
  onChange: (country: string) => void;
  error?: string;
  disabled?: boolean;
}

export function CountrySelector({ value, onChange, error, disabled }: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedCountry = LOCATION_OPTIONS.find(country => country.code === value || country.name === value);

  const filteredCountries = useMemo(() => {
    if (!searchTerm) return LOCATION_OPTIONS;
    
    return LOCATION_OPTIONS.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSelect = (country: { code: string; name: string }) => {
    onChange(country.name);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      {/* Selected Country Display */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full p-3 border rounded-md text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:bg-gray-50'
        } ${error ? 'border-red-500' : 'border-gray-300'}`}
      >
        <div className="flex items-center gap-2">
          {selectedCountry ? (
            <>
              <span className="text-lg">{selectedCountry.flag}</span>
              <span>{selectedCountry.name}</span>
            </>
          ) : (
            <span className="text-gray-500">Select a country...</span>
          )}
        </div>
        {!disabled && <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
      </button>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {/* Dropdown */}
      {isOpen && (
        <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>

          {/* Country List */}
          <div className="max-h-48 overflow-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleSelect(country)}
                  className="w-full text-left p-3 hover:bg-gray-100 flex items-center gap-2 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-lg">{country.flag}</span>
                  <span>{country.name}</span>
                </button>
              ))
            ) : (
              <div className="p-3 text-gray-500 text-center">
                No countries found matching "{searchTerm}"
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
