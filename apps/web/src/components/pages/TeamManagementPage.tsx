import { Card } from '../ui/card';

export function TeamManagementPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Team Management</h1>
      <Card className="p-6">
        <p className="text-muted-foreground">Team management page - Manager only access</p>
      </Card>
    </div>
  );
}
