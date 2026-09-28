import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { displaySm, MonoLabel } from "@/components/site/section-head"
import { commitments } from "@/lib/content"

export function Control() {
  return (
    <section id="control" aria-labelledby="control-title" className="container-page pb-18 md:pb-30">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <Reveal className="flex flex-col gap-3 lg:sticky lg:top-28">
          <MonoLabel>Full control</MonoLabel>
          <h2 id="control-title" className={displaySm}>
            Your data. Your models.
            <br />
            Your decision, every time.
          </h2>
          <p className="mt-4.5 max-w-130 text-[clamp(19px,1.57vw,22.5px)] leading-[1.45]">
            Sovereignty is the setting we design toward. These are the five we hold every product to, and where one is
            not there yet, we say so plainly.
          </p>
        </Reveal>

        <Stagger as="ol" gap={0.12} className="border-t-[1.5px] border-ink">
          {commitments.map((c) => (
            <StaggerItem
              key={c.title}
              as="li"
              className="grid grid-cols-[24px_1fr] gap-x-4 gap-y-1.5 border-b border-line py-5.5 md:grid-cols-[28px_1fr]"
            >
              <span aria-hidden className="relative row-span-2 mt-2 size-3.5 border-[1.5px] border-ink">
                <StaggerItem
                  as="span"
                  className="absolute inset-0.5 bg-lime"
                  variants={{
                    hidden: { scale: 0 },
                    show: { scale: 1, transition: { type: "spring", stiffness: 500, damping: 15, delay: 0.2 } },
                  }}
                />
              </span>
              <strong className="text-[clamp(22.5px,2.02vw,29px)] leading-[1.2] font-medium tracking-[-0.03em]">
                {c.title}
              </strong>
              <span className="leading-[1.45] text-ink-soft">{c.body}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
