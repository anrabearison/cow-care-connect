import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useInput, useNotify } from 'react-admin';
import axios from 'axios';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface CloudinaryImageInputProps {
    source: string;
    label?: string;
}

export const CloudinaryImageInput: React.FC<CloudinaryImageInputProps> = ({
    source,
    label = 'Photo'
}) => {
    const { field } = useInput({ source });
    const notify = useNotify();
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(field.value || null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            notify('La taille du fichier ne doit pas dépasser 5 MB', { type: 'error' });
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            notify('Veuillez sélectionner une image', { type: 'error' });
            return;
        }

        setUploading(true);

        try {
            // Create form data
            const formData = new FormData();
            formData.append('file', file);

            // Get auth token from React Admin
            const token = localStorage.getItem('auth_token');

            // Upload to backend
            const response = await axios.post(
                'http://localhost:8000/api/upload/image',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const imageUrl = response.data.url;

            // Update field value
            field.onChange(imageUrl);
            setPreview(imageUrl);

            notify('Image téléchargée avec succès', { type: 'success' });
        } catch (error: any) {
            console.error('Upload error:', error);
            notify(
                error.response?.data?.detail || 'Erreur lors du téléchargement de l\'image',
                { type: 'error' }
            );
        } finally {
            setUploading(false);
        }
    }, [field, notify]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        multiple: false,
        disabled: uploading
    });

    const handleRemove = () => {
        field.onChange(null);
        setPreview(null);
        notify('Image supprimée', { type: 'info' });
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            {preview ? (
                <div className="relative inline-block">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-64 h-64 object-cover rounded-lg border-2 border-gray-300"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        title="Supprimer l'image"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
                >
                    <input {...getInputProps()} />

                    <div className="flex flex-col items-center justify-center space-y-3">
                        {uploading ? (
                            <>
                                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                                <p className="text-sm text-gray-600">Téléchargement en cours...</p>
                            </>
                        ) : (
                            <>
                                {isDragActive ? (
                                    <>
                                        <Upload className="w-12 h-12 text-blue-500" />
                                        <p className="text-sm text-gray-600">Déposez l'image ici</p>
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon className="w-12 h-12 text-gray-400" />
                                        <p className="text-sm text-gray-600">
                                            Glissez-déposez une image ici, ou cliquez pour sélectionner
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, JPEG ou WEBP (max. 5 MB)
                                        </p>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
