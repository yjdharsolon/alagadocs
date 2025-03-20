import { useState, useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { MedicalSections } from '@/components/structured-output/types';
import { getStructuredNoteById } from '@/services/structuredNoteService';

interface UseNoteLoaderProps {
  patientInfo: {
    id: string | null;
    name: string | null;
  };
}

export const useNoteLoader = ({ patientInfo }: UseNoteLoaderProps) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const noteId = searchParams.get('noteId');
  
  const [loading, setLoading] = useState(true);
  const [processingText, setProcessingText] = useState(false);
  const [structuredData, setStructuredData] = useState<MedicalSections | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dataRefreshKey, setDataRefreshKey] = useState(0);
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFirstLoad = useRef(true);
  const lastLoadedData = useRef<any>(null);
  
  const transcriptionData = location.state?.transcriptionData;
  const audioUrl = location.state?.audioUrl;
  const transcriptionId = location.state?.transcriptionId;

  console.log(`[useNoteLoader] Initialized with noteId: ${noteId}, transcriptionId: ${transcriptionId}`);

  const isDataBeingModifiedDirectly = useRef(false);
  const lastDirectUpdateTime = useRef(Date.now());

  const normalizeMedicationData = (medications: any[]): any[] => {
    if (!medications || !Array.isArray(medications)) return [];
    
    console.log('[useNoteLoader] Normalizing medication data:', JSON.stringify(medications, null, 2));
    
    return medications.map((med, index) => {
      if (typeof med === 'string') {
        return {
          id: index + 1,
          genericName: med,
          brandName: '',
          strength: '',
          dosageForm: '',
          sigInstructions: '',
          quantity: '',
          refills: '',
          specialInstructions: ''
        };
      }
      
      return {
        id: med.id || index + 1,
        genericName: med.genericName || med.name || '',
        brandName: med.brandName || '',
        strength: med.strength || '',
        dosageForm: med.dosageForm || '',
        sigInstructions: med.sigInstructions || '',
        quantity: med.quantity || '',
        refills: med.refills || '',
        specialInstructions: med.specialInstructions || ''
      };
    });
  };

  const setStructuredDataSafely = (data: MedicalSections | null) => {
    isDataBeingModifiedDirectly.current = true;
    lastDirectUpdateTime.current = Date.now();
    
    console.log('[useNoteLoader] Setting structured data safely:', 
      data ? JSON.stringify({
        hasPatientInfo: !!data.patientInformation,
        medicationsCount: data.medications ? 
          (Array.isArray(data.medications) ? data.medications.length : 'not array') : 
          'none',
        keys: Object.keys(data)
      }) : 'null');
    
    if (data?.medications) {
      console.log('[useNoteLoader] Medications in safely set data:', 
        Array.isArray(data.medications) ? 
          JSON.stringify(data.medications, null, 2) : 
          data.medications);
    }
    
    setStructuredData(data);
    
    setTimeout(() => {
      console.log('[useNoteLoader] Reset direct modification flag');
      isDataBeingModifiedDirectly.current = false;
    }, 1000);
  };

  const refreshData = () => {
    const currentTime = Date.now();
    const timeSinceLastRefresh = currentTime - lastRefreshTime;
    const timeSinceLastDirectUpdate = currentTime - lastDirectUpdateTime.current;
    
    console.log(`[useNoteLoader] Data refresh requested - Time since last refresh: ${timeSinceLastRefresh}ms`);
    console.log(`[useNoteLoader] Time since last direct update: ${timeSinceLastDirectUpdate}ms`);
    
    if (isDataBeingModifiedDirectly.current) {
      console.log('[useNoteLoader] Skipping refresh because data is being modified directly');
      return;
    }
    
    if (isRefreshing) {
      console.log('[useNoteLoader] Refresh already in progress, ignoring request');
      return;
    }
    
    if (timeSinceLastRefresh < 500) {
      console.log('[useNoteLoader] Refresh throttled - too soon since last refresh');
      return;
    }
    
    if (timeSinceLastDirectUpdate < 2000) {
      console.log('[useNoteLoader] Refresh throttled - too soon after direct update');
      return;
    }
    
    console.log('[useNoteLoader] Executing refresh - incrementing refresh key');
    setDataRefreshKey(prev => prev + 1);
    setLastRefreshTime(currentTime);
    setError(null);
  };

  useEffect(() => {
    if (isDataBeingModifiedDirectly.current) {
      console.log('[useNoteLoader] Skipping data load because data is being modified directly');
      return;
    }
    
    const loadNote = async () => {
      setIsRefreshing(true);
      
      try {
        console.log(`[useNoteLoader] Loading data with noteId: ${noteId}, refreshKey: ${dataRefreshKey}, isFirstLoad: ${isFirstLoad.current}`);
        
        if (noteId) {
          try {
            console.log(`[useNoteLoader] Loading note with ID: ${noteId}`);
            setLoading(true);
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const note = await getStructuredNoteById(noteId);
            
            const lastDataStr = lastLoadedData.current ? JSON.stringify(lastLoadedData.current) : null;
            const newDataStr = note?.content ? JSON.stringify(note.content) : null;
            
            if (lastDataStr === newDataStr && !isFirstLoad.current) {
              console.log('[useNoteLoader] Received identical data from database, skipping update');
              setLoading(false);
              return;
            }
            
            if (note?.content) {
              console.log('[useNoteLoader] Loaded note from database:', JSON.stringify({
                hasPatientInfo: !!note.content.patientInformation,
                medicationsCount: note.content.medications ? 
                  (Array.isArray(note.content.medications) ? note.content.medications.length : 'not array') : 
                  'none',
                keys: Object.keys(note.content)
              }));
              
              const contentCopy = JSON.parse(JSON.stringify(note.content));
              lastLoadedData.current = contentCopy;
              
              if (contentCopy.medications) {
                console.log('[useNoteLoader] Original loaded medications:', JSON.stringify(contentCopy.medications, null, 2));
                contentCopy.medications = normalizeMedicationData(contentCopy.medications);
                console.log('[useNoteLoader] Normalized loaded medications:', JSON.stringify(contentCopy.medications, null, 2));
              }
              
              setStructuredData(contentCopy);
            } else {
              console.error('[useNoteLoader] Note not found for ID:', noteId);
              setError('Note not found');
            }
          } catch (error) {
            console.error('[useNoteLoader] Error loading note:', error);
            setError('Error loading note');
          } finally {
            setLoading(false);
          }
        } else if (location.state?.structuredData) {
          console.log('[useNoteLoader] Using structured data from location state:', JSON.stringify({
            hasPatientInfo: !!location.state.structuredData.patientInformation,
            medicationsCount: location.state.structuredData.medications ? 
              (Array.isArray(location.state.structuredData.medications) ? location.state.structuredData.medications.length : 'not array') : 
              'none',
            keys: Object.keys(location.state.structuredData)
          }));
          
          const contentCopy = JSON.parse(JSON.stringify(location.state.structuredData));
          lastLoadedData.current = contentCopy;
          
          if (contentCopy.medications) {
            console.log('[useNoteLoader] Original state medications:', JSON.stringify(contentCopy.medications, null, 2));
            contentCopy.medications = normalizeMedicationData(contentCopy.medications);
            console.log('[useNoteLoader] Normalized state medications:', JSON.stringify(contentCopy.medications, null, 2));
          }
          
          setStructuredData(contentCopy);
          setLoading(false);
        } else if (transcriptionData && transcriptionData.text) {
          console.log('[useNoteLoader] Has transcription data, waiting for processing');
          setLoading(false);
        } else {
          console.log('[useNoteLoader] No note data sources found');
          setLoading(false);
          setError('No transcription data found');
        }
        
        isFirstLoad.current = false;
      } finally {
        setIsRefreshing(false);
      }
    };

    loadNote();
  }, [noteId, location.state, transcriptionData, dataRefreshKey]);

  return {
    loading,
    setLoading,
    processingText,
    setProcessingText,
    structuredData,
    setStructuredData: setStructuredDataSafely,
    error,
    setError,
    transcriptionData,
    audioUrl,
    transcriptionId,
    location,
    noteId,
    refreshData,
    isRefreshing,
    isDataBeingModifiedDirectly: isDataBeingModifiedDirectly.current
  };
};
