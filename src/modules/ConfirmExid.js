// import { useEffect } from "react";
// import { useBlocker } from "react-router-dom";

// export function useUnsavedChangesPrompt(when) {
//   const blocker = useBlocker(when);

//   useEffect(() => {
//     if (blocker.state !== "blocked") return;

//     const confirmLeave = window.confirm(
//       "You have unsaved changes. Do you want to leave this page?"
//     );

//     if (confirmLeave) {
//       blocker.proceed();
//     } else {
//       blocker.reset();
//     }
//   }, [blocker]);
// }
