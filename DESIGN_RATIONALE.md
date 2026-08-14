# TRIPO 3D Printing — Immersive Landing Experience

## Design objective
The page turns a product landing page into an interactive 3D narrative. Instead of explaining every capability through conventional feature cards, the interface first lets the user experience 3D behavior, then progressively introduces proof, scenarios, capabilities, workflow and conversion.

## Information architecture
1. Hero — core value proposition + direct 3D interaction.
2. Vision statement — establishes the broader creation workflow.
3. Key facts — objective scale and ecosystem proof.
4. Case studies — personalized jewelry, art sculpture and tabletop miniatures.
5. Capability scene — Image to 3D, print success, clean topology and high fidelity.
6. Workflow field — generation, segmentation, texturing, rigging and output.
7. Closing CTA — clear path into TRIPO creation tools.

## Hero interaction
The Hero uses an actual Three.js scene rather than a decorative video. A segmented metallic symbol is built from independent panels so every part can react separately. Pointer movement adds magnetic rotation; raycasting detects the panel directly under the cursor; thin guide strings have expanded invisible hit areas to make spark interactions easier to discover.

Pressing and holding the model creates a deliberate charge state. After roughly half a second the panels blast apart along deterministic trajectories. Releasing the pointer reverses the state smoothly, so the model reassembles instead of snapping back. The headline, navigation and nearby micro UI share the same charge state and vibrate subtly while the blast is building.

## Scroll behavior
Long-form sections use sticky viewport stages. Scroll progress becomes animation progress, allowing 3D objects, type and card systems to evolve continuously rather than triggering disconnected entrance animations. Dark and light chapters alternate to create pacing: black chapters are immersive and spatial; light chapters are editorial and information-dense.

## Sound
The top-right sound control plays the supplied soundtrack only after a user click, respecting browser autoplay rules. Play/pause preserves the current position so the experience can be resumed without restarting the audio.

## Visual system
The interface uses a near-black canvas, off-white typography, hairline rules, small uppercase utility labels and very large grotesk display type. TRIPO yellow remains the brand accent while orange is reserved for interactive sparks and warm reflections inside the 3D scene.

## Conversion logic
The sequence follows a deliberate path: attract attention with 3D interaction → explain the value → prove scale → demonstrate scenarios → clarify capabilities → show the connected workflow → offer a clear product CTA. This keeps the page visually expressive while still supporting commercial understanding and action.
