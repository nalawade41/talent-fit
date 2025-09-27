import { Card } from '../ui/card';

export function AllEmployeesPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Employees</h1>
      <Card className="p-6">
        <p className="text-muted-foreground">All employees directory - Manager only access</p>
      </Card>
    </div>
  );
}
