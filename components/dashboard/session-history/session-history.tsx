import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUp, Calendar, ChevronRight, Filter, Search } from "lucide-react";

export default function SessionHistory() {
 return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="text-primary h-4 w-4" />
            <CardTitle className="text-base font-semibold">
              Session History
            </CardTitle>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search sessions..."
                className="h-8 w-40 py-1 pr-2 pl-8 text-xs"
              />
              <Search className="text-muted-foreground absolute top-1/2 left-2 h-3 w-3 -translate-y-1/2 transform" />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="flex h-8 items-center gap-1 text-xs"
            >
              <Filter className="h-3 w-3" />
              <span>Filter</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-medium">Date</TableHead>
                <TableHead className="text-xs font-medium">
                  <div className="flex items-center gap-1">
                    <span>Title</span>
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium">
                  <div className="flex items-center gap-1">
                    <span>Duration</span>
                    <ArrowUp className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium">
                  Completion
                </TableHead>
                <TableHead className="text-xs font-medium">XP</TableHead>
                <TableHead className="text-xs font-medium"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-muted/50">
                <TableCell className="py-3 text-xs">Today, 9:30 AM</TableCell>
                <TableCell className="py-3 text-xs font-medium">
                  Morning Focus
                </TableCell>
                <TableCell className="py-3 text-xs">2h 30m</TableCell>
                <TableCell className="py-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="bg-muted h-2 w-16">
                      <div
                        className="bg-primary h-2"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                    <span>100%</span>
                  </div>
                </TableCell>
                <TableCell className="text-primary py-3 text-xs">
                  +150
                </TableCell>
                <TableCell className="py-3 text-xs">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow className="hover:bg-muted/50">
                <TableCell className="py-3 text-xs">
                  Yesterday, 2:00 PM
                </TableCell>
                <TableCell className="py-3 text-xs font-medium">
                  Project Sprint
                </TableCell>
                <TableCell className="py-3 text-xs">3h 00m</TableCell>
                <TableCell className="py-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="bg-muted h-2 w-16">
                      <div
                        className="bg-primary h-2"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                    <span>100%</span>
                  </div>
                </TableCell>
                <TableCell className="text-primary py-3 text-xs">
                  +180
                </TableCell>
                <TableCell className="py-3 text-xs">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow className="hover:bg-muted/50">
                <TableCell className="py-3 text-xs">
                  Yesterday, 10:00 AM
                </TableCell>
                <TableCell className="py-3 text-xs font-medium">
                  Study Session
                </TableCell>
                <TableCell className="py-3 text-xs">1h 45m</TableCell>
                <TableCell className="py-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="bg-muted h-2 w-16">
                      <div
                        className="bg-primary h-2"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                    <span>75%</span>
                  </div>
                </TableCell>
                <TableCell className="text-primary py-3 text-xs">
                  +105
                </TableCell>
                <TableCell className="py-3 text-xs">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow className="hover:bg-muted/50">
                <TableCell className="py-3 text-xs">May 15, 3:30 PM</TableCell>
                <TableCell className="py-3 text-xs font-medium">
                  Design Work
                </TableCell>
                <TableCell className="py-3 text-xs">2h 15m</TableCell>
                <TableCell className="py-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="bg-muted h-2 w-16">
                      <div
                        className="bg-primary h-2"
                        style={{ width: "90%" }}
                      ></div>
                    </div>
                    <span>90%</span>
                  </div>
                </TableCell>
                <TableCell className="text-primary py-3 text-xs">
                  +135
                </TableCell>
                <TableCell className="py-3 text-xs">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow className="hover:bg-muted/50">
                <TableCell className="py-3 text-xs">May 14, 9:00 AM</TableCell>
                <TableCell className="py-3 text-xs font-medium">
                  Morning Routine
                </TableCell>
                <TableCell className="py-3 text-xs">1h 30m</TableCell>
                <TableCell className="py-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="bg-muted h-2 w-16">
                      <div
                        className="bg-primary h-2"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                    <span>100%</span>
                  </div>
                </TableCell>
                <TableCell className="text-primary py-3 text-xs">+90</TableCell>
                <TableCell className="py-3 text-xs">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-muted-foreground text-xs">
            Showing 5 of 87 sessions
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 text-xs">
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-muted h-7 text-xs"
            >
              1
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              2
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              3
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
