"use client";
import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Add CSS to force accordion content visibility during print
const printStyles = `
  @media print {
    .accordion-content {
      display: block !important;
      height: auto !important;
      overflow: visible !important;
    }
    .accordion-trigger::after {
      content: none !important;
    }
    .print-hidden {
      display: none !important;
    }
  }
`;

// Form schema using Zod
const formSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  rollNumber: z.string().min(1, "Please enter your roll number"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  counselorName: z.string().min(1, "Please select a counselor"),
  signatureDate: z.date({ required_error: "Please select the signature date" }),
});

type FormValues = z.infer<typeof formSchema>;

const accordionSections = [
  {
    value: "welcome",
    title: "Welcome to Aditya University, Surampalem",
    content: (
      <div className="space-y-4">
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
          <h4 className="font-semibold text-green-800 mb-2">What We Offer:</h4>
          <ul className="text-green-700 space-y-1 text-sm">
            <li>• Individual counseling sessions</li>
            <li>• Group therapy opportunities</li>
            <li>• Workshops to enhance your skills</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    value: "counseling-support",
    title: "What is Counseling Support?",
    content: (
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          Counseling at the University Counselling Centre is a friendly and
          supportive space where you can share your thoughts, explore personal
          concerns, and develop strategies to enhance your well-being. You can
          attend multiple sessions as per your wish, creating a personalized
          experience.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-800 font-medium mb-2">Why It Helps:</p>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>• Build confidence and coping skills</li>
            <li>• Navigate academic and personal challenges</li>
            <li>• Feel supported in a safe environment</li>
          </ul>
        </div>
        <p className="text-gray-700 text-sm">
          Our experienced counselors are here to listen and guide you, ensuring
          you feel comfortable and empowered.
        </p>
      </div>
    ),
  },
  {
    value: "your-role",
    title: "Your Role in Counseling",
    content: (
      <div className="space-y-3">
        <p className="text-gray-700 text-sm leading-relaxed">
          Your participation makes counseling more effective. Feel free to share
          your thoughts and work with your counselor to set goals that suit you.
        </p>
        <div className="bg-purple-50 p-3 rounded">
          <ul className="text-purple-700 space-y-1 text-sm">
            <li>• Attend sessions at your convenience</li>
            <li>• Share your experiences for tailored support</li>
            <li>• Let your counselor know if you need a different approach</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    value: "confidentiality",
    title: "Keeping Your Conversations Private",
    content: (
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-800 font-medium mb-2">Our Promise:</p>
          <p className="text-blue-700 text-sm">
            Everything you discuss with your counselor at the University
            Counselling Centre is kept confidential, creating a safe space for
            you to open up. This is supported by university policies and laws.
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-800 mb-2">
            When We May Share:
          </h4>
          <ul className="text-yellow-700 space-y-1 text-sm">
            <li>
              • If there’s a risk of harm to you or others, we’ll take steps to
              ensure safety
            </li>
            <li>
              • With your permission, we can share with university staff if
              needed
            </li>
          </ul>
        </div>
      </div>
    ),
  },
];

export default function ConsentForm() {
  const [optionDialog, setOptionDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      rollNumber: "",
      phoneNumber: "",
      counselorName: "",
      signatureDate: undefined,
    },
  });

  useEffect(() => {
    // Inject print styles into the document
    const styleSheet = document.createElement("style");
    styleSheet.textContent = printStyles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const submitData = {
        ...data,
        signatureDate: format(data.signatureDate, "MM/dd/yyyy"),
      };
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Consent form data:", submitData);
      localStorage.setItem("consentFormData", JSON.stringify(submitData));
      setOptionDialog(true); // Show dialog with options
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitWithoutTest = () => {
    toast.success("Consent form submitted successfully without test!");
    setOptionDialog(false);
    const consentData = JSON.parse(
      localStorage.getItem("consentFormData") || "{}"
    );
    const query = new URLSearchParams({
      name: consentData.name || "",
      rollNumber: consentData.rollNumber || "",
      phoneNumber: consentData.phoneNumber || "",
      counselorName: consentData.counselorName || "",
      signatureDate: consentData.signatureDate || "",
      hasAssessment: "false",
    }).toString();
    router.push(`/summary?${query}`);
  };

  const handleSubmitWithTest = () => {
    setOptionDialog(false);
    const consentData = JSON.parse(
      localStorage.getItem("consentFormData") || "{}"
    );
    const query = new URLSearchParams({
      name: consentData.name || "",
      rollNumber: consentData.rollNumber || "",
      phoneNumber: consentData.phoneNumber || "",
      counselorName: consentData.counselorName || "",
      signatureDate: consentData.signatureDate || "",
    }).toString();
    router.push(`/select-assessments?${query}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-0 bg-white print:shadow-none">
          <CardContent className="p-0">
            <div
              className="bg-white p-12 mx-auto print:p-8"
              style={{
                width: "210mm",
                minHeight: "297mm",
                boxShadow: "0 0 20px rgba(0,0,0,0.1)",
                position: "relative",
              }}
            >
              <div className="text-center mb-8 pb-6">
                <div className="inline-flex items-center justify-center w-20 h-20">
                  <img
                    src="./logo.jpeg"
                    alt="Aditya University Logo"
                    className="w-20 h-20 object-contain"
                  />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  INFORMED CONSENT
                </h1>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="text-2xl font-bold text-blue-800">
                    ADITYA UNIVERSITY, SURAMPALEM
                  </p>
                  <p className="text-lg font-semibold text-gray-700">
                    University Counselling Centre
                  </p>
                  <p className="text-sm">
                    Surampalem, Andhra Pradesh | (123) 456-7890 |
                    counseling@adityauniversity.edu
                  </p>
                  <Badge
                    variant="outline"
                    className="mt-2 border-blue-600 text-blue-600"
                  >
                    Confidential
                  </Badge>
                </div>
              </div>

              <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200 print:bg-gray-50">
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  At Aditya University, we prioritize both your physical and
                  mental well-being. For your physical health, we have partnered
                  with Apollo, and for your mental well-being, our dedicated
                  student counselors are here to support you. The University
                  Counselling Centre at Surampalem provides a safe and
                  confidential space for all students to explore personal
                  concerns, develop coping strategies, and enhance overall
                  well-being. This college-organized initiative supports your
                  mental health journey, and you can attend multiple counseling
                  sessions as per your wish.
                </p>
                <Separator className="my-4" />
                <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-400 print:bg-gray-100">
                  <p className="text-xs text-amber-800 font-medium print:text-gray-700">
                    Please sign this form only if you understand and agree with
                    the information. You can discuss any questions with your
                    counselor at any time.
                  </p>
                </div>
              </div>

              <ScrollArea className="h-auto mb-8">
                <div className="space-y-4">
                  {accordionSections.map((section) => (
                    <div
                      key={section.value}
                      className="border border-gray-200 rounded-lg"
                    >
                      <h3 className="px-4 py-3 font-semibold text-gray-800 bg-gray-50">
                        {section.title}
                      </h3>
                      <div className="px-4 pb-4 accordion-content">
                        {section.content}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t-2 border-blue-600 pt-8">
                <FormProvider {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Your Information
                      </h2>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                      >
                        Please fill in all fields
                      </Badge>
                    </div>

                    <Alert className="mb-6 border-blue-200 bg-blue-50">
                      <AlertDescription className="text-sm text-blue-800">
                        I have read and understood the information above and
                        feel comfortable proceeding with counseling at the
                        University Counselling Centre. I agree to attend
                        sessions as needed and can discuss any concerns with my
                        counselor.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-800">
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your full name"
                                {...field}
                                className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 text-lg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="rollNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-800">
                              Roll Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your roll number"
                                {...field}
                                className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 text-lg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-800">
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your phone number"
                                {...field}
                                className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 text-lg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="counselorName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-800">
                              Counselor Name
                            </FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 text-lg">
                                  <SelectValue placeholder="Select a counselor" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Dr. Priya Sharma">
                                    Dr. Priya Sharma
                                  </SelectItem>
                                  <SelectItem value="Mr. Anil Kumar">
                                    Mr. Anil Kumar
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="signatureDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-base font-semibold text-gray-800">
                            Date
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              value={
                                field.value
                                  ? format(field.value, "yyyy-MM-dd")
                                  : ""
                              }
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? new Date(e.target.value)
                                    : undefined
                                )
                              }
                              className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 text-lg"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-center print-hidden">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Form"}
                      </Button>
                    </div>
                  </form>
                </FormProvider>
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={optionDialog} onOpenChange={setOptionDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogTitle>Choose Your Next Step</DialogTitle>
            <DialogDescription>
              Please select how you would like to proceed after submitting the
              consent form.
            </DialogDescription>
            <div className="flex flex-col gap-3 mt-4">
              <Button
                onClick={handleSubmitWithoutTest}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Submit Without Test
              </Button>
              <Button
                onClick={handleSubmitWithTest}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Take Test
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
