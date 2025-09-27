import { Card } from '../ui/card';

export function AnalyticsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      <Card className="p-6">
        <p className="text-muted-foreground">Analytics dashboard - Manager only access</p>
      </Card>
    </div>
  );
}
