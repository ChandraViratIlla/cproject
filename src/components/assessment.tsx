"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  Lock,
  Users,
  Brain,
  Target,
  Lightbulb,
} from "lucide-react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";

// Assessment questions with icons
const assessmentQuestions: {
  [key: string]: {
    name: string;
    questions: string[];
    icon: React.ReactNode;
    color: string;
    gradient: string;
  };
} = {
  "assessment-1": {
    name: "Social Skills",
    icon: <Users className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    gradient: "from-blue-50 to-cyan-50",
    questions: [
      "I feel confident initiating conversations with new people.",
      "I find it easy to maintain eye contact during discussions.",
      "I often feel uncomfortable in group social settings.",
      "I actively listen and respond to others' perspectives.",
      "I struggle to express my thoughts clearly in social interactions.",
      "I adapt my communication style to suit different social situations.",
      "I feel at ease when meeting new classmates or colleagues.",
      "I find it challenging to build rapport with people I don’t know well.",
    ],
  },
  "assessment-2": {
    name: "Emotional Awareness",
    icon: <Brain className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
    gradient: "from-purple-50 to-pink-50",
    questions: [
      "I can accurately identify my emotions in challenging situations.",
      "I frequently feel overwhelmed by intense emotions.",
      "I am aware of how my emotions influence my behavior.",
      "I can easily recognize the emotions of others around me.",
      "I find it difficult to name my feelings when upset.",
      "I understand how my emotions affect my decision-making process.",
      "I can distinguish between similar emotions, like sadness and frustration.",
      "I struggle to empathize with others’ emotional experiences.",
    ],
  },
  "assessment-3": {
    name: "Stress Management",
    icon: <Circle className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500",
    gradient: "from-green-50 to-emerald-50",
    questions: [
      "I use effective strategies to manage stress during exams.",
      "I often feel anxious even in low-pressure situations.",
      "I practice mindfulness or relaxation techniques regularly.",
      "I find it challenging to stay calm under tight deadlines.",
      "I recover quickly after experiencing a stressful event.",
      "I feel confident in my ability to prioritize tasks during stressful times.",
      "I tend to procrastinate when faced with stressful responsibilities.",
      "I use positive self-talk to cope with stressful situations.",
    ],
  },
  "assessment-4": {
    name: "Team Dynamics",
    icon: <Users className="w-6 h-6" />,
    color: "from-orange-500 to-red-500",
    gradient: "from-orange-50 to-red-50",
    questions: [
      "I feel comfortable contributing ideas in group projects.",
      "I often take a leadership role in team settings.",
      "I find it difficult to work with team members who disagree with me.",
      "I actively support my teammates to achieve group goals.",
      "I struggle to resolve conflicts within a team.",
      "I value the diverse perspectives of my team members.",
      "I feel frustrated when team members do not meet expectations.",
      "I communicate clearly to ensure team tasks are completed effectively.",
    ],
  },
  "assessment-5": {
    name: "Motivation and Goals",
    icon: <Target className="w-6 h-6" />,
    color: "from-indigo-500 to-blue-500",
    gradient: "from-indigo-50 to-blue-50",
    questions: [
      "I set specific and achievable goals for my academic success.",
      "I maintain motivation even when tasks are challenging.",
      "I often lose focus on my long-term objectives.",
      "I regularly review my progress toward my goals.",
      "I feel confident in my ability to achieve my aspirations.",
      "I find it easy to stay committed to my academic priorities.",
      "I feel discouraged when I encounter setbacks in my goals.",
      "I seek opportunities to develop skills that support my goals.",
    ],
  },
  "assessment-6": {
    name: "Problem Solving",
    icon: <Lightbulb className="w-6 h-6" />,
    color: "from-yellow-500 to-amber-500",
    gradient: "from-yellow-50 to-amber-50",
    questions: [
      "I approach problems with a structured and logical mindset.",
      "I feel overwhelmed when faced with complex challenges.",
      "I generate creative solutions to difficult problems.",
      "I seek feedback or assistance when solving problems.",
      "I make decisions confidently after considering alternatives.",
      "I break down complex problems into manageable parts.",
      "I struggle to find effective solutions under time pressure.",
      "I reflect on past solutions to improve my problem-solving approach.",
    ],
  },
};

// Form schema
const formSchema = (numQuestions: number) =>
  z.object({
    answers: z
      .array(z.string().min(1, "Please select an option for each question"))
      .length(numQuestions, `Please answer all ${numQuestions} questions`),
  });

type FormValues = {
  answers: string[];
};

