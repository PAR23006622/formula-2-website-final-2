  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-semibold">Race Points Distribution</h3>
      {!externalSelectedTeams && (
        <TeamFilter
          teams={allTeams}
          selectedTeams={selectedTeams}
          onToggleTeam={toggleTeam}
          onToggleAll={toggleAllTeams}
        />
      )}
    </div>

    <div className="space-y-4">
      <Card className="p-6 shadow-sm dark:bg-[#1f2937] dark:border-gray-800">
        <p className="text-muted-foreground text-sm mb-4">
          Points distribution for selected races
        </p>
        <div className="w-full h-[430px]"> 