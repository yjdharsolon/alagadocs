
import { useState, useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { MedicalSections } from '@/components/structured-output/types';
import { useDataModifier } from './hooks/useDataModifier';
import { useDataRefresh } from './hooks/useDataRefresh';
import { useNoteDataLoader } from './hooks/useNoteDataLoader';

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const transcriptionData = location.state?.transcriptionData;
  const audioUrl = location.state?.audioUrl;
  const transcriptionId = location.state?.transcriptionId;

  console.log(`[useNoteLoader] Initialized with noteId: ${noteId}, transcriptionId: ${transcriptionId}`);

  // Get data modifier hook for safe data updates
  const { 
    setStructuredDataSafely, 
    isDataBeingModifiedDirectly, 
    lastDirectUpdateTime 
  } = useDataModifier();

  // Setup refresh handler
  const triggerRefresh = () => {
    console.log('[useNoteLoader] Executing refresh - incrementing refresh key');
    setDataRefreshKey(prev => prev + 1);
    setError(null);
  };

  // Get data refresh hook
  const { 
    refreshData, 
    isRefreshing: refreshInProgress,
    setIsRefreshing: setRefreshInProgress
  } = useDataRefresh({
    isDataBeingModifiedDirectly,
    lastDirectUpdateTime,
    onRefresh: triggerRefresh
  });

  // Get data loader hook
  const { loadNote } = useNoteDataLoader({
    noteId,
    setStructuredData,
    setLoading,
    setError,
    setIsRefreshing: setRefreshInProgress,
    isDataBeingModifiedDirectly,
    locationState: location.state
  });

  // Set structured data safely (middleware)
  const setStructuredDataWrapper = (data: MedicalSections | null) => {
    const processedData = setStructuredDataSafely(data);
    setStructuredData(processedData);
  };

  // Load data when refreshKey changes or component mounts
  useEffect(() => {
    loadNote(dataRefreshKey);
  }, [dataRefreshKey, location.state, transcriptionData, noteId]);

  return {
    loading,
    setLoading,
    processingText,
    setProcessingText,
    structuredData,
    setStructuredData: setStructuredDataWrapper,
    error,
    setError,
    transcriptionData,
    audioUrl,
    transcriptionId,
    location,
    noteId,
    refreshData,
    isRefreshing: refreshInProgress,
    isDataBeingModifiedDirectly: isDataBeingModifiedDirectly.current
  };
};
