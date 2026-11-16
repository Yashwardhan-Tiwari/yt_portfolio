/* Central content database. Edit projects, skills and notes here. */
window.PORTFOLIO_DATA = {
  projects: [
    {
      id: 'campusparcel', title: 'CampusParcel', category: 'Web', symbol: 'CP', status: 'Concept / in planning', year: '2026',
      short: 'A safer, traceable way to receive and collect parcels on a busy campus.',
      problem: 'Students are often in class when deliveries arrive. Informal handovers can create confusion about who received a parcel, where it was stored, and whether it reached the correct student.',
      solution: 'A campus parcel workflow with a guard-facing intake process and a student-facing collection flow. Guards record delivery details, parcel and storage photos, and a unique parcel ID. Students can view their parcel status and present a six-digit OTP during collection.',
      stack: ['HTML', 'CSS', 'JavaScript', 'OTP workflow concept'],
      features: ['Guard registration of incoming parcels and delivery details', 'Photo record at receiving and safe-storage stages', 'Unique parcel ID and storage-location tracking', 'Student parcel status view', 'Six-digit OTP verification before handover', 'Digital status history for receiving, storing and collection'],
      links: [{ label: 'Pitch presentation', url: 'https://docs.google.com/presentation/d/19zERkw287U5bSz27Q6VKHgWha3-eV4JGiYoOlUXsDkA/edit?slide=id.p1#slide=id.p1' }],
      note: 'This is currently presented as a project concept and planned workflow. Authentication, secure OTP delivery, image storage and a database would need a backend before real campus use.'
    },
    {
      id: 'bitwise-lab', title: 'C Bitwise & Sorting Visualizer', category: 'C', symbol: '0b', status: 'Interactive learning demo', year: '2026',
      short: 'A small visual lab for exploring binary operations and sorting logic.',
      problem: 'Bitwise operators and sorting algorithms can feel abstract when they are only shown as code or final output.',
      solution: 'A visual learning space that lets visitors change binary inputs, inspect bitwise results, and watch sorting algorithms move values through each step. The browser demo uses JavaScript to visualize concepts being studied in C.',
      stack: ['C concepts', 'JavaScript visualizer', 'HTML', 'CSS'],
      features: ['Live AND, OR, XOR and NOT calculations', 'Binary and decimal values shown together', 'Bubble sort and selection sort modes', 'Step-by-step comparison and swap animation', 'Random array generation and speed control'],
      links: [],
      note: 'The interactive lab on this portfolio is a browser-side JavaScript visualization of concepts relevant to C. It is a learning demo, not a claim that the visualizer itself is compiled C software.'
    },
    {
      id: 'innovex', title: 'INNOVEX 2026', category: 'Web', symbol: 'IX', status: 'Earlier coursework', year: '2026',
      short: 'An early web development project associated with a tech-fest assignment.',
      problem: 'A tech-fest experience needs a clear place for visitors to discover the event and understand what is happening.',
      solution: 'An early HTML/CSS website project created during web development coursework. The original files are stored locally on the author’s computer and are not publicly hosted yet.',
      stack: ['HTML', 'CSS'],
      features: ['Multi-section event website structure', 'Practice with page layout and visual hierarchy', 'Early hands-on web development experience'],
      links: [],
      note: 'The original file reference points to a local Windows path, so it cannot be opened by visitors to this website. Add a GitHub repository or hosted demo link when you publish it.'
    },
    {
      id: 'portfolio-v1', title: 'Portfolio — v1', category: 'Web', symbol: 'v1', status: 'Earlier coursework', year: '2026',
      short: 'The first iteration of a personal portfolio built while learning web development.',
      problem: 'A developer needs a central place to introduce themselves and present work.',
      solution: 'An earlier portfolio exercise that helped build familiarity with HTML page structure, styling and navigation. This current site is the next iteration of that learning journey.',
      stack: ['HTML', 'CSS'],
      features: ['Personal profile and page structure', 'Navigation between portfolio sections', 'A foundation for the current portfolio redesign'],
      links: [],
      note: 'The original project is referenced by a local Windows file path and is not hosted. Replace this card’s links with a repository or demo URL when available.'
    }
  ],
  skills: [
    { name: 'C', group: 'Languages', level: 'Practising', value: 68, note: 'Core programming, arrays, functions and bitwise concepts' },
    { name: 'HTML5', group: 'Web', level: 'Using', value: 76, note: 'Semantic structure and accessible page layout' },
    { name: 'CSS3', group: 'Web', level: 'Using', value: 72, note: 'Responsive layouts, custom properties and animation' },
    { name: 'JavaScript', group: 'Web', level: 'Building', value: 55, note: 'DOM interaction, validation and browser-side logic' },
    { name: 'Python', group: 'Learning', level: 'Learning', value: 28, note: 'Currently learning the language and its fundamentals' },
    { name: 'Git & GitHub', group: 'Tools', level: 'Using', value: 62, note: 'Version control and project hosting workflow' },
    { name: 'VS Code', group: 'Tools', level: 'Using', value: 70, note: 'Daily development environment' },
    { name: 'Windows', group: 'Platforms', level: 'Using', value: 75, note: 'Development and general computing' },
    { name: 'Ubuntu Linux', group: 'Platforms', level: 'Using', value: 58, note: 'Linux environment and command-line familiarity' },
    { name: 'Linear Programming', group: 'Concepts', level: 'Studied', value: 48, note: 'Optimization concepts and structured problem solving' },
    { name: 'Optimization', group: 'Concepts', level: 'Studied', value: 45, note: 'Thinking about efficiency and constraints' }
  ],
  notes: [
    { id: 'bitwise-basics', title: 'Bitwise operators: think in bits', category: 'C notes', read: '4 min', date: 'Learning note', excerpt: 'A quick mental model for AND, OR, XOR and NOT.', body: `<p>Bitwise operators work on the individual bits of integer values. They are useful when you need to inspect or manipulate binary representations.</p><h3>AND (&amp;)</h3><p>A result bit is 1 only when both input bits are 1. Think of it as a bit-by-bit gate that keeps only shared 1s.</p><h3>OR (|)</h3><p>A result bit is 1 when either input bit is 1. It combines the set bits from both operands.</p><h3>XOR (^)</h3><p>A result bit is 1 when the two input bits differ. XOR is especially useful for comparing bit patterns.</p><h3>NOT (~)</h3><p>NOT flips every bit in the integer representation. In C, remember that the result depends on the integer type and its representation.</p><p>Try changing the inputs in the Bitwise Lab on the Skills page and compare the decimal and binary outputs.</p>` },
    { id: 'sorting-logic', title: 'Sorting: comparisons before code', category: 'Algorithms', read: '5 min', date: 'Learning note', excerpt: 'How to reason about bubble sort and selection sort before implementing them.', body: `<p>Before writing a sorting algorithm, define what it means for the array to be sorted: each element should be no greater than the element after it.</p><h3>Bubble sort</h3><p>Compare adjacent values and swap them when they are in the wrong order. After each full pass, the largest remaining value has moved toward the end.</p><h3>Selection sort</h3><p>Scan the unsorted portion, find the smallest value, and place it at the beginning of that portion. Repeat for the next position.</p><h3>What to observe</h3><p>Count comparisons and swaps separately. Two algorithms can produce the same sorted result while taking different paths to get there.</p><p>Use the sorting visualizer on the Skills page to watch each comparison and swap.</p>` },
    { id: 'web-first-principles', title: 'A useful way to think about web pages', category: 'Web notes', read: '3 min', date: 'Learning note', excerpt: 'Structure, presentation and behaviour are separate jobs.', body: `<p>HTML describes the structure and meaning of a page. CSS controls presentation. JavaScript adds behaviour and interaction.</p><h3>Keep responsibilities clear</h3><p>Put reusable styles in stylesheets, shared interactions in JavaScript files, and content in clearly named HTML sections. This separation makes a project easier to debug.</p><h3>Build mobile-first</h3><p>Start with the smallest practical layout, then add breakpoints when the content needs more room. A responsive design should adapt to the user’s screen rather than simply shrink a desktop page.</p><h3>Test the actual experience</h3><p>Check keyboard navigation, readable contrast, touch targets, form errors and loading behaviour. A page that looks finished is not necessarily usable yet.</p>` },
    { id: 'debugging-mindset', title: 'Debugging is part of building', category: 'Process', read: '3 min', date: 'Learning note', excerpt: 'A calm, repeatable loop for finding what actually went wrong.', body: `<p>When a bug appears, resist changing several things at once. First reproduce it, then narrow the cause.</p><ol><li>Write down the exact steps that produce the issue.</li><li>Check the browser console or terminal output.</li><li>Inspect the smallest relevant section of code.</li><li>Change one thing and test again.</li><li>Record what fixed it so the same issue is easier to solve next time.</li></ol><p>Debugging is not separate from programming. It is one of the ways you learn how a system behaves.</p>` }
  ]
};
