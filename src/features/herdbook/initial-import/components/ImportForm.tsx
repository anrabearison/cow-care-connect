import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { initialImportSchema, type InitialImportFormData } from '../schemas/initialImport.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface ImportFormProps {
  form: ReturnType<typeof useForm<InitialImportFormData>>;
  onSubmit: (data: InitialImportFormData) => void;
  isLoading?: boolean;
}

export const ImportForm = ({ form, onSubmit, isLoading = false }: ImportFormProps) => {
  return (
    <Card role="region" aria-labelledby="form-title">
      <CardHeader>
        <CardTitle id="form-title">Informations du HerdBook</CardTitle>
        <CardDescription>
          Créez votre premier livre de troupeau. Cette action est unique par propriétaire.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" aria-label="Formulaire d'import initial">
            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="reference">Référence *</FormLabel>
                  <FormControl>
                    <Input
                      id="reference"
                      placeholder="HB-2024"
                      aria-describedby="reference-description"
                      aria-invalid={!!form.formState.errors.reference}
                      {...field}
                    />
                  </FormControl>
                  <p id="reference-description" className="text-sm text-muted-foreground">
                    Identifiant unique du livre de troupeau (lettres, chiffres, tirets, underscores)
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="year">Année *</FormLabel>
                  <FormControl>
                    <Input
                      id="year"
                      type="number"
                      placeholder="2024"
                      aria-invalid={!!form.formState.errors.year}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="description">Description (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      placeholder="Description du livre de troupeau..."
                      className="resize-none"
                      aria-describedby="description-description"
                      {...field}
                    />
                  </FormControl>
                  <p id="description-description" className="text-sm text-muted-foreground">
                    Description détaillée du livre de troupeau (max 500 caractères)
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? 'Traitement en cours...' : 'Continuer'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
