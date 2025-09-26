import { StatsCard } from '../stats-card';
import { Users, Calendar, Clock, TrendingUp } from 'lucide-react';

export default function StatsCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <StatsCard
        title="Total Employees"
        value={125}
        change="+2 this week"
        changeType="increase"
        icon={Users}
        description="Active employees"
      />
      <StatsCard
        title="Present Today"
        value={118}
        change="94.4% attendance"
        changeType="increase"
        icon={Calendar}
      />
      <StatsCard
        title="Late Arrivals"
        value={7}
        change="-3 from yesterday"
        changeType="decrease"
        icon={Clock}
      />
      <StatsCard
        title="Avg Daily Hours"
        value="8.2h"
        change="+0.3h this month"
        changeType="increase"
        icon={TrendingUp}
      />
    </div>
  );
}