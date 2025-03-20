
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

  // Enhanced function to force a data refresh with improved logging and throttling
  const refreshData = () => {
    const currentTime = Date.now();
    const timeSinceLastRefresh = currentTime - lastRefreshTime;
    
    console.log(`[useNoteLoader] Data refresh requested - Time since last refresh: ${timeSinceLastRefresh}ms`);
    
    // Check if refresh is already in progress
    if (isRefreshing) {
      console.log('[useNoteLoader] Refresh already in progress, ignoring request');
      return;
    }
    
    // Throttle refreshes to prevent multiple rapid refreshes
    if (timeSinceLastRefresh < 500) {
      console.log('[useNoteLoader] Refresh throttled - too soon since last refresh');
      return;
    }
    
    console.log('[useNoteLoader] Executing refresh - incrementing refresh key');
    // Force UI to update by incrementing the refresh key
    setDataRefreshKey(prev => prev + 1);
    setLastRefreshTime(currentTime);
    // Clear any existing errors on refresh
    setError(null);
  };

  // Normalize medication data to ensure consistent structure
  const normalizeMedicationData = (medications: any[]): any[] => {
    if (!medications || !Array.isArray(medications)) return [];
    
    console.log('[useNoteLoader] Normalizing medication data:', JSON.stringify(medications, null, 2));
    
    return medications.map((med, index) => {
      // Handle string medications
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
      
      // Handle medication objects - ensure all required properties exist
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

  // Track if data is being modified directly to prevent race conditions
  const isDataBeingModifiedDirectly = useRef(false);

  // Function to safely set structured data that won't be overwritten by refreshes
  const setStructuredDataSafely = (data: MedicalSections | null) => {
    isDataBeingModifiedDirectly.current = true;
    console.log('[useNoteLoader] Setting structured data safely:', 
      data ? JSON.stringify({
        hasPatientInfo: !!data.patientInformation,
        medicationsCount: data.medications ? 
          (Array.isArray(data.medications) ? data.medications.length : 'not array') : 
          'none',
        keys: Object.keys(data)
      }) : 'null');
    
    setStructuredData(data);
    
    // Reset the flag after a short delay to allow state to settle
    setTimeout(() => {
      isDataBeingModifiedDirectly.current = false;
      console.log('[useNoteLoader] Reset direct modification flag');
    }, 500);
  };

  // Load data on component mount or when refreshData is called
  useEffect(() => {
    // Skip if data is being modified directly
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
            
            // Add a longer delay to ensure database consistency
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const note = await getStructuredNoteById(noteId);
            
            // Compare with last loaded data to detect changes
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
              
              // Create a deep copy of the content to avoid reference issues
              const contentCopy = JSON.parse(JSON.stringify(note.content));
              lastLoadedData.current = contentCopy;
              
              // Normalize medication data specifically
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
          
          // Deep copy and normalize the location state data
          const contentCopy = JSON.parse(JSON.stringify(location.state.structuredData));
          lastLoadedData.current = contentCopy;
          
          // Normalize medication data
          if (contentCopy.medications) {
            console.log('[useNoteLoader] Original state medications:', JSON.stringify(contentCopy.medications, null, 2));
            contentCopy.medications = normalizeMedicationData(contentCopy.medications);
            console.log('[useNoteLoader] Normalized state medications:', JSON.stringify(contentCopy.medications, null, 2));
          }
          
          setStructuredData(contentCopy);
          setLoading(false);
        } else if (transcriptionData && transcriptionData.text) {
          // Just mark as not loading - processTranscription will be called separately
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
    setStructuredData: setStructuredDataSafely,  // Use our safe version
    error,
    setError,
    transcriptionData,
    audioUrl,
    transcriptionId,
    location,
    noteId,
    refreshData,
    isRefreshing
  };
};
