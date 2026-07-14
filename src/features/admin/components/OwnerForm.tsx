import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Schema validation
const ownerSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Format d'email invalide").optional().or(z.literal('')),
  contactInfo: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
});

export type OwnerFormValues = z.infer<typeof ownerSchema>;

interface OwnerFormProps {
  mode: 'create' | 'edit';
  initialData: OwnerFormValues;
  onSubmit: (data: OwnerFormValues) => void;
  onCancel: () => void;
  isPending: boolean;
}

const FormField = memo(function FormField({
  id,
  label,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
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

const OwnerForm = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isPending,
}: OwnerFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OwnerFormValues>({
    resolver: zodResolver(ownerSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField id="name" label="Nom" error={errors.name?.message} required>
          <Input
            id="name"
            placeholder="Nom du propriétaire"
            {...register('name')}
            className={errors.name ? 'border-destructive' : ''}
          />
        </FormField>
        
        <FormField id="email" label="Email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            {...register('email')}
            className={errors.email ? 'border-destructive' : ''}
          />
        </FormField>

        <FormField id="phone" label="Téléphone" error={errors.phone?.message}>
          <Input
            id="phone"
            placeholder="Téléphone"
            {...register('phone')}
            className={errors.phone ? 'border-destructive' : ''}
          />
        </FormField>

        <FormField id="contactInfo" label="Contact Info" error={errors.contactInfo?.message}>
          <Input
            id="contactInfo"
            placeholder="Informations de contact"
            {...register('contactInfo')}
            className={errors.contactInfo ? 'border-destructive' : ''}
          />
        </FormField>

        <FormField id="city" label="Ville" error={errors.city?.message}>
          <Input
            id="city"
            placeholder="Ville"
            {...register('city')}
            className={errors.city ? 'border-destructive' : ''}
          />
        </FormField>

        <div className="md:col-span-2">
          <FormField id="address" label="Adresse" error={errors.address?.message}>
            <Textarea
              id="address"
              placeholder="Adresse"
              rows={3}
              {...register('address')}
              className={errors.address ? 'border-destructive' : ''}
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

export default OwnerForm;
