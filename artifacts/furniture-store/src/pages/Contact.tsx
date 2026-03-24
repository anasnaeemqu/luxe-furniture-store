import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSendContactMessage } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  const { mutate, isPending } = useSendContactMessage();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = (data: ContactForm) => {
    mutate({ data }, {
      onSuccess: () => {
        toast({
          title: "Message Sent",
          description: "Thank you for reaching out. Our team will get back to you shortly.",
        });
        reset();
      },
      onError: (err) => {
        toast({
          title: "Error",
          description: (err as any).response?.data?.error || err.message || "Failed to send message. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-secondary/30 pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-display mb-6">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're inquiring about a specific piece, need design advice, or have questions about your order, our concierge team is here to assist you.
          </p>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
          
          {/* Form */}
          <div>
            <h2 className="text-2xl font-display mb-8">Send a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input 
                    {...register("name")}
                    className="w-full px-4 py-3 bg-secondary/20 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Jane Doe"
                  />
                  {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input 
                    {...register("email")}
                    className="w-full px-4 py-3 bg-secondary/20 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="jane@example.com"
                  />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input 
                  {...register("subject")}
                  className="w-full px-4 py-3 bg-secondary/20 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Order Inquiry"
                />
                {errors.subject && <p className="text-destructive text-xs mt-1">{errors.subject.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea 
                  {...register("message")}
                  rows={6}
                  className="w-full px-4 py-3 bg-secondary/20 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  placeholder="How can we help you?"
                />
                {errors.message && <p className="text-destructive text-xs mt-1">{errors.message.message}</p>}
              </div>

              <Button type="submit" size="lg" className="w-full md:w-auto" isLoading={isPending}>
                Send Message
              </Button>
            </form>
          </div>

          {/* Info & Map */}
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-display mb-8">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-primary mt-1 mr-4 shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Flagship Gallery</h4>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                      123 Design District Blvd<br />
                      Suite 400<br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-primary mr-4 shrink-0" />
                  <p className="text-muted-foreground text-sm">+1 (800) 555-LUXE</p>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-primary mr-4 shrink-0" />
                  <p className="text-muted-foreground text-sm">concierge@luxefurniture.com</p>
                </div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-primary mt-1 mr-4 shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Gallery Hours</h4>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                      Monday - Friday: 10am - 7pm<br />
                      Saturday: 11am - 6pm<br />
                      Sunday: Closed (Private viewing by appointment)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Map image */}
            <div className="aspect-[16/9] w-full bg-secondary rounded-xl overflow-hidden grayscale contrast-125 opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
               <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80" alt="Location Map" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