const scoreMap: { [key: string]: number } = {
  "strongly-disagree": 1,
  disagree: 2,
  neutral: 3,
  agree: 4,
  "strongly-agree": 5,
};

const likertOptions = [
  {
    value: "strongly-disagree",
    label: "Strongly Disagree",
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-100 text-red-700 border-red-200",
  },
  {
    value: "disagree",
    label: "Disagree",
    color: "from-orange-500 to-yellow-500",
    bgColor: "bg-orange-100 text-orange-700 border-orange-200",
  },
  {
    value: "neutral",
    label: "Neutral",
    color: "from-gray-400 to-gray-600",
    bgColor: "bg-gray-100 text-gray-700 border-gray-200",
  },
  {
    value: "agree",
    label: "Agree",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    value: "strongly-agree",
    label: "Strongly Agree",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-100 text-green-700 border-green-200",
  },
];

export default function Assessment({ params }: { params: { id: string } }) {
  const currentAssessmentId = params.id;
  const currentAssessment = assessmentQuestions[currentAssessmentId];

  const numQuestions = currentAssessment?.questions.length || 0;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(numQuestions)),
    defaultValues: {
      answers: Array(numQuestions).fill(""),
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  const consentData = {
    name: searchParams.get("name") || "Not Provided",
    rollNumber: searchParams.get("rollNumber") || "Not Provided",
    phoneNumber: searchParams.get("phoneNumber") || "Not Provided",
    counselorName: searchParams.get("counselorName") || "Not Provided",
    signatureDate: searchParams.get("signatureDate") || "Not Provided",
  };

  const selectedAssessments =
    searchParams.get("selectedAssessments")?.split(",") || [];
  const currentAssessmentIndex = parseInt(
    searchParams.get("currentAssessmentIndex") || "0"
  );
  const numAssessments = parseInt(searchParams.get("numAssessments") || "0");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(false);

  const watchedAnswers = form.watch("answers");
  const answeredQuestions = watchedAnswers.filter(
    (answer) => answer !== ""
  ).length;
  const progressPercentage = (answeredQuestions / numQuestions) * 100;

  useEffect(() => {
    setCurrentQuestion(0);
    setShowSubmitButton(false);
  }, [currentAssessmentId]);

  useEffect(() => {
    if (answeredQuestions === numQuestions && answeredQuestions > 0) {
      setShowSubmitButton(true);
    } else {
      setShowSubmitButton(false);
    }
  }, [answeredQuestions, numQuestions]);

  if (!currentAssessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardTitle className="text-2xl text-red-600 mb-4">
            Assessment Not Found
          </CardTitle>
          <p className="text-gray-600">
            The requested assessment could not be found.
          </p>
        </Card>
      </div>
    );
  }

  const onAnswerChange = (value: string, index: number) => {
    form.setValue(`answers.${index}`, value);

    // Auto-advance to next unanswered question
    setTimeout(() => {
      const nextUnansweredIndex = watchedAnswers.findIndex(
        (answer, i) => i > index && answer === ""
      );
      if (nextUnansweredIndex !== -1) {
        setCurrentQuestion(nextUnansweredIndex);
      } else if (index + 1 < numQuestions) {
        setCurrentQuestion(index + 1);
      }
    }, 300);
  };

  const navigateToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Calculate raw score
    const rawScore = data.answers.reduce(
      (total, answer) => total + scoreMap[answer],
      0
    );

    // Normalize score to 0-100 scale
    const minScore = numQuestions * 1; // Minimum score (1 per question)
    const maxScore = numQuestions * 5; // Maximum score (5 per question)
    const normalizedScore = Math.round(
      ((rawScore - minScore) / (maxScore - minScore)) * 100
    );

    // Store both raw and normalized scores
    const storedScores = JSON.parse(
      localStorage.getItem("assessmentScores") || "{}"
    );
    storedScores[currentAssessmentId] = { rawScore, normalizedScore };
    localStorage.setItem("assessmentScores", JSON.stringify(storedScores));

    const storedAnswers = JSON.parse(
      localStorage.getItem("assessmentAnswers") || "{}"
    );
    storedAnswers[currentAssessmentId] = data.answers;
    localStorage.setItem("assessmentAnswers", JSON.stringify(storedAnswers));

    const nextIndex = currentAssessmentIndex + 1;
    if (nextIndex < numAssessments) {
      const query = new URLSearchParams({
        name: consentData.name,
        rollNumber: consentData.rollNumber,
        phoneNumber: consentData.phoneNumber,
        counselorName: consentData.counselorName,
        signatureDate: consentData.signatureDate,
        selectedAssessments: selectedAssessments.join(","),
        currentAssessmentIndex: nextIndex.toString(),
        numAssessments: numAssessments.toString(),
      }).toString();
      router.push(`/assessment/${selectedAssessments[nextIndex]}?${query}`);
    } else {
      const query = new URLSearchParams({
        name: consentData.name,
        rollNumber: consentData.rollNumber,
        phoneNumber: consentData.phoneNumber,
        counselorName: consentData.counselorName,
        signatureDate: consentData.signatureDate,
        selectedAssessments: selectedAssessments.join(","),
        hasAssessment: "true",
      }).toString();
      router.push(`/summary?${query}`);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${currentAssessment.gradient} p-4 sm:p-6`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div
              className={`p-3 rounded-full bg-gradient-to-r ${currentAssessment.color} text-white shadow-lg`}
            >
              {currentAssessment.icon}
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {currentAssessment.name}
          </h1>
          <div className="text-xl font-semibold text-gray-700 mb-1">
            Aditya University
          </div>
          <div className="text-sm text-gray-600 mb-4">Counseling Center</div>
          <Badge
            variant="outline"
            className="border-gray-400 text-gray-600 mb-6"
          >
            <Lock className="w-3 h-3 mr-1" />
            Confidential Assessment
          </Badge>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-gray-700">
                  Progress: {answeredQuestions} of {numQuestions} questions
                  completed
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {Math.round(progressPercentage)}%
                </div>
              </div>
              <Progress value={progressPercentage} className="h-2 mb-4" />

              {/* Question Navigation */}
              <div className="flex flex-wrap gap-2 justify-center">
                {currentAssessment.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => navigateToQuestion(index)}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 hover:scale-110",
                      watchedAnswers[index]
                        ? "bg-green-500 text-white shadow-lg"
                        : currentQuestion === index
                        ? `bg-gradient-to-r ${currentAssessment.color} text-white shadow-lg`
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    )}
                  >
                    {watchedAnswers[index] ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Assessment Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-8">
              <div className="mb-6 text-center">
                <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                  Please respond to each statement honestly. Your responses are
                  completely confidential and will help us provide you with
                  personalized support and guidance.
                </p>
              </div>

              <FormProvider {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentQuestion}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="min-h-[300px] flex flex-col justify-center"
                    >
                      <FormField
                        control={form.control}
                        name={`answers.${currentQuestion}`}
                        render={({ field }) => (
                          <FormItem className="space-y-6">
                            <FormLabel className="text-2xl font-semibold text-gray-800 leading-relaxed block text-center">
                              {currentQuestion + 1}.{" "}
                              {currentAssessment.questions[currentQuestion]}
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={(value) =>
                                  onAnswerChange(value, currentQuestion)
                                }
                                value={field.value}
                                className="grid grid-cols-1 sm:grid-cols-5 gap-4 mt-8"
                              >
                                {likertOptions.map((option) => (
                                  <motion.div
                                    key={option.value}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex flex-col items-center space-y-2"
                                  >
                                    <div
                                      className={cn(
                                        "w-full p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer",
                                        field.value === option.value
                                          ? `bg-gradient-to-r ${option.color} text-white border-transparent shadow-lg transform scale-105`
                                          : `${option.bgColor}`
                                      )}
                                    >
                                      <RadioGroupItem
                                        value={option.value}
                                        id={`q${currentQuestion}-${option.value}`}
                                        className="sr-only"
                                      />
                                      <Label
                                        htmlFor={`q${currentQuestion}-${option.value}`}
                                        className="text-sm font-medium text-center block cursor-pointer"
                                      >
                                        {option.label}
                                      </Label>
                                    </div>
                                  </motion.div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage className="text-center" />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setCurrentQuestion(Math.max(0, currentQuestion - 1))
                      }
                      disabled={currentQuestion === 0}
                      className="flex items-center space-x-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </Button>

                    <div className="text-sm text-gray-500 font-medium">
                      Question {currentQuestion + 1} of {numQuestions}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setCurrentQuestion(
                          Math.min(numQuestions - 1, currentQuestion + 1)
                        )
                      }
                      disabled={currentQuestion === numQuestions - 1}
                      className="flex items-center space-x-2"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Submit Button */}
                  <AnimatePresence>
                    {showSubmitButton && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex justify-center pt-8"
                      >
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className={cn(
                            "px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300",
                            `bg-gradient-to-r ${currentAssessment.color} hover:shadow-xl hover:scale-105 text-white`,
                            isSubmitting && "opacity-70 cursor-not-allowed"
                          )}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Submitting...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5" />
                              <span>Complete Assessment</span>
                            </div>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
