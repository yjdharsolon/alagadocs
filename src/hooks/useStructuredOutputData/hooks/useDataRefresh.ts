
import { useState, useRef } from 'react';

interface UseDataRefreshProps {
  isDataBeingModifiedDirectly: React.MutableRefObject<boolean>;
  lastDirectUpdateTime: React.MutableRefObject<number>;
  onRefresh: () => void;
}

/**
 * Hook to manage data refresh operations with throttling
 */
export const useDataRefresh = ({ 
  isDataBeingModifiedDirectly, 
  lastDirectUpdateTime,
  onRefresh
}: UseDataRefreshProps) => {
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = () => {
    const currentTime = Date.now();
    const timeSinceLastRefresh = currentTime - lastRefreshTime;
    const timeSinceLastDirectUpdate = currentTime - lastDirectUpdateTime.current;
    
    console.log(`[useDataRefresh] Data refresh requested - Time since last refresh: ${timeSinceLastRefresh}ms`);
    console.log(`[useDataRefresh] Time since last direct update: ${timeSinceLastDirectUpdate}ms`);
    
    if (isDataBeingModifiedDirectly.current) {
      console.log('[useDataRefresh] Skipping refresh because data is being modified directly');
      return;
    }
    
    if (isRefreshing) {
      console.log('[useDataRefresh] Refresh already in progress, ignoring request');
      return;
    }
    
    if (timeSinceLastRefresh < 500) {
      console.log('[useDataRefresh] Refresh throttled - too soon since last refresh');
      return;
    }
    
    if (timeSinceLastDirectUpdate < 2000) {
      console.log('[useDataRefresh] Refresh throttled - too soon after direct update');
      return;
    }
    
    console.log('[useDataRefresh] Executing refresh');
    setLastRefreshTime(currentTime);
    setIsRefreshing(true);
    
    onRefresh();
  };

  return {
    refreshData,
    isRefreshing,
    setIsRefreshing
  };
};
