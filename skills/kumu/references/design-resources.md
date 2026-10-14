# Design resource loading

Resource selection is pipeline behavior. Artistic decisions remain in the
selected `style.md`; references provide capabilities, not a replacement look.
Respect explicit resource exclusions in the selected style before loading.
Read the resource's SKILL.md before its references. If a required HyperFrames
skill is missing, use `npx hyperframes skills update <skill-name>`; report a
failed install rather than claiming to have read it. Do not load an unrelated
creation workflow or every reference in a skill.

| Stage or need | Load | Record in video-plan.md |
| --- | --- | --- |
| Concept and composition planning | `hyperframes-creative`, then relevant `references/video-composition.md` and `references/beat-direction.md`; `references/data-in-motion.md` for data | Selected reference and the planning decision it helped resolve |
| Choreographing an action or transition | `hyperframes-animation`, then `rules-index.md` or `blueprints-index.md` and the matching recipe; transition catalog only for a transition | The action or handoff and why that recipe fits the style |
| Attention, rhythm, or sequencing needs review | [IBM animation guidance](https://www.ibm.com/design/language/animation/tips-and-techniques/) | The section consulted and the decision being checked |
| UI interaction or object continuity | [Material choreography](https://m1.material.io/motion/choreography.html) | The relationship or transition being designed |
| A diagram explains a system, sequence, or hierarchy | [IBM technical diagrams](https://www.ibm.com/design/language/infographics/technical-diagrams/design/) | The relationship and layout decision being checked |
| A specialist kit provides the action | The style's kit documentation and audit; selected creative references for planning | Which helper owns the action and which audit validates it |

Fetch the relevant official web page when needed, once per run, and save brief
notes and its URL under **Resources** in the existing plan. Later stages reuse
those notes; do not repeatedly browse. These pages are guidance, not installable
skills, and do not verify subject-matter claims. Record access failures and use
available style guidance without attributing decisions to an unread page.

Filter every recipe through the style and core's render contract. A recipe
with an unsuitable aesthetic, live clock, callback-only state, runtime layout
measurement, or unseekable simulation must be adapted or rejected. Kit-owned
actions stay in their helpers; do not replace them with generic tweens.

Before implementation, identify the relevant section of the style's
**Choreography** (or **Motion** when absent) and **Checks**. During review, compare actual scene results
and handoffs with that contract. Loading a resource is not evidence that the
video meets it; record the observed result and timestamp.
