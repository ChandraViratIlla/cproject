"use client";
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Clock, CheckCircle, Users, Brain, Target, Lightbulb, Heart, TrendingUp } from 'lucide-react';
import { Suspense } from 'react';

const SelectAssessmentsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract consent form data
  const consentData = {
    name: searchParams.get('name') || 'Not Provided',
    studentSignature: searchParams.get('studentSignature') || 'Not Provided',
    counselorSignature: searchParams.get('counselorSignature') || 'Not Provided',
    signatureDate: searchParams.get('signatureDate') || 'Not Provided',
  };

  // Define available assessments with enhanced metadata
  const assessments = [
    { 
      id: 'assessment-1', 
      name: 'Assessment-1: Social Skills',
      description: 'Evaluate your interpersonal communication and relationship-building abilities',
      icon: Users,
      estimatedTime: '10-15 min',
      category: 'Interpersonal'
    },
    { 
      id: 'assessment-2', 
      name: 'Assessment-2: Emotional Awareness',
      description: 'Assess your ability to recognize and understand emotions in yourself and others',
      icon: Heart,
      estimatedTime: '8-12 min',
      category: 'Emotional Intelligence'
    },
    { 
      id: 'assessment-3', 
      name: 'Assessment-3: Stress Management',
      description: 'Measure your coping strategies and stress resilience techniques',
      icon: Brain,
      estimatedTime: '12-18 min',
      category: 'Wellness'
    },
    { 
      id: 'assessment-4', 
      name: 'Assessment-4: Team Dynamics',
      description: 'Analyze your collaboration skills and team interaction patterns',
      icon: Users,
      estimatedTime: '10-15 min',
      category: 'Collaboration'
    },
    { 
      id: 'assessment-5', 
      name: 'Assessment-5: Motivation and Goals',
      description: 'Explore your drive, ambitions, and goal-setting capabilities',
      icon: Target,
      estimatedTime: '15-20 min',
      category: 'Personal Development'
    },
    { 
      id: 'assessment-6', 
      name: 'Assessment-6: Problem Solving',
      description: 'Evaluate your analytical thinking and solution-finding approaches',
      icon: Lightbulb,
      estimatedTime: '12-16 min',
      category: 'Cognitive Skills'
    },
  ];

  // State to track selected assessments
  const [selectedAssessments, setSelectedAssessments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  // Calculate total estimated time
  const getTotalEstimatedTime = () => {
    const totalMinutes = selectedAssessments.reduce((total, id) => {
      const assessment = assessments.find(a => a.id === id);
      if (assessment) {
        const timeRange = assessment.estimatedTime.match(/(\d+)-(\d+)/);
        if (timeRange) {
          const avgTime = (parseInt(timeRange[1]) + parseInt(timeRange[2])) / 2;
          return total + avgTime;
        }
      }
      return total;
    }, 0);
    
    return Math.round(totalMinutes);
  };

  const handleCheckboxChange = (assessmentId: string) => {
    setSelectedAssessments((prev) => {
      if (prev.includes(assessmentId)) {
        return prev.filter((id) => id !== assessmentId);
      } else {
        return [...prev, assessmentId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedAssessments.length === assessments.length) {
      setSelectedAssessments([]);
    } else {
      setSelectedAssessments(assessments.map(a => a.id));
    }
  };

  const handleProceed = async () => {
    if (selectedAssessments.length === 0) {
      toast.error('Please select at least one assessment to proceed.');
      return;
    }

    setIsLoading(true);
    setShowProgress(true);

    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Sort selected assessments in order (e.g., assessment-1, assessment-3, assessment-4)
    const sortedAssessments = selectedAssessments.sort((a, b) => {
      const indexA = assessments.findIndex((assess) => assess.id === a);
      const indexB = assessments.findIndex((assess) => assess.id === b);
      return indexA - indexB;
    });

    // Pass consent data and selected assessments to the first assessment page
    const query = new URLSearchParams({
      name: consentData.name,
      studentSignature: consentData.studentSignature,
      counselorSignature: consentData.counselorSignature,
      signatureDate: consentData.signatureDate,
      selectedAssessments: sortedAssessments.join(','),
      currentAssessmentIndex: '0', // Start with the first selected assessment
      numAssessments: sortedAssessments.length.toString(),
    }).toString();

    toast.success(`Proceeding to ${selectedAssessments.length} assessment${selectedAssessments.length > 1 ? 's' : ''}...`);
    router.push(`/assessment/${sortedAssessments[0]}?${query}`);
  };

  // Group assessments by category
  const groupedAssessments = assessments.reduce((groups, assessment) => {
    const category = assessment.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(assessment);
    return groups;
  }, {} as Record<string, typeof assessments>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress indicator */}
        {showProgress && (
          <div className="mb-6">
            <Progress value={isLoading ? 100 : 0} className="h-2" />
          </div>
        )}

        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold">
              Select Your Assessments
            </CardTitle>
            <div className="mt-3 space-y-2">
              <p className="text-xl font-semibold text-blue-100">Aditya University</p>
              <p className="text-blue-200">Counseling & Wellness Center</p>
              <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-white/30">
                Confidential Assessment Suite
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-8">
            {/* Welcome message */}
            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Welcome, <strong>{consentData.name}</strong>! Please select the assessments you‘d like to complete. 
                You‘ll work through them in numerical order for the best experience.
              </AlertDescription>
            </Alert>

            {/* Selection summary */}
            {selectedAssessments.length > 0 && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">
                      {selectedAssessments.length} assessment{selectedAssessments.length > 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-green-700">
                    <Clock className="h-4 w-4" />
                    <span>Estimated time: {getTotalEstimatedTime()} minutes</span>
                  </div>
                </div>
              </div>
            )}

            {/* Select all toggle */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Available Assessments</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                {selectedAssessments.length === assessments.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            {/* Assessment grid */}
            <div className="space-y-6">
              {Object.entries(groupedAssessments).map(([category, categoryAssessments]) => (
                <div key={category}>
                  <h4 className="text-md font-medium text-gray-700 mb-3 px-2">{category}</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {categoryAssessments.map((assessment) => {
                      const IconComponent = assessment.icon;
                      const isSelected = selectedAssessments.includes(assessment.id);
                      
                      return (
                        <Card 
                          key={assessment.id} 
                          className={`transition-all duration-200 cursor-pointer hover:shadow-md ${
                            isSelected 
                              ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                              : 'hover:border-gray-300 bg-white'
                          }`}
                          onClick={() => handleCheckboxChange(assessment.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <Checkbox
                                id={assessment.id}
                                checked={isSelected}
                                onCheckedChange={() => handleCheckboxChange(assessment.id)}
                                className="mt-1"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-2">
                                  <IconComponent className={`h-5 w-5 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                                  <Label 
                                    htmlFor={assessment.id} 
                                    className={`font-medium cursor-pointer ${isSelected ? 'text-blue-800' : 'text-gray-800'}`}
                                  >
                                    {assessment.name.replace('Assessment-', 'Assessment ')}
                                  </Label>
                                </div>
                                <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                                  {assessment.description}
                                </p>
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  <span>{assessment.estimatedTime}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                  {Object.keys(groupedAssessments).indexOf(category) < Object.keys(groupedAssessments).length - 1 && (
                    <Separator className="mt-6" />
                  )}
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="order-2 sm:order-1"
                disabled={isLoading}
              >
                Back to Consent Form
              </Button>
              <Button
                onClick={handleProceed}
                disabled={selectedAssessments.length === 0 || isLoading}
                className="order-1 sm:order-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Preparing Assessments...</span>
                  </div>
                ) : (
                  `Begin ${selectedAssessments.length > 0 ? selectedAssessments.length : ''} Assessment${selectedAssessments.length !== 1 ? 's' : ''}`
                )}
              </Button>
            </div>

            {/* Footer info */}
            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                All responses are confidential and will be used solely for counseling purposes.
                <br />
                You can take breaks between assessments if needed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Wrap the component in Suspense at the page level
export default function SelectAssessmentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading assessment selection...</div>}>
      <SelectAssessmentsContent />
    </Suspense>
  );
}