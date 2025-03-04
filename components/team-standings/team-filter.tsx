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
import { Badge } from "@/components/ui/badge";

interface TeamFilterProps {
  teams: string[];
  selectedTeams: Set<string>;
  onToggleTeam: (team: string) => void;
  onToggleAll: () => void;
}

export function TeamFilter({ teams, selectedTeams, onToggleTeam, onToggleAll }: TeamFilterProps) {
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
            {selectedTeams.size === 0
              ? "No teams selected"
              : selectedTeams.size === teams.length
              ? "All teams"
              : `${selectedTeams.size} teams selected`}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="end">
        <Command>
          <CommandInput placeholder="Search teams..." />
          <CommandList>
            <CommandEmpty>No team found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={onToggleAll}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>
                  {selectedTeams.size === teams.length
                    ? "Deselect All"
                    : "Select All"}
                </span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              {teams.map((team) => (
                <CommandItem
                  key={team}
                  onSelect={() => {
                    onToggleTeam(team);
                  }}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span>{team}</span>
                  {selectedTeams.has(team) && <Check className="h-4 w-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 