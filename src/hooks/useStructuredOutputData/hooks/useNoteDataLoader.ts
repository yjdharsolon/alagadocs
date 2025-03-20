
import { useState, useEffect, useRef } from 'react';
import { MedicalSections } from '@/components/structured-output/types';
import { getStructuredNoteById } from '@/services/structuredNoteService';
import { normalizeMedicationData } from '../utils/dataNormalizers';

interface UseNoteDataLoaderProps {
  noteId: string | null;
  setStructuredData: (data: MedicalSections | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsRefreshing: (refreshing: boolean) => void;
  isDataBeingModifiedDirectly: React.MutableRefObject<boolean>;
  locationState: any;
}

/**
 * Hook to handle loading note data from different sources
 */
export const useNoteDataLoader = ({
  noteId,
  setStructuredData,
  setLoading,
  setError,
  setIsRefreshing,
  isDataBeingModifiedDirectly,
  locationState
}: UseNoteDataLoaderProps) => {
  const isFirstLoad = useRef(true);
  const lastLoadedData = useRef<any>(null);
  
  const loadNote = async (refreshKey: number) => {
    if (isDataBeingModifiedDirectly.current) {
      console.log('[useNoteDataLoader] Skipping data load because data is being modified directly');
      return;
    }
    
    setIsRefreshing(true);
    
    try {
      console.log(`[useNoteDataLoader] Loading data with noteId: ${noteId}, refreshKey: ${refreshKey}, isFirstLoad: ${isFirstLoad.current}`);
      
      if (noteId) {
        try {
          console.log(`[useNoteDataLoader] Loading note with ID: ${noteId}`);
          setLoading(true);
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const note = await getStructuredNoteById(noteId);
          
          const lastDataStr = lastLoadedData.current ? JSON.stringify(lastLoadedData.current) : null;
          const newDataStr = note?.content ? JSON.stringify(note.content) : null;
          
          if (lastDataStr === newDataStr && !isFirstLoad.current) {
            console.log('[useNoteDataLoader] Received identical data from database, skipping update');
            setLoading(false);
            return;
          }
          
          if (note?.content) {
            console.log('[useNoteDataLoader] Loaded note from database:', JSON.stringify({
              hasPatientInfo: !!note.content.patientInformation,
              medicationsCount: note.content.medications ? 
                (Array.isArray(note.content.medications) ? note.content.medications.length : 'not array') : 
                'none',
              keys: Object.keys(note.content)
            }));
            
            const contentCopy = JSON.parse(JSON.stringify(note.content));
            lastLoadedData.current = contentCopy;
            
            if (contentCopy.medications) {
              console.log('[useNoteDataLoader] Original loaded medications:', JSON.stringify(contentCopy.medications, null, 2));
              contentCopy.medications = normalizeMedicationData(contentCopy.medications);
              console.log('[useNoteDataLoader] Normalized loaded medications:', JSON.stringify(contentCopy.medications, null, 2));
            }
            
            setStructuredData(contentCopy);
          } else {
            console.error('[useNoteDataLoader] Note not found for ID:', noteId);
            setError('Note not found');
          }
        } catch (error) {
          console.error('[useNoteDataLoader] Error loading note:', error);
          setError('Error loading note');
        } finally {
          setLoading(false);
        }
      } else if (locationState?.structuredData) {
        console.log('[useNoteDataLoader] Using structured data from location state:', JSON.stringify({
          hasPatientInfo: !!locationState.structuredData.patientInformation,
          medicationsCount: locationState.structuredData.medications ? 
            (Array.isArray(locationState.structuredData.medications) ? locationState.structuredData.medications.length : 'not array') : 
            'none',
          keys: Object.keys(locationState.structuredData)
        }));
        
        const contentCopy = JSON.parse(JSON.stringify(locationState.structuredData));
        lastLoadedData.current = contentCopy;
        
        if (contentCopy.medications) {
          console.log('[useNoteDataLoader] Original state medications:', JSON.stringify(contentCopy.medications, null, 2));
          contentCopy.medications = normalizeMedicationData(contentCopy.medications);
          console.log('[useNoteDataLoader] Normalized state medications:', JSON.stringify(contentCopy.medications, null, 2));
        }
        
        setStructuredData(contentCopy);
        setLoading(false);
      } else if (locationState?.transcriptionData && locationState.transcriptionData.text) {
        console.log('[useNoteDataLoader] Has transcription data, waiting for processing');
        setLoading(false);
      } else {
        console.log('[useNoteDataLoader] No note data sources found');
        setLoading(false);
        setError('No transcription data found');
      }
      
      isFirstLoad.current = false;
    } finally {
      setIsRefreshing(false);
    }
  };

  return { loadNote };
};
