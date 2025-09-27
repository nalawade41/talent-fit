import { Card } from '../ui/card';

export function ProjectsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <Card className="p-6">
        <p className="text-muted-foreground">Projects management page - Manager only access</p>
      </Card>
    </div>
  );
}
