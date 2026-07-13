import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Cattle } from './types';
import { getTypeEvenementName } from '@/features/events/utils';
import { getMedicamentName, getVeterinarianName } from '@/features/treatments/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatDosage } from './utils/dosageUtils';

export class CattleExportService {
  exportToPdf(cattle: Cattle): void {
    const doc = new jsPDF();

    // Titre
    doc.setFontSize(20);
    doc.text('Fiche Détaillée du Bovin', 14, 20);

    // Informations générales
    doc.setFontSize(16);
    doc.text('Informations Générales', 14, 35);

    doc.setFontSize(11);
    let yPos = 45;

    doc.text(`ID: ${cattle.id}`, 14, yPos);
    yPos += 7;
    doc.text(`Nom: ${cattle.name}`, 14, yPos);
    yPos += 7;
    doc.text(`Genre: ${cattle.gender === 'M' ? 'Mâle' : 'Femelle'}`, 14, yPos);
    yPos += 7;
    doc.text(`Date de naissance: ${format(new Date(cattle.birthDate), 'dd MMMM yyyy', { locale: fr })}`, 14, yPos);
    yPos += 7;
    doc.text(`Caractère: ${cattle.character.name}`, 14, yPos);
    yPos += 10;

    // Source
    doc.setFontSize(16);
    doc.text('Source', 14, yPos);
    yPos += 10;

    doc.setFontSize(11);
    doc.text(`Type: ${cattle.source.type}`, 14, yPos);
    yPos += 7;

    if (cattle.source.type === 'Acheté') {
      if (cattle.source.supplier) {
        doc.text(`Fournisseur: ${cattle.source.supplier}`, 14, yPos);
        yPos += 7;
      }
      if (cattle.source.purchaseDate) {
        doc.text(`Date d'achat: ${format(new Date(cattle.source.purchaseDate), 'dd MMMM yyyy', { locale: fr })}`, 14, yPos);
        yPos += 7;
      }
      if (cattle.source.purchasePrice) {
        doc.text(`Prix d'achat: ${cattle.source.purchasePrice.toLocaleString('fr-FR')} FCFA`, 14, yPos);
        yPos += 7;
      }
      if (cattle.source.purchaseWeight) {
        doc.text(`Poids à l'achat: ${cattle.source.purchaseWeight} kg`, 14, yPos);
        yPos += 7;
      }
    }

    // Historique des événements
    if (cattle.events && cattle.events.length > 0) {
      yPos += 5;

      doc.setFontSize(16);
      doc.text('Historique des Événements', 14, yPos);
      yPos += 5;

      const eventsData = cattle.events.map(event => [
        format(new Date(event.date), 'dd/MM/yyyy', { locale: fr }),
        getTypeEvenementName(event.type.toString()),
        event.description,
        event.details || '-'
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['Date', 'Type', 'Description', 'Détails']],
        body: eventsData,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
        margin: { left: 14, right: 14 },
        styles: { fontSize: 9 }
      });

      yPos = (doc as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY + 10 || yPos;
    }

    // Historique des traitements
    if (cattle.treatments && cattle.treatments.length > 0) {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(16);
      doc.text('Historique des Traitements', 14, yPos);
      yPos += 5;

      const treatmentsData = cattle.treatments.map(treatment => [
        format(new Date(treatment.date), 'dd/MM/yyyy', { locale: fr }),
        treatment.type,
        getMedicamentName(treatment.product.toString()),
        formatDosage(treatment.dosage),
        getVeterinarianName(treatment.veterinarian.toString()),
        treatment.notes || '-'
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['Date', 'Type', 'Produit', 'Dose', 'Intervenant', 'Notes']],
        body: treatmentsData,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
        margin: { left: 14, right: 14 },
        styles: { fontSize: 8 }
      });
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.text(
        `Page ${i} sur ${pageCount} - Généré le ${format(new Date(), 'dd/MM/yyyy à HH:mm', { locale: fr })}`,
        14,
        doc.internal.pageSize.height - 10
      );
    }

    // Télécharger le PDF
    doc.save(`bovin-${cattle.id}-${cattle.name}.pdf`);
  }
}

export const cattleExportService = new CattleExportService();
