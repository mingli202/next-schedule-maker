// "use client";
//
// import { getAuth } from "firebase/auth";
// import { ref, remove, update } from "firebase/database";
// import { type HTMLMotionProps, motion } from "framer-motion";
// import { type HTMLAttributes, useState } from "react";
// import { app, db } from "@/backend";
// import cn from "@/lib/cn";
// import Button from "../Button";
//
// type Props = {
//   schedule: Saved;
//   disableEdit?: boolean;
//   onScheduleSelected: (scheduleId: string) => void;
//   onSheduleNameChange: (oldName: string, newName: string) => void;
// };
//
// function ScheduleCard({
//   schedule,
//   setSavedSchedules,
//   className,
//   allClasses,
//   handleHighlight,
//   disableEdit,
//   highlight,
//   ...props
// }: Props & HTMLAttributes<HTMLDivElement> & HTMLMotionProps<"div">) {
//   const [editName, setEditName] = useState(false);
//
//   async function nameChange(formdata: FormData) {
//     setEditName(false);
//     const name = formdata.get("name")?.toString() ?? "Untitled";
//
//     const user = getAuth(app).currentUser;
//     if (!user) {
//       if (setSavedSchedules) {
//         setSavedSchedules((savedSchedules) => {
//           if (!savedSchedules) return undefined;
//
//           const newSavedSchedules = {
//             ...savedSchedules,
//             [scheduleId]: {
//               ...savedSchedules[scheduleId],
//               name,
//             },
//           };
//
//           localStorage.setItem(
//             "savedScheduleswinter2026",
//             JSON.stringify(newSavedSchedules),
//           );
//
//           return newSavedSchedules;
//         });
//       }
//
//       return;
//     }
//
//     const dbRef = ref(db, `/users/${user.uid}/schedules`);
//
//     await update(dbRef, {
//       [scheduleId]: { ...schedule, name },
//     }).catch((err) => console.log(err));
//   }
//
//   async function deleteSchedule() {
//     const user = getAuth(app).currentUser;
//     if (!user) {
//       if (setSavedSchedules) {
//         setSavedSchedules((savedSchedules) => {
//           if (!savedSchedules) return undefined;
//
//           delete savedSchedules[scheduleId];
//
//           localStorage.setItem(
//             "savedScheduleswinter2026",
//             JSON.stringify(savedSchedules),
//           );
//
//           return { ...savedSchedules };
//         });
//       }
//       return;
//     }
//
//     const dbref = ref(db, `/users/${user.uid}/schedules/${scheduleId}`);
//     await remove(dbref);
//   }
//
//   return (
//     <motion.div
//       className={cn(
//         "bg-bg-secondary flex h-fit w-full flex-col gap-1 rounded-md p-1 transition",
//         {
//           "bg-secondary": highlight === scheduleId,
//         },
//         className,
//       )}
//       onClick={(e) => {
//         e.nativeEvent.stopImmediatePropagation();
//       }}
//       {...props}
//     >
//       <div
//         className={cn(
//           "bg-slate hover:bg-slate/90 col-span-5 row-[span_20/span_20] grid h-20 w-full shrink-0 cursor-pointer grid-cols-5 grid-rows-[repeat(20,1fr)] overflow-hidden rounded-md transition",
//         )}
//         title="select"
//         onClick={() => {
//           handleHighlight();
//           select();
//
//           if (customSelect) {
//             customSelect(scheduleId, schedule);
//           }
//         }}
//       >
//         {schedule.data &&
//           schedule.data.map(({ bgColor, id }) => {
//             if (!Object.hasOwn(allClasses, id)) {
//               return null;
//             }
//
//             const sch = allClasses[id];
//
//             return sch.viewData.map((s, i) => {
//               const [day, [start, end]] = Object.entries(s)[0];
//
//               return (
//                 <div
//                   className="rounded-sm"
//                   style={{
//                     gridColumn: day,
//                     gridRowStart: start,
//                     gridRowEnd: end,
//                     backgroundColor: bgColor,
//                   }}
//                   key={sch.code + sch.section + day + `${i}`}
//                 />
//               );
//             });
//           })}
//       </div>
//
//       <div className="flex h-full items-center justify-between gap-2">
//         {editName ? (
//           <form
//             className="bg-background box-border flex basis-full items-center overflow-hidden rounded-md"
//             action={async (f) => {
//               if (disableEdit) return;
//               await nameChange(f);
//             }}
//           >
//             <input
//               name="name"
//               id="name"
//               className="bg-background w-full outline-none"
//               defaultValue={schedule.name}
//               autoFocus
//             />
//             <Button variant="basic" type="submit" className="shrink-0 p-1">
//               <FontAwesomeIcon
//                 icon={faCheckCircle}
//                 className="h-3 w-3 md:h-4 md:w-4"
//               />
//             </Button>
//
//             <Button
//               variant="basic"
//               type="button"
//               onClick={() => setEditName(false)}
//               className="shrink-0 p-1"
//             >
//               <FontAwesomeIcon
//                 icon={faXmarkCircle}
//                 className="h-3 w-3 md:h-4 md:w-4"
//               />
//             </Button>
//           </form>
//         ) : (
//           <>
//             <p
//               className={cn(!disableEdit && "cursor-pointer", "line-clamp-1")}
//               onClick={() => {
//                 if (disableEdit) return;
//
//                 document.getRootNode().addEventListener(
//                   "click",
//                   () => {
//                     setEditName(false);
//                   },
//                   { once: true },
//                 );
//
//                 setEditName(true);
//               }}
//               title="edit"
//             >
//               {schedule.name && schedule.name !== ""
//                 ? schedule.name
//                 : "Untitled"}
//             </p>
//             {disableEdit !== true && (
//               <Button
//                 title="delete"
//                 variant="basic"
//                 className="shrink-0 p-1"
//                 onClick={async () => {
//                   if (disableEdit) return;
//                   await deleteSchedule();
//                 }}
//               >
//                 <FontAwesomeIcon
//                   icon={faTrash}
//                   className="h-3 w-3 md:h-4 md:w-4"
//                 />
//               </Button>
//             )}
//           </>
//         )}
//       </div>
//     </motion.div>
//   );
// }
//
// export default ScheduleCard;
