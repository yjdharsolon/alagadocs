
// This file is maintained for backward compatibility
// It re-exports functionality from the new modular PDF system
import { MedicalSections } from '../types';
import { jsPDF } from 'jspdf';
import { exportAsPDF, exportPrescriptionAsPDF } from './pdf/index';

export { exportAsPDF, exportPrescriptionAsPDF };
