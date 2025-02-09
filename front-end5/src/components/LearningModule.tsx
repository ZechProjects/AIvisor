import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface LearningModuleProps {
  title: string;
  description: string;
  progress: number;
  onStart: () => void;
}

export function LearningModule({ title, description, progress, onStart }: LearningModuleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {progress}% Complete
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onStart} className="w-full">
          {progress === 0 ? 'Start Learning' : 'Continue Learning'}
        </Button>
      </CardFooter>
    </Card>
  );
} 