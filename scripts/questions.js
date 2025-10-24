const REACT_QUESTIONS_V2 = [
  // ===== FOUNDATIONS & JSX =====
  { id: 1, category: "Foundations & JSX", difficulty: "beginner",
        question: "What does JSX stand for?",
    options: ["JavaScript XML","JavaScript Extra","Java Syntax eXtension","JSON eXtension"],
    correctAnswer: 0, tags:["jsx","basics"]
  },
  { id: 2, category: "Foundations & JSX", difficulty: "beginner",
    question: "In React 18+, how do you render a component tree to the DOM?",
        options: [
      "ReactDOM.render(<App />, document.getElementById('root'))",
      "createRoot(document.getElementById('root')).render(<App />)",
      "renderDOM(<App />, '#root')",
      "document.render(<App />)"
    ],
    correctAnswer: 1, tags:["render","react18"] // W3Schools uses createRoot now
  },
  { id: 3, category: "Foundations & JSX", difficulty: "beginner",
    question: "A React component is typically…",
        options: [
      "A JS function/class that returns JSX",
            "A CSS class",
      "An HTML template file",
      "A database row"
    ],
    correctAnswer: 0, tags:["components"]
  },
  { id: 4, category: "Foundations & JSX", difficulty: "beginner",
    question: "Which attribute adds CSS classes in JSX?",
    options: ["className","class","css","styleClass"],
    correctAnswer: 0, tags:["jsx","css"]
  },
  { id: 5, category: "Foundations & JSX", difficulty: "intermediate",
    question: "What does a Fragment let you do?",
        options: [
      "Group children without adding an extra DOM node",
      "Memoize heavy components",
      "Create portals",
      "Batch state updates"
    ],
    correctAnswer: 0, tags:["fragments"]
  },
  { id: 6, category: "Foundations & JSX", difficulty: "intermediate",
    question: "How do you conditionally render in JSX?",
        options: [
      "Use ternaries or && inside JSX, or if statements outside",
      "Use switch statements in JSX tags",
      "Use while loops in JSX",
      "You cannot conditionally render"
    ],
    correctAnswer: 0, tags:["conditional","jsx"]
  },

  // ===== STATE, PROPS, LIFECYCLE =====
  { id: 7, category: "State & Props", difficulty: "beginner",
    question: "Props in React are…",
    options: ["Read-only inputs to components","Mutable local state","Global variables","CSS properties"],
    correctAnswer: 0, tags:["props"]
  },
  { id: 8, category: "State & Props", difficulty: "intermediate",
    question: "What is the purpose of the 'key' prop in lists?",
        options: [
      "Helps React identify items for efficient updates",
      "Required for styling each li",
      "Counts the number of items",
      "Enables drag-and-drop"
    ],
    correctAnswer: 0, tags:["lists","keys"]
  },
  { id: 9, category: "State & Props", difficulty: "beginner",
    question: "State in a component is best described as:",
        options: [
      "Data that can change over time and triggers re-render",
      "Static config values",
      "Server-side session data",
      "Computed CSS"
    ],
    correctAnswer: 0, tags:["state"]
  },
  { id:10, category:"Parent/Child", difficulty:"intermediate",
    question:"Can a child component modify a parent's state directly?",
    options:[
      "No, but it can call a function passed from the parent",
      "Yes, by mutating props",
      "Yes, with context by default",
      "Yes, using this.parent.setState"
    ],
    correctAnswer:0, tags:["data-flow"]
  },

  // ===== EVENTS & FORMS =====
  { id:11, category:"Events", difficulty:"beginner",
    question:"How do you attach a click handler in React?",
    options:["onClick={handle}","onclick='handle()'","addEventListener('click',...)","on:click={handle}"],
    correctAnswer:0, tags:["events"]
  },
  { id:12, category:"Events", difficulty:"intermediate",
    question:"How do you prevent a form's default submit behavior?",
    options:["e.preventDefault()","return false","stopDefault()","event.cancel()"],
    correctAnswer:0, tags:["forms","events"]
  },
  { id:13, category:"Forms", difficulty:"intermediate",
    question:"A controlled input is one where…",
    options:[
      "The value comes from component state",
      "The value is stored in the DOM only",
      "It cannot be edited",
      "It auto-validates"
    ],
    correctAnswer:0, tags:["forms","controlled"]
  },
  { id:14, category:"Forms", difficulty:"intermediate",
    question:"An uncontrolled component typically uses…",
    options:["Refs to read values from the DOM","Context","Redux","URL params"],
    correctAnswer:0, tags:["forms","refs"]
  },

  // ===== HOOKS =====
  { id:15, category:"Hooks", difficulty:"beginner",
    question:"useState returns…",
    options:[
      "[state, setState]","[getter, setter, reset]","{state, setState}","A single updater function"
    ],
    correctAnswer:0, tags:["useState"]
  },
  { id:16, category:"Hooks", difficulty:"beginner",
    question:"What does the dependency array in useEffect control?",
    options:[
      "When the effect runs","How many renders happen","Styling priority","The reducer actions"
    ],
    correctAnswer:0, tags:["useEffect"]
  },
  { id:17, category:"Hooks", difficulty:"intermediate",
    question:"How do you clean up a subscription in useEffect?",
    options:[
      "Return a cleanup function from the effect",
      "Call useCleanup()",
      "Call effect.dispose()",
      "You can't clean up"
    ],
    correctAnswer:0, tags:["useEffect","cleanup"]
  },
  { id:18, category:"Hooks", difficulty:"intermediate",
    question:"useContext is used to…",
    options:[
      "Consume values from a Context","Create a Context","Replace props entirely","Manage CSS"
    ],
    correctAnswer:0, tags:["useContext","context"]
  },
  { id:19, category:"Hooks", difficulty:"intermediate",
    question:"useReducer is preferred over useState when…",
    options:[
      "State logic is complex or dependent on previous state",
      "You need animations",
      "You need routing",
      "You need to fetch data"
    ],
    correctAnswer:0, tags:["useReducer"]
  },
  { id:20, category:"Hooks", difficulty:"intermediate",
    question:"useRef is commonly used to…",
    options:[
      "Reference DOM nodes or store mutable values without re-render",
      "Memoize functions",
      "Create contexts",
      "Trigger suspense"
    ],
    correctAnswer:0, tags:["useRef"]
  },
  { id:21, category:"Hooks", difficulty:"intermediate",
    question:"useMemo is for…",
    options:[
      "Memoizing expensive calculations","Memoizing event handlers","Creating components","Throttling renders"
    ],
    correctAnswer:0, tags:["useMemo","performance"]
  },
  { id:22, category:"Hooks", difficulty:"intermediate",
    question:"useCallback is for…",
    options:[
      "Memoizing function references between renders","Delaying effects","Aborting fetches","Scheduling transitions"
    ],
    correctAnswer:0, tags:["useCallback","performance"]
  },
  { id:23, category:"Hooks", difficulty:"advanced",
    question:"What's a Custom Hook?",
    options:[
      "A function starting with 'use' that composes hooks","A third-party hook","A class lifecycle method","A devtool plugin"
    ],
    correctAnswer:0, tags:["custom-hooks"]
  },

  // ===== LISTS, KEYS, CONDITIONALS (misc) =====
  { id:24, category:"Lists & Conditionals", difficulty:"beginner",
    question:"Keys in a list should be…",
    options:[
      "Stable, unique identifiers per item","Array indexes, always","Random each render","Based on Math.random()"
    ],
    correctAnswer:0, tags:["keys"]
  },

  // ===== ROUTING =====
  { id:25, category:"Routing", difficulty:"intermediate",
    question:"What is React Router used for?",
    options:[
      "Client-side routing/navigation","Server-side rendering","Global state","Styling components"
    ],
    correctAnswer:0, tags:["router"]
  },
  { id:26, category:"Routing", difficulty:"intermediate",
    question:"Which is a valid Router concept?",
    options:[
      "Nested routes and URL params","CSS modules","Service workers","WebGL contexts"
    ],
    correctAnswer:0, tags:["router","routes"]
  },

  // ===== PERFORMANCE & OPTIMIZATION =====
  { id:27, category:"Performance", difficulty:"intermediate",
    question:"React.memo helps by…",
    options:[
      "Skipping re-renders when props are shallow-equal","Caching API responses","Inlining CSS","Compressing assets"
    ],
    correctAnswer:0, tags:["memo"]
  },
  { id:28, category:"Performance", difficulty:"intermediate",
    question:"Code-splitting + lazy loading in React typically use…",
    options:[
      "React.lazy and <Suspense>","Service workers","Web Components","Only dynamic import without Suspense"
    ],
    correctAnswer:0, tags:["lazy","suspense"]
  },

  // ===== RENDERING MODEL =====
  { id:29, category:"Rendering", difficulty:"intermediate",
    question:"The Virtual DOM is…",
    options:[
      "An in-memory representation used to compute minimal real DOM updates",
      "A second browser window",
      "Shadow DOM",
      "Server DOM API"
    ],
    correctAnswer:0, tags:["vdom"]
  },
  { id:30, category:"Rendering", difficulty:"advanced",
    question:"Reconciliation means React…",
    options:[
      "Diffs previous and next trees and updates only what changed",
      "Always re-renders everything",
      "Uses Shadow DOM",
      "Writes HTML strings directly"
    ],
    correctAnswer:0, tags:["diffing"]
  },

  // ===== ERROR HANDLING & STRICT MODE =====
  { id:31, category:"Reliability", difficulty:"intermediate",
    question:"How do you catch render errors from child components?",
    options:[
      "Error Boundaries (class components)","try/catch in render","window.onerror","You can't catch them"
    ],
    correctAnswer:0, tags:["error-boundaries"]
  },
  { id:32, category:"Reliability", difficulty:"intermediate",
    question:"React.StrictMode is primarily used to…",
    options:[
      "Enable extra development-only checks","Enforce TypeScript types","Minify bundles","Disable hot reload"
    ],
    correctAnswer:0, tags:["strictmode"]
  },

  // ===== SECURITY =====
  { id:33, category:"Security", difficulty:"intermediate",
    question:"Which is a safe practice in React?",
    options:[
      "Avoid unsafe innerHTML, sanitize input, validate on server","Use eval on user input","Store passwords in localStorage","Disable HTTPS in dev"
    ],
    correctAnswer:0, tags:["security"]
  },

  // ===== TOOLING / GET STARTED (per W3Schools) =====
  { id:34, category:"Tooling", difficulty:"beginner",
    question:"According to W3Schools' getting started, which tool is shown for bootstrapping a React app?",
    options:["Vite","Gatsby","Parcel (built-in)","No tool is needed"],
    correctAnswer:0, tags:["vite","getting-started"]
  },

  // ===== FORMS & EVENTS (a few more) =====
  { id:35, category:"Events", difficulty:"beginner",
    question:"Where does React pass the event object?",
    options:["As the first argument to the handler","window.event","this.event","It doesn't"],
    correctAnswer:0, tags:["events"]
  },
  { id:36, category:"Forms", difficulty:"intermediate",
    question:"What does onChange typically do on inputs?",
    options:[
      "Updates state with the current input value","Submits the form","Resets the form","Blocks typing"
    ],
    correctAnswer:0, tags:["forms"]
  },

  // ===== CONTEXT =====
  { id:37, category:"Context", difficulty:"intermediate",
    question:"How do you create a Context?",
    options:[
      "React.createContext()","new Context()","createContext without React import","Context.create()"
    ],
    correctAnswer:0, tags:["context"]
  },
  { id:38, category:"Context", difficulty:"intermediate",
    question:"How do components receive Context values?",
    options:[
      "Wrap tree in <Context.Provider> and call useContext(context) in consumers",
      "Pass as props only",
      "Global variables",
      "import contextValue from 'context'"
    ],
    correctAnswer:0, tags:["context","provider"]
  },

  // ===== SSR / GENERAL KNOWLEDGE =====
  { id:39, category:"General", difficulty:"advanced",
    question:"Server-Side Rendering (SSR) means…",
    options:[
      "Rendering components on the server and sending HTML to the client",
      "Hosting images on a CDN only",
      "Client renders everything",
      "Using service workers to cache routes"
    ],
    correctAnswer:0, tags:["ssr"]
  },

  // ===== MISC =====
  { id:40, category:"Misc", difficulty:"intermediate",
    question:"Prop drilling refers to…",
    options:[
      "Passing props through many layers to reach a deeply nested child",
      "Using props for animations",
      "Sharing props between siblings automatically",
      "Creating props dynamically via Proxy"
    ],
    correctAnswer:0, tags:["prop-drilling","context"]
  }
  ,
  // ===== ADDITIONAL PRACTICE (HIGH RELEVANCE TO W3Schools) =====
  { id:41, category:"Styling", difficulty:"beginner",
    question:"How do you set inline styles in JSX?",
    options:[
      "style=\"color: red\"",
      "style={{ color: 'red' }}",
      "styles='color:red'",
      "css={{ 'color': 'red' }}"
    ],
    correctAnswer:1, tags:["jsx","style"]
  },
  { id:42, category:"Lists & Conditionals", difficulty:"intermediate",
    question:"When mapping an array to elements, which key choice is best?",
    options:[
      "A stable unique id from the data",
      "The array index always",
      "A random value each render",
      "The item object itself"
    ],
    correctAnswer:0, tags:["lists","keys"]
  },
  { id:43, category:"State & Props", difficulty:"intermediate",
    question:"What does 'lifting state up' mean in React?",
    options:[
      "Moving shared state to the nearest common parent",
      "Using global variables",
      "Passing state down with context only",
      "Keeping state in the deepest child"
    ],
    correctAnswer:0, tags:["state","data-flow"]
  },
  { id:44, category:"Components", difficulty:"intermediate",
    question:"How do components render nested content passed between tags?",
    options:[
      "Using props.children",
      "Using props.content",
      "Using this.children only",
      "Using children() helper"
    ],
    correctAnswer:0, tags:["children","composition"]
  },
  { id:45, category:"State & Props", difficulty:"intermediate",
    question:"How should you update array state by adding an item?",
    options:[
      "state.push(item); setState(state)",
      "setState(prev => [...prev, item])",
      "state = state.concat(item)",
      "setState(state.add(item))"
    ],
    correctAnswer:1, tags:["state","immutability"]
  },
  { id:46, category:"Routing", difficulty:"beginner",
    question:"Which component is used for navigation links in React Router?",
    options:["<a>","<Link>","<Route>","<NavController>"],
    correctAnswer:1, tags:["router","link"]
  },
  { id:47, category:"Routing", difficulty:"intermediate",
    question:"How do you navigate programmatically in React Router v6?",
    options:[
      "history.push('/path')",
      "useNavigate()('/path')",
      "navigateTo('/path')",
      "router.go('/path')"
    ],
    correctAnswer:1, tags:["router","navigation"]
  },
  { id:48, category:"Routing", difficulty:"intermediate",
    question:"How do you read a route parameter like /users/:id in v6?",
    options:[
      "useParam('id')",
      "props.match.params.id",
      "useParams().id",
      "getParam('id')"
    ],
    correctAnswer:2, tags:["router","params"]
  },
  { id:49, category:"Routing", difficulty:"intermediate",
    question:"In React Router v6, which component replaced <Switch>?",
    options:["<Routes>","<RouteGroup>","<Switch2>","<RouterSwitch>"],
    correctAnswer:0, tags:["router","v6"]
  },
  { id:50, category:"Routing", difficulty:"intermediate",
    question:"How do you declare a catch‑all 'Not Found' route in v6?",
    options:[
      "<Route path='*' element={<NotFound />} />",
      "<Route default element={<NotFound />} />",
      "<Route path='/**' component={NotFound} />",
      "<NotFoundRoute />"
    ],
    correctAnswer:0, tags:["router","notfound"]
  },
  { id:51, category:"Hooks", difficulty:"beginner",
    question:"Which useEffect form runs only once on mount?",
    options:[
      "useEffect(fn)",
      "useEffect(fn, [deps])",
      "useEffect(fn, [])",
      "useEffectOnce(fn)"
    ],
    correctAnswer:2, tags:["useEffect","lifecycle"]
  },
  { id:52, category:"Rendering", difficulty:"intermediate",
    question:"In React 18+, what happens to multiple state updates in an event?",
    options:[
      "They are batched into a single render",
      "Each causes an immediate re-render",
      "They are ignored",
      "Only the last one applies"
    ],
    correctAnswer:0, tags:["rendering","batching"]
  },
  { id:53, category:"Security", difficulty:"intermediate",
    question:"How do you set HTML content from a string (use sparingly)?",
    options:[
      "innerHTML=...",
      "dangerouslySetInnerHTML={{ __html: html }}",
      "setHTML(html)",
      "useHtml(html)"
    ],
    correctAnswer:1, tags:["security","html"]
  },
  { id:54, category:"Context", difficulty:"intermediate",
    question:"What happens when a Context provider's value changes?",
    options:[
      "Only the provider re-renders",
      "Nothing",
      "All consumers re-render with the new value",
      "Only direct children re-render"
    ],
    correctAnswer:2, tags:["context","rendering"]
  },
  { id:55, category:"Context", difficulty:"beginner",
    question:"How do you supply a value to Context consumers?",
    options:[
      "<MyContext value={x}>children</MyContext>",
      "<MyContext.Provider value={x}>children</MyContext.Provider>",
      "setContext(x)",
      "<Provider context={x}>children</Provider>"
    ],
    correctAnswer:1, tags:["context","provider"]
  },
  { id:56, category:"Events", difficulty:"intermediate",
    question:"How do you pass an argument to an onClick handler?",
    options:[
      "onClick={handle(id)}",
      "onClick={() => handle(id)}",
      "onClick=handle id",
      "onClick={handle.call(id)}"
    ],
    correctAnswer:1, tags:["events","handlers"]
  },
  { id:57, category:"Forms", difficulty:"intermediate",
    question:"For a controlled checkbox, which prop binds its state?",
    options:["value","checked","defaultValue","selected"],
    correctAnswer:1, tags:["forms","inputs"]
  },
  { id:58, category:"Hooks", difficulty:"intermediate",
    question:"What does useRef NOT do by default?",
    options:[
      "Persist a mutable value across renders",
      "Trigger a re-render when .current changes",
      "Reference a DOM node",
      "Store an interval id"
    ],
    correctAnswer:1, tags:["useRef"]
  },
  { id:59, category:"Hooks", difficulty:"intermediate",
    question:"useMemo is best used to…",
    options:[
      "Memoize expensive calculated values",
      "Persist values to localStorage",
      "Throttle renders",
      "Cache network responses"
    ],
    correctAnswer:0, tags:["useMemo","performance"]
  },
  { id:60, category:"Hooks", difficulty:"intermediate",
    question:"useCallback helps when…",
    options:[
      "Passing stable callbacks to memoized children",
      "You need to delay effects",
      "You want to cancel fetches",
      "You want to schedule transitions"
    ],
    correctAnswer:0, tags:["useCallback","memo"]
  },
  { id:61, category:"Components", difficulty:"beginner",
    question:"How do you conditionally add a CSS class in JSX?",
    options:[
      "class={active && 'btn'}",
      "className={`btn ${active ? 'active' : ''}`}",
      "css-class={active}",
      "className={{ active: true }}"
    ],
    correctAnswer:1, tags:["jsx","className"]
  },
  { id:62, category:"Rendering", difficulty:"intermediate",
    question:"What triggers a component re-render?",
    options:[
      "Calling a state setter with a new value",
      "Changing local variables only",
      "Modifying a ref value",
      "Scrolling the page"
    ],
    correctAnswer:0, tags:["rendering","state"]
  },
  { id:63, category:"Performance", difficulty:"intermediate",
    question:"React.memo uses what comparison by default?",
    options:["Deep comparison","Shallow comparison of props","Reference equality only","No comparison"],
    correctAnswer:1, tags:["memo","props"]
  },
  { id:64, category:"General", difficulty:"intermediate",
    question:"Which is true about React.StrictMode?",
    options:[
      "It enables extra checks only in development",
      "It reduces bundle size",
      "It is required for production",
      "It disables hooks"
    ],
    correctAnswer:0, tags:["strictmode"]
  },
  { id:65, category:"Tooling", difficulty:"beginner",
    question:"What command typically creates a new Vite React app?",
    options:[
      "npm create vite@latest",
      "npx create-react-app",
      "npm init react-app",
      "yarn react new"
    ],
    correctAnswer:0, tags:["vite","tooling"]
  },
  { id:66, category:"Hooks", difficulty:"beginner",
    question:"Where can hooks be called?",
    options:[
      "At the top level of React function components or custom hooks",
      "Inside loops and conditionals",
      "From any JavaScript function",
      "From class components"
    ],
    correctAnswer:0, tags:["hooks","rules"]
  },
  { id:67, category:"Hooks", difficulty:"intermediate",
    question:"How do you avoid stale state when updating based on previous value?",
    options:[
      "setCount(count + 1)",
      "setCount(prev => prev + 1)",
      "count = count + 1",
      "useEffect to set count"
    ],
    correctAnswer:1, tags:["state","functional-update"]
  },
  { id:68, category:"Forms", difficulty:"intermediate",
    question:"How do you control a text input?",
    options:[
      "value={name} onChange={e => setName(e.target.value)}",
      "defaultValue only",
      "onInput without state",
      "Set innerText"
    ],
    correctAnswer:0, tags:["forms","controlled"]
  },
  { id:69, category:"Rendering", difficulty:"intermediate",
    question:"What does the dependency array in useEffect do?",
    options:[
      "Controls when the effect re-runs",
      "Sets CSS priority",
      "Limits number of renders",
      "Defines reducer actions"
    ],
    correctAnswer:0, tags:["useEffect","deps"]
  },
  { id:70, category:"General", difficulty:"beginner",
    question:"What does JSX compile to?",
    options:[
      "HTML strings",
      "React.createElement calls",
      "Template literals",
      "DOM nodes directly"
    ],
    correctAnswer:1, tags:["jsx","compilation"]
    }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = REACT_QUESTIONS_V2;
}
