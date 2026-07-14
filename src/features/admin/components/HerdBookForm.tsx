import { memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { ownersService, Owner } from '../services/ownersService';
import { queryKeys } from '@/lib/queryKeys';

const herdBookSchema = z.object({
  reference: z.string().min(1, "La référence est requise"),
  year: z.number({ invalid_type_error: "L'année doit être un nombre" }).min(1900, "Année invalide").max(2100, "Année invalide"),
  description: z.string().optional(),
  ownerId: z.string().optional(),
});

export type HerdBookFormValues = z.infer<typeof herdBookSchema>;

interface HerdBookFormProps {
  mode: 'create' | 'edit';
  initialData: HerdBookFormValues;
  onSubmit: (data: HerdBookFormValues) => void;
  onCancel: () => void;
  isPending: boolean;
}

const FormField = memo(function FormField({
  id, label, error, required, children,
}: {
  id: string; label: string; error?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={error ? 'text-destructive' : ''}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
});

const HerdBookForm = ({ mode, initialData, onSubmit, onCancel, isPending }: HerdBookFormProps) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<HerdBookFormValues>({
    resolver: zodResolver(herdBookSchema),
    defaultValues: initialData,
  });

  const ownerId = watch('ownerId');

  const { data: ownersData } = useQuery({
    queryKey: queryKeys.owners.list({ page: 1, per_page: 100 }),
    queryFn: () => ownersService.getOwnersList({ page: 1, per_page: 100 }),
    staleTime: 5 * 60 * 1000,
  });

  const owners: Owner[] = ownersData?.data || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField id="reference" label="Référence" error={errors.reference?.message} required>
          <Input
            id="reference"
            placeholder="Référence du livre de troupeau"
            {...register('reference')}
            className={errors.reference ? 'border-destructive' : ''}
          />
        </FormField>

        <FormField id="year" label="Année" error={errors.year?.message} required>
          <Input
            id="year"
            type="number"
            placeholder="Ex: 2024"
            {...register('year', { valueAsNumber: true })}
            className={errors.year ? 'border-destructive' : ''}
          />
        </FormField>

        <div className="md:col-span-2">
          <FormField id="ownerId" label="Propriétaire" error={errors.ownerId?.message}>
            <Select value={ownerId || ''} onValueChange={(val) => setValue('ownerId', val)}>
              <SelectTrigger id="ownerId" className={errors.ownerId ? 'border-destructive' : ''}>
                <SelectValue placeholder="Sélectionner un propriétaire" />
              </SelectTrigger>
              <SelectContent>
                {owners.map((owner) => (
                  <SelectItem key={owner.id} value={owner.id}>
                    {owner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <div className="md:col-span-2">
          <FormField id="description" label="Description" error={errors.description?.message}>
            <Textarea
              id="description"
              placeholder="Description du livre de troupeau"
              rows={3}
              {...register('description')}
              className={errors.description ? 'border-destructive' : ''}
            />
          </FormField>
        </div>
      </div>

      <div className="flex gap-4 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Annuler
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : mode === 'create' ? "Créer" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
};

export default HerdBookForm;
