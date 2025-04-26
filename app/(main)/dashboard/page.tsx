import { DailyFocusTimeByMonth } from "@/components/dashboard/insights/insights";
import Statistics from "@/components/dashboard/statistics-overview/statistics";
import { Badge } from "@/components/ui/badge";
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
import { api } from "@/convex/_generated/api";
import {
  convexAuthNextjsToken,
  isAuthenticatedNextjs,
} from "@convex-dev/auth/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import {
  ArrowUp,
  Award,
  BarChart2,
  Calendar,
  ChevronRight,
  Clock,
  Filter,
  Flame,
  Plus,
  Search,
  Target,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await isAuthenticatedNextjs();
  const authToken = await convexAuthNextjsToken();
  const preloadedTotalFocusTime = await preloadQuery(
    api.statistics.queries.totalFocusTimeByCurrentUser,
    {},
    { token: authToken },
  );
  const preloadedTotalFocusTimeByWeek = await preloadQuery(
    api.statistics.queries.totalFocusTimeByCurrentUserForWeek,
    {},
    { token: authToken },
  );
  const preloadedDailyAveragesByMonth = await preloadQuery(
    api.statistics.queries.dailyAveragesByCurrentUserForMonth,
    {},
    { token: authToken },
  );

  return (
    <div className="min-h-screen font-mono">
      <main className="container mx-auto py-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-1 text-2xl font-semibold">Session Management</h1>
            <p className="text-muted-foreground text-sm">
              Track, analyze, and create your focus sessions
            </p>
          </div>
          <Button asChild>
            <Link href="/session/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>New Session</span>
            </Link>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Statistics
            preloadedTotalFocusTime={preloadedTotalFocusTime}
            preloadedTotalFocusTimeByWeek={preloadedTotalFocusTimeByWeek}
          />
        </div>

        {/* Productivity Insights */}
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="text-primary h-4 w-4" />
                <CardTitle className="text-base font-semibold">
                  Productivity Insights
                </CardTitle>
              </div>
              <Button variant="link" className="h-auto p-0 text-xs">
                View Details
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Weekly Focus Hours */}
              <DailyFocusTimeByMonth preloadedDailyAveragesByMonth={preloadedDailyAveragesByMonth} />

              {/* Productivity Patterns */}
              <div>
                <h3 className="mb-3 text-sm font-medium">
                  Productivity Patterns
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs">Most Productive Time</span>
                      <span className="text-xs font-medium">
                        9:00 AM - 11:00 AM
                      </span>
                    </div>
                    <div className="bg-muted h-2 w-full">
                      <div
                        className="bg-primary h-2"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs">Most Productive Day</span>
                      <span className="text-xs font-medium">Tuesday</span>
                    </div>
                    <div className="bg-muted h-2 w-full">
                      <div
                        className="bg-primary h-2"
                        style={{ width: "80%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs">
                        Average Session Completion
                      </span>
                      <span className="text-xs font-medium">92%</span>
                    </div>
                    <div className="bg-muted h-2 w-full">
                      <div
                        className="bg-primary h-2"
                        style={{ width: "92%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <h4 className="mb-2 text-xs font-medium">
                      Top Focus Categories
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="default"
                        className="flex items-center gap-1 text-xs"
                      >
                        Work (45%)
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-secondary-foreground flex items-center gap-1 text-xs"
                      >
                        Study (30%)
                      </Badge>
                      <Badge
                        variant="default"
                        className="bg-accent text-accent-foreground flex items-center gap-1 text-xs"
                      >
                        Personal (25%)
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Target className="text-primary h-4 w-4" />
              <CardTitle className="text-base font-semibold">
                Recent Achievements
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="flex items-center gap-3 p-3">
                  <div className="bg-muted flex h-10 w-10 items-center justify-center">
                    <Flame className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">5-Day Streak</h3>
                    <p className="text-muted-foreground text-xs">
                      Completed sessions 5 days in a row
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-3 p-3">
                  <div className="bg-muted flex h-10 w-10 items-center justify-center">
                    <Clock className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">40-Hour Milestone</h3>
                    <p className="text-muted-foreground text-xs">
                      Accumulated 40+ hours of focus time
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-3 p-3">
                  <div className="bg-muted flex h-10 w-10 items-center justify-center">
                    <Award className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Level 8 Reached</h3>
                    <p className="text-muted-foreground text-xs">
                      Earned 4,000+ experience points
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Session History */}
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
                    <TableCell className="py-3 text-xs">
                      Today, 9:30 AM
                    </TableCell>
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
                    <TableCell className="py-3 text-xs">
                      May 15, 3:30 PM
                    </TableCell>
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
                    <TableCell className="py-3 text-xs">
                      May 14, 9:00 AM
                    </TableCell>
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
                    <TableCell className="text-primary py-3 text-xs">
                      +90
                    </TableCell>
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
      </main>
    </div>
  );
}
