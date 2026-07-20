import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { herdBookService } from '@/features/herdbook/services';

interface CsvUploadProps {
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  selectedFile: File | null;
  isLoading?: boolean;
}

export const CsvUpload = ({ onFileSelect, onRemove, selectedFile, isLoading = false }: CsvUploadProps) => {
  const { toast } = useToast();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5 Mo
    disabled: isLoading,
  });

  const handleDownloadTemplate = async () => {
    try {
      const blob = await herdBookService.downloadCsvTemplate() as Blob;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'herdbook-import-template.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur téléchargement template:', error);
      toast({
        variant: 'destructive',
        title: 'Téléchargement impossible',
        description: 'Le template CSV n\'a pas pu être téléchargé. Veuillez réessayer.',
      });
    }
  };

  return (
    <Card role="region" aria-labelledby="upload-title">
      <CardHeader>
        <CardTitle id="upload-title">Fichier CSV</CardTitle>
        <CardDescription>
          Téléchargez le template, remplissez-le avec vos données, puis uploadez-le ici.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadTemplate}
            className="gap-2"
            aria-label="Télécharger le template CSV"
          >
            <Download className="h-4 w-4" />
            Télécharger le template
          </Button>
        </div>

        {selectedFile ? (
          <Alert className="border-green-200 bg-green-50">
            <FileText className="h-4 w-4 text-green-600" aria-hidden="true" />
            <AlertDescription className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4" aria-hidden="true" />
                <span>{selectedFile.name}</span>
                <span className="text-sm text-muted-foreground">
                  ({(selectedFile.size / 1024).toFixed(2)} KB)
                </span>
              </span>
              {!isLoading && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onRemove}
                  aria-label="Supprimer le fichier sélectionné"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </AlertDescription>
          </Alert>
        ) : (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            role="button"
            aria-label="Zone de dépôt pour fichier CSV"
            aria-describedby="upload-help"
            tabIndex={0}
          >
            <input {...getInputProps()} aria-label="Sélectionner un fichier CSV" />
            <Upload
              className={`mx-auto h-12 w-12 mb-4 ${
                isDragActive ? 'text-primary' : 'text-muted-foreground'
              }`}
              aria-hidden="true"
            />
            <p className="text-sm font-medium mb-2">
              {isDragActive ? 'Déposez le fichier CSV ici' : 'Glissez-déposez un fichier CSV ici'}
            </p>
            <p id="upload-help" className="text-xs text-muted-foreground">
              ou cliquez pour sélectionner (max 5 Mo, 100 lignes)
            </p>
          </div>
        )}

        <Alert>
          <AlertDescription className="text-xs">
            <strong>Format requis:</strong> CSV avec séparateur point-virgule (;), encodage UTF-8 avec BOM.
            Colonnes: n_carnet, name, nickname, gender, birth_date, character, brand, distinctive_sign,
            source_type, category, status. Format date: DD/MM/YYYY.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
