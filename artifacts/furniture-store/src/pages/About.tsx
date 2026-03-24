import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=2000&q=80" 
            alt="Craftsmanship" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/40" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto text-background pt-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-display mb-6"
          >
            The Art of Living
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-background/80 font-light"
          >
            Founded on the belief that furniture should be as enduring as the memories made around it.
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Our Origin</h2>
            <h3 className="text-3xl md:text-4xl font-display leading-tight">
              A rebellion against the disposable culture of modern homeware.
            </h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Luxe began in 2010 when two architects, frustrated by the lack of well-made, accessible furniture, decided to create their own. What started as a single dining table design out of a small Brooklyn studio has evolved into a comprehensive collection for the entire home.
              </p>
              <p>
                We collaborate directly with generational craftsmen—woodworkers, weavers, and upholsterers—to bring our designs to life without the traditional retail markup. Our aesthetic is rooted in warm minimalism: clean lines, natural textures, and a focus on essential form.
              </p>
            </div>
          </div>
          <div className="aspect-[4/5] rounded-2xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80" 
              alt="Designer working" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-foreground text-background py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-display mb-6">Our Principles</h2>
            <p className="text-background/70">The foundation of everything we design, build, and deliver.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              {
                title: "Honest Materials",
                desc: "Solid woods, top-grain leathers, and natural stone. Materials that patinate beautifully and tell a story over time."
              },
              {
                title: "Slow Craft",
                desc: "We prioritize technique over speed. Traditional joinery and hand-finishing ensure each piece is built to outlast its owner."
              },
              {
                title: "Quiet Presence",
                desc: "Design that doesn't scream for attention, but commands it through proportion, balance, and understated elegance."
              }
            ].map((v, i) => (
              <div key={i} className="space-y-4">
                <div className="w-12 h-12 border border-background/30 rounded-full mx-auto flex items-center justify-center text-lg font-display">
                  0{i + 1}
                </div>
                <h3 className="text-xl font-medium tracking-wide">{v.title}</h3>
                <p className="text-background/60 text-sm leading-relaxed max-w-xs mx-auto">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Studio Image */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden">
             <img src="https://images.unsplash.com/photo-1600607686527-6fb886090705?w=1600&q=80" alt="Design Studio" className="w-full h-full object-cover" />
           </div>
        </div>
      </section>
    </Layout>
  );
}
