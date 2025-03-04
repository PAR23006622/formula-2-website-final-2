"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

interface DriverFilterProps {
  drivers: string[];
  selectedDrivers: Set<string>;
  onToggleDriver: (driver: string) => void;
  onToggleAll: () => void;
}

export function DriverFilter({ drivers, selectedDrivers, onToggleDriver, onToggleAll }: DriverFilterProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex items-center justify-between w-[200px] px-3 font-normal"
        >
          <span className="truncate">
            {selectedDrivers.size === 0
              ? "No drivers selected"
              : selectedDrivers.size === drivers.length
              ? "All drivers"
              : `${selectedDrivers.size} drivers selected`}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="end">
        <Command>
          <CommandInput placeholder="Search drivers..." />
          <CommandList>
            <CommandEmpty>No driver found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={onToggleAll}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>
                  {selectedDrivers.size === drivers.length
                    ? "Deselect All"
                    : "Select All"}
                </span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              {drivers.map((driver) => (
                <CommandItem
                  key={driver}
                  onSelect={() => {
                    onToggleDriver(driver);
                  }}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span>{driver}</span>
                  {selectedDrivers.has(driver) && <Check className="h-4 w-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}