import { useState } from "react";
import { useListProductFaqs, useSubmitFaq } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle, CheckCircle2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqFormSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email("Invalid email address"),
  question: z.string().min(10, "Question must be at least 10 characters"),
});

type FaqForm = z.infer<typeof faqFormSchema>;

interface ProductFAQsProps {
  productId: string;
  productName: string;
}

export function ProductFAQs({ productId, productName }: ProductFAQsProps) {
  const [openId, setOpenId] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const { data: faqs = [], isLoading } = useListProductFaqs(productId);

  const { mutate: submitFaq, isPending, isError } = useSubmitFaq();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FaqForm>({ resolver: zodResolver(faqFormSchema) });

  const onSubmit = (data: FaqForm) => {
    submitFaq(
      {
        data: {
          productId,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          question: data.question,
        },
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          reset();
        },
      }
    );
  };

  const inputClass =
    "w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm";

  return (
    <section className="py-20 border-t border-border">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-display mb-3">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">
            Common questions about the {productName}.
          </p>
        </div>

        {/* FAQ Accordion */}
        {isLoading ? (
          <div className="space-y-3 mb-12">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-secondary/40 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-12 bg-secondary/20 rounded-2xl mb-12">
            <HelpCircle className="w-10 h-10 mx-auto text-muted-foreground mb-3 stroke-[1]" />
            <p className="text-muted-foreground text-sm">
              No answered questions yet. Be the first to ask below.
            </p>
          </div>
        ) : (
          <div className="space-y-3 mb-12">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className={`border rounded-xl overflow-hidden transition-colors ${
                  openId === faq.id ? "border-primary/30 bg-primary/5" : "border-border bg-background"
                }`}
              >
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left gap-4"
                >
                  <span className="font-medium text-sm leading-relaxed pr-2">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                      openId === faq.id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {openId === faq.id && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="px-5 pb-5 border-t border-border/50">
                        <p className="text-muted-foreground text-sm leading-relaxed pt-4">
                          {faq.answer}
                        </p>
                        {faq.isFeatured && (
                          <span className="inline-flex items-center mt-3 text-xs text-primary font-medium">
                            ★ Featured Answer
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}

        {/* Ask a Question Form */}
        <div className="bg-secondary/20 rounded-2xl p-8">
          <div className="flex items-center mb-6">
            <MessageCircle className="w-5 h-5 text-primary mr-3 shrink-0" strokeWidth={1.5} />
            <h3 className="text-xl font-display">Ask a Question</h3>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center py-8"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-7 h-7 text-primary" strokeWidth={1.5} />
              </div>
              <h4 className="font-medium text-lg mb-2">Question Submitted!</h4>
              <p className="text-muted-foreground text-sm max-w-sm">
                Your question has been submitted. We'll get back to you soon.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 text-sm text-primary hover:underline"
              >
                Ask another question
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name</label>
                  <input {...register("customerName")} className={inputClass} placeholder="Jane Doe" />
                  {errors.customerName && (
                    <p className="text-destructive text-xs mt-1">{errors.customerName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    {...register("customerEmail")}
                    className={inputClass}
                    placeholder="jane@example.com"
                  />
                  {errors.customerEmail && (
                    <p className="text-destructive text-xs mt-1">{errors.customerEmail.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Question</label>
                <textarea
                  {...register("question")}
                  rows={4}
                  className={`${inputClass} resize-none`}
                  placeholder={`What would you like to know about the ${productName}?`}
                />
                {errors.question && (
                  <p className="text-destructive text-xs mt-1">{errors.question.message}</p>
                )}
              </div>

              {isError && (
                <p className="text-destructive text-sm">
                  Failed to submit your question. Please try again.
                </p>
              )}

              <Button type="submit" isLoading={isPending} className="w-full sm:w-auto">
                Submit Question
              </Button>

              <p className="text-xs text-muted-foreground">
                Your email is kept private and will not be displayed publicly.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
