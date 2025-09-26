import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export interface FingerprintEnrollmentResult {
  success: boolean;
  message?: string;
  progress?: number;
  template?: string;
}

export interface FingerprintVerificationResult {
  success: boolean;
  message?: string;
  student?: any;
  attendance?: any;
  status?: string;
}

export function useFingerprintEnroll() {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const enrollMutation = useMutation({
    mutationFn: async (studentData: { studentId: string }) => {
      setIsEnrolling(true);
      setProgress(0);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 25;
        });
      }, 1000);

      try {
        const response = await apiRequest("POST", "/api/fingerprint/enroll", studentData);
        clearInterval(progressInterval);
        setProgress(100);
        return await response.json();
      } catch (error) {
        clearInterval(progressInterval);
        setProgress(0);
        throw error;
      }
    },
    onSuccess: (result: FingerprintEnrollmentResult) => {
      setIsEnrolling(false);
      if (result.success) {
        toast({
          title: "Fingerprint Enrolled",
          description: result.message || "Fingerprint has been successfully enrolled",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      } else {
        toast({
          title: "Enrollment Failed",
          description: result.message || "Failed to enroll fingerprint",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      setIsEnrolling(false);
      setProgress(0);
      toast({
        title: "Enrollment Error",
        description: error.message || "An error occurred during fingerprint enrollment",
        variant: "destructive",
      });
    },
  });

  const enrollFingerprint = async (studentData: { studentId: string }) => {
    await enrollMutation.mutateAsync(studentData);
  };

  const reset = () => {
    setIsEnrolling(false);
    setProgress(0);
  };

  return {
    enrollFingerprint,
    isEnrolling,
    progress,
    reset,
    error: enrollMutation.error,
  };
}

export function useFingerprintVerify() {
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const verifyMutation = useMutation({
    mutationFn: async () => {
      setIsVerifying(true);
      
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await apiRequest("POST", "/api/fingerprint/verify");
      return await response.json();
    },
    onSuccess: (result: FingerprintVerificationResult) => {
      setIsVerifying(false);
      if (result.success) {
        toast({
          title: "Attendance Recorded",
          description: `${result.student?.name} marked as ${result.status}`,
        });
        
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ["/api/attendance/today"] });
        queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      } else {
        toast({
          title: "Verification Failed",
          description: result.message || "No matching fingerprint found",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      setIsVerifying(false);
      toast({
        title: "Scanner Error",
        description: error.message || "Failed to verify fingerprint. Please try again.",
        variant: "destructive",
      });
    },
  });

  const verifyFingerprint = async () => {
    return await verifyMutation.mutateAsync();
  };

  return {
    verifyFingerprint,
    isVerifying,
    error: verifyMutation.error,
    result: verifyMutation.data,
  };
}

export function useFingerprintTest() {
  const { toast } = useToast();

  const testMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/fingerprint/test");
      return await response.json();
    },
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: "Scanner Test Successful",
          description: "Fingerprint scanner is connected and working properly",
        });
      } else {
        toast({
          title: "Scanner Test Failed",
          description: result.message || "Could not connect to fingerprint scanner",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Connection Error",
        description: error.message || "Failed to test scanner connection",
        variant: "destructive",
      });
    },
  });

  return {
    testConnection: testMutation.mutate,
    isTesting: testMutation.isPending,
    result: testMutation.data,
  };
}
