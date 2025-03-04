"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const results = [
  {
    position: "1",
    driver: "Theo Pourchaire",
    team: "ART Grand Prix",
    points: "25",
    time: "1:43.521",
  },
  {
    position: "2",
    driver: "Frederik Vesti",
    team: "PREMA Racing",
    points: "18",
    time: "+2.341",
  },
  {
    position: "3",
    driver: "Jack Doohan",
    team: "Virtuosi Racing",
    points: "15",
    time: "+5.128",
  },
  {
    position: "4",
    driver: "Jehan Daruvala",
    team: "MP Motorsport",
    points: "12",
    time: "+8.459",
  },
  {
    position: "5",
    driver: "Logan Sargeant",
    team: "Carlin",
    points: "10",
    time: "+10.923",
  },
];

export function RecentResults() {
  return (
    <Card className="chart-card h-auto">
      <CardHeader>
        <CardTitle>Latest Race Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.position}>
                  <TableCell className="font-medium">{result.position}</TableCell>
                  <TableCell>{result.driver}</TableCell>
                  <TableCell>{result.team}</TableCell>
                  <TableCell>{result.points}</TableCell>
                  <TableCell>{result.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}