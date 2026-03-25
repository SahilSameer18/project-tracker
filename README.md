# Project Tracker UI

**Live Demo:** [Add your deployed link here, e.g., https://your-project-tracker.vercel.app]

## Setup Instructions
1. Run `npm install` to install dependencies.
2. Run `npm run dev` to start the local Vite development server.
3. Open `http://localhost:5173` to view the application in your browser.
4. To build the application for production, run `npm run build`.

## State Management Decision
I opted to use **Zustand** over React Context + useReducer. Zustand offers a much lighter, boilerplate-free approach to state management while still providing powerful features like partial state updates, memoized selectors, and a centralized store. In an application like this with rapidly changing state (draggable coordinates, continuous user presence simulation, filter updates), Zustand prevents unnecessary re-renders of the entire component tree, which is a common performance pitfall with Context wrappers. 

## Virtual Scrolling Implementation
Virtual scrolling was implemented from scratch without libraries like `react-window`. 
- **Math Engine**: The view calculates the total scrollable height (`sortedTasks.length * ROW_HEIGHT`) to establish the correct scrollbar dimensions.
- **Buffer & Slicing**: Based on the `scrollTop` event of the container, we slice the tasks array to fetch only the visibly required subset, alongside a buffer of 5 rows above and below.
- **Zero Jitter**: Instead of translating an inner wrapper DOM element, every item is absolutely positioned dynamically (`position: absolute; top: actualIndex * ROW_HEIGHT`). This strictly prevents sub-pixel rendering bugs and layout flickering during rapid scrolling since each visible row anchors precisely against the container top.

## Drag-and-Drop Approach
I built a completely custom drag-and-drop system leveraging **Pointer Events** (`onPointerDown`, `onPointerMove`, `onPointerUp`) instead of the inflexible HTML5 Drag and Drop API.
- **Orchestration**: The drag state is elevated to the `KanbanView` to allow cards to smoothly break out of their parent columns.
- **Event Capture**: When dragging begins, `setPointerCapture` is bound so that rapid mouse movements out of the viewport don't kill the sequence.
- **Clone Rendering: ** The dragging card renders as an absolute positioned 'clone' with `pointer-events: none`, tracking the raw `clientX/Y` offset seamlessly. 
- **Snap-back**: When dropped outside valid drop zones, the component enters a "snap-back" phase where the clone adopts a 300ms CSS transition and animates back to its cached `originRect` bounding coordinates.

## Explanation Field (150-250 words)
The hardest UI problem I solved was marrying the custom pointer-events drag logic with strict layout stability across the Kanban columns. To handle the **drag placeholder** without causing layout shifts, I immediately hide the original draggable task in the DOM layout (removing it from the map if it matches the actively dragged task) and simultaneously render a blank dashed placeholder `div` whose `height` matches the exact cached `DOMRect.height` of the task when the pointer was first captured. This guarantees 1:1 pixel stability. Furthermore, depending on the active `hoveredStatus` (tracked via `document.elementsFromPoint`), the empty space is actively projected into the new target column or anchored in the origin column, tricking the eye gracefully into anticipating the drop.

With more time, I would refactor the **Virtual List Scroll** to support intrinsically dynamic row heights using a ResizeObserver cache instead of a hardcoded 64px row height. I'd also memoize the complex sorting routines so that `pointer events` orchestrations and simulated WebSocket bursts don't accidentally re-trigger the computationally expensive `date-fns` sorting if there are thousands of active tasks.

*(Note: Ensure an image file named `lighthouse.png` is placed in this directory covering the 85+ score).*
