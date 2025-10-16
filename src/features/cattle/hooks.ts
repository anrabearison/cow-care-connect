import { useState, useEffect } from 'react';
import { Cattle } from './types';
import { cattleService, CattleFilters } from './services';
import { useToast } from '@/hooks/use-toast';

export const useCattle = (filters?: CattleFilters) => {
  const [cattle, setCattle] = useState<Cattle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const { toast } = useToast();

  const fetchCattle = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cattleService.getCattleList(filters);
      
      if (response.success) {
        setCattle(response.data);
        setTotal(response.total || response.data.length);
      } else {
        setError(response.message || 'Erreur lors du chargement des données');
        toast({
          variant: "destructive",
          title: "Erreur",
          description: response.message || 'Erreur lors du chargement des données'
        });
      }
    } catch (err) {
      const errorMessage = 'Erreur inattendue lors du chargement des données';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCattle();
  }, [JSON.stringify(filters)]); // Re-fetch when filters change

  const refreshCattle = () => {
    fetchCattle();
  };

  return {
    cattle,
    loading,
    error,
    total,
    refreshCattle
  };
};

export const useCattleById = (id: string) => {
  const [cattle, setCattle] = useState<Cattle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCattle = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await cattleService.getCattleById(id);
      
      if (response.success && response.data) {
        setCattle(response.data);
      } else {
        setError(response.message || 'Bovin non trouvé');
        setCattle(null);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: response.message || 'Bovin non trouvé'
        });
      }
    } catch (err) {
      const errorMessage = 'Erreur lors du chargement du bovin';
      setError(errorMessage);
      setCattle(null);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCattle();
  }, [id]);

  const refreshCattle = () => {
    fetchCattle();
  };

  return {
    cattle,
    loading,
    error,
    refreshCattle
  };
};