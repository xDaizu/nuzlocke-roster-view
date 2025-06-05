import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutocompleteOption {
  value: string;
  label: string;
  searchText?: string; // Additional text to search against
}

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  options: AutocompleteOption[];
  placeholder?: string;
  className?: string;
  emptyMessage?: string;
  renderOption?: (option: AutocompleteOption) => React.ReactNode;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChange,
  options,
  placeholder = "Type to search...",
  className = "",
  emptyMessage = "No results found",
  renderOption
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Find the display text for the current value
  const selectedOption = options.find(option => option.value === value);
  
  // Filter options based on input
  const filteredOptions = options.filter(option => {
    const searchText = inputValue.toLowerCase();
    return (
      option.label.toLowerCase().includes(searchText) ||
      option.value.toLowerCase().includes(searchText) ||
      option.searchText?.toLowerCase().includes(searchText)
    );
  });

  // Update input display text when value changes externally
  useEffect(() => {
    if (selectedOption && !open) {
      setInputValue(selectedOption.label);
    } else if (!value && !open) {
      setInputValue("");
    }
  }, [value, selectedOption, open]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSelectedIndex(-1);
    
    if (!open) {
      setOpen(true);
    }

    // If input is cleared, clear the selection
    if (newValue === "") {
      onChange("");
    }
  };

  // Handle option selection
  const selectOption = (option: AutocompleteOption) => {
    onChange(option.value);
    setInputValue(option.label);
    setOpen(false);
    setSelectedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && filteredOptions[selectedIndex]) {
          selectOption(filteredOptions[selectedIndex]);
        } else if (filteredOptions.length === 1) {
          selectOption(filteredOptions[0]);
        }
        break;
      case "Escape":
        setOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle focus and blur
  const handleFocus = () => {
    setOpen(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Don't close if clicking on a dropdown item
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && relatedTarget.closest('[role="option"]')) {
      return;
    }
    
    // Delay to allow for option clicks
    setTimeout(() => {
      setOpen(false);
      setSelectedIndex(-1);
      // Restore display text if no valid selection
      if (selectedOption) {
        setInputValue(selectedOption.label);
      } else if (!value) {
        setInputValue("");
      }
    }, 200);
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={cn("bg-slate-700 border-slate-600 h-8 text-xs", className)}
        autoComplete="off"
      />
      {open && (
        <div 
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-slate-700 border border-slate-600 rounded-md shadow-lg"
          onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking dropdown
        >
          <Command className="bg-slate-700">
            <CommandList className="max-h-60">
              {filteredOptions.length === 0 ? (
                <CommandEmpty className="text-slate-400 text-xs py-2 text-center">
                  {emptyMessage}
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {filteredOptions.map((option, index) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => selectOption(option)}
                      onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking option
                      className={cn(
                        "text-xs cursor-pointer text-white",
                        selectedIndex === index && "bg-slate-600",
                        value === option.value && "bg-slate-600"
                      )}
                    >
                      {renderOption ? renderOption(option) : (
                        <div className="flex items-center justify-between w-full">
                          <span>{option.label}</span>
                          {value === option.value && (
                            <Check className="w-4 h-4 text-purple-400" />
                          )}
                        </div>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput; 