import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page en cours de construction</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Cette page sera migrée depuis React Admin dans une prochaine étape.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
