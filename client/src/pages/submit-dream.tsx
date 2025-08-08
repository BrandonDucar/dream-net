import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CloudMoon, Send, CheckCircle } from "lucide-react";

const submitDreamSchema = z.object({
  dreamName: z.string().min(3, "Dream name must be at least 3 characters").max(100, "Dream name too long"),
  walletAddress: z.string().min(32, "Invalid wallet address").max(64, "Invalid wallet address"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description too long"),
  tags: z.string().min(1, "At least one tag is required"),
  dreamCloud: z.enum(['defi', 'gaming', 'zksync', 'desci', 'memes', 'ai', 'tools', 'social', 'art', 'custom'])
});

type SubmitDreamFormData = z.infer<typeof submitDreamSchema>;

export default function SubmitDream() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cloud, setCloud] = useState('ai');
  const { toast } = useToast();

  const form = useForm<SubmitDreamFormData>({
    resolver: zodResolver(submitDreamSchema),
    defaultValues: {
      dreamName: "",
      walletAddress: "",
      description: "",
      tags: "",
      dreamCloud: "ai"
    }
  });

  const onSubmit = async (data: SubmitDreamFormData) => {
    setIsSubmitting(true);

    try {
      // Convert comma-separated tags to array
      const tagsArray = data.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const dreamSubmission = {
        dreamName: data.dreamName,
        walletAddress: data.walletAddress,
        description: data.description,
        tags: tagsArray,
        dreamCloud: data.dreamCloud
      };

      const response = await fetch("/api/submit-dream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dreamSubmission)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit dream");
      }

      const result = await response.json();
      
      setSubmitted(true);
      form.reset();
      
      toast({
        title: "Dream Submitted Successfully!",
        description: `Your dream "${data.dreamName}" has been submitted for review`,
      });

      console.log("Dream submission result:", result);

    } catch (error) {
      console.error("Dream submission error:", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit dream",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
                <h2 className="text-2xl font-semibold">Dream Submitted!</h2>
                <p className="text-muted-foreground">
                  Your dream has been successfully submitted to the Dream Network. 
                  It will be reviewed by our team and may be selected for transformation into a cocoon.
                </p>
                <Button 
                  onClick={() => setSubmitted(false)}
                  className="mt-4"
                >
                  Submit Another Dream
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-electric-cyan to-soft-gold rounded-lg flex items-center justify-center mx-auto">
            <CloudMoon className="w-8 h-8 text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Submit Your Dream</h1>
            <p className="text-muted-foreground mt-2">
              Share your dream with the network. Selected dreams may evolve into cocoons and become part of the ecosystem.
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Dream Submission Form</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="dreamName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dream Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., AI Music Synthesizer"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Give your dream a clear, descriptive name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="walletAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wallet Address *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Your wallet address for attribution and potential rewards
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your dream vision, the problem it solves, or the experience it creates..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Explain your dream in detail (10-500 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="ai, music, creativity, innovation"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Comma-separated tags that describe your dream's themes and technologies
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dreamCloud"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>🌩️ Dream Cloud</FormLabel>
                      <FormControl>
                        <select {...field} className="w-full p-2 border rounded">
                          <option value="defi">DeFi</option>
                          <option value="gaming">Gaming</option>
                          <option value="zksync">zk/Privacy</option>
                          <option value="desci">DeSci</option>
                          <option value="memes">Memes</option>
                          <option value="ai">AI</option>
                          <option value="tools">Tools</option>
                          <option value="social">Social</option>
                          <option value="art">Art</option>
                          <option value="custom">Custom</option>
                        </select>
                      </FormControl>
                      <FormDescription>
                        Select the domain or specialty area for your dream
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Submit Dream
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>What happens next?</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Your dream enters the review queue with "pending" status</li>
                <li>Community reviewers evaluate the dream's potential</li>
                <li>Approved dreams may be selected for cocoon transformation</li>
                <li>You'll be credited as the original dreamer if your submission evolves</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}