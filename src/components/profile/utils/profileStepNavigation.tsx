import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Clock, ArrowLeft, ArrowRight } from 'lucide-react';

interface ProfileStepNavigationProps {
  currentStep: number;
  totalSteps: number;
  loading: boolean;
  onPrevious: () => void;
  onSaveAndNext: () => void;
  onComplete: () => void;
  onSkip: () => void;
  canComplete?: boolean;
  completionText?: string;
}

export const ProfileStepNavigation: React.FC<ProfileStepNavigationProps> = ({
  currentStep,
  totalSteps,
  loading,
  onPrevious,
  onSaveAndNext,
  onComplete,
  onSkip,
  canComplete = false,
  completionText = 'Complete Profile'
}) => {
  const isLastStep = currentStep >= totalSteps - 1;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex gap-3 flex-1">
        {/* Previous Button */}
        {currentStep > 0 && (
          <Button 
            variant="outline" 
            onClick={onPrevious}
            disabled={loading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
        )}
        
        {/* Save and Next / Complete Button */}
        {!isLastStep ? (
          <Button 
            onClick={onSaveAndNext}
            disabled={loading}
          >
            {loading ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save and Next
              </>
            )}
          </Button>
        ) : (
          <Button 
            onClick={onComplete}
            disabled={loading}
          >
            {loading ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Completing...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {canComplete ? completionText : 'Save Progress'}
              </>
            )}
          </Button>
        )}
      </div>
      
      {/* Skip Button */}
      <Button variant="outline" onClick={onSkip} disabled={loading}>
        <Clock className="h-4 w-4 mr-2" />
        Skip for Now
      </Button>
    </div>
  );
};

// Hook for managing profile step state and save functionality
export const useProfileStepNavigation = (
  totalSteps: number,
  onComplete: () => void,
  saveProfileData: (data: Record<string, unknown>, step?: number) => Promise<void>
) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAndNext = async (formData: Record<string, unknown>) => {
    setLoading(true);
    try {
      await saveProfileData(formData, currentStep + 1);
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Failed to save and proceed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (formData: Record<string, unknown>) => {
    setLoading(true);
    try {
      await saveProfileData(formData, totalSteps);
      onComplete();
    } catch (error) {
      console.error('Failed to complete profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    loading,
    handlePrevious,
    handleSaveAndNext,
    handleComplete
  };
};
