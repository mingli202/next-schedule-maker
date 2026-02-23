import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link, u as useSearch } from "../_libs/tanstack__react-router.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { u as useQuery, q as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { g as getColorFromIndex, c as client } from "./router-DzwcWHh3.mjs";
import { A as ArrowRight, M as Minus, a as Maximize, b as Minimize, U as User, C as Clock } from "../_libs/lucide-react.mjs";
import { u as useAnimate, m as motion, A as AnimatePresence } from "../_libs/framer-motion.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tiny-warning.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/zod.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const cn = (...styles) => {
  return twMerge(clsx(...styles));
};
function Navbar({ className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: cn(
        className,
        "bg-bg-primary bg-opacity-50 z-50 box-border flex flex-col gap-4 p-4 backdrop-blur-lg backdrop-filter"
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex h-10 items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/logo.png", alt: "Logo", width: 36, height: 36 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-heading text-lg md:text-3xl", children: "Dream Builder" })
      ] }) })
    }
  );
}
function Button({
  className,
  children,
  variant,
  disableBgEffect,
  disableScaleEffect,
  ...props
}) {
  const yellow = "#facc15";
  const hoverVariants = {
    // basic animation for non important text
    basic: {
      scale: disableScaleEffect ? 1 : 1.01,
      opacity: 1
    },
    // for important buttons
    special: {
      scale: disableScaleEffect ? 1 : 1.01,
      outlineColor: yellow,
      boxShadow: `0 0 1rem ${yellow}`
    }
  };
  const ref = reactExports.useRef(null);
  const [scope, animate] = useAnimate();
  const [circleSize, setCircleSize] = reactExports.useState();
  const [mousePosition, setMousePosition] = reactExports.useState({ x: 0, y: 0 });
  const handleBasicHover = async (e) => {
    const styles = {
      opacity: [0.3, 0],
      scale: [0, 3]
    };
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) {
      return;
    }
    const offset = bounds.width / 2;
    const x = e.clientX - bounds.x - offset;
    const y = e.clientY - bounds.y - offset;
    await animate(
      scope.current,
      { x: [x], y: [y], ...styles },
      {
        duration: 0.5,
        times: [0, 1]
      }
    );
  };
  const handleSpecialHover = async (e) => {
    updateMousePosition(e);
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) {
      return;
    }
    const x = e.clientX - bounds.x;
    const y = e.clientY - bounds.y;
    const maxDistance = Math.max(
      Math.hypot(x, y),
      Math.hypot(bounds.width - x, y),
      Math.hypot(x, bounds.height - y),
      Math.hypot(bounds.width - x, bounds.height - y)
    );
    setCircleSize(maxDistance * 2);
  };
  const updateMousePosition = (e) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) {
      return;
    }
    const x = e.clientX - bounds.x;
    const y = e.clientY - bounds.y;
    setMousePosition({ x, y });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.button,
    {
      ...props,
      className: cn(
        "relative overflow-hidden rounded-lg p-2",
        variant === "basic" && "bg-transparent opacity-50",
        variant === "special" && "text-bg-primary z-10 bg-yellow-400",
        className
      ),
      style: {
        "--mouse-x": `${mousePosition.x}px`,
        "--mouse-y": `${mousePosition.y}px`
      },
      whileHover: variant,
      whileTap: {
        scale: 1
      },
      variants: hoverVariants,
      ref,
      onPointerUp: async (e) => {
        if (disableBgEffect) return;
        handleBasicHover(e);
      },
      onPointerEnter: async (e) => {
        if (disableBgEffect) return;
        handleSpecialHover(e);
      },
      onPointerLeave: async (e) => {
        if (disableBgEffect) return;
        updateMousePosition(e);
        setCircleSize(void 0);
      },
      children: [
        children,
        variant === "basic" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            ref: scope,
            className: cn(
              "absolute top-0 left-0 z-1 aspect-square w-full rounded-full bg-white opacity-1"
            )
          }
        ),
        variant === "special" && /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: circleSize !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            ref: scope,
            className: cn(
              "bg-bg-primary absolute top-0 left-0 z-1 h-full w-full",
              "overflow-hidden p-2",
              className
            ),
            style: {
              color: yellow
            },
            initial: {
              clipPath: "circle(0px at var(--mouse-x) var(--mouse-y))"
            },
            animate: {
              clipPath: `circle(${circleSize}px at var(--mouse-x) var(--mouse-y))`
            },
            exit: {
              clipPath: "circle(0px at var(--mouse-x) var(--mouse-y))"
            },
            children
          }
        ) })
      ]
    }
  );
}
const getSectionSectionsSectionIdGet = (options) => (options.client ?? client).get({ url: "/sections/{section_id}", ...options });
const getRatingsRatingsProfGet = (options) => (options.client ?? client).get({ url: "/ratings/{prof}", ...options });
function sectionOptions(sectionId) {
  return queryOptions({
    queryKey: ["section", sectionId],
    queryFn: async () => {
      const res = await getSectionSectionsSectionIdGet({
        path: { section_id: sectionId }
      });
      if (res.error) {
        throw new Error(JSON.stringify(res.error.detail));
      }
      return res.data;
    },
    staleTime: Infinity
  });
}
function useSection(sectionId) {
  const res = useQuery(sectionOptions(sectionId));
  if (res.isError) {
    console.trace(`Section ${sectionId} failed to load. Error ${res.error}`);
  }
  return res;
}
function capitalize(s) {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}
function TeacherStats({ leclab, className }) {
  const { data, isPending, isError } = useQuery({
    queryKey: ["rating", leclab.prof],
    queryFn: async () => {
      if (leclab.rating) {
        return leclab.rating;
      }
      const res = await getRatingsRatingsProfGet({
        path: { prof: leclab.prof }
      });
      if (res.error) {
        throw new Error(JSON.stringify(res.error.detail));
      }
      return res.data;
    },
    staleTime: Infinity
  });
  if (isPending) {
    return null;
  }
  const rating = data;
  if (isError || !rating || rating.status === "foundn't") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: "N/A" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn("group relative flex cursor-default font-bold", className),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: rating.score === 0 ? "N/A" : rating.score }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate absolute top-0 hidden w-48 translate-x-12 -translate-y-1/2 rounded-md p-1 text-sm leading-4 font-normal text-black shadow-lg group-hover:block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Rating: ",
            rating.avg === 0 ? "N/A" : `${rating.avg}/5`
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Difficulty:",
            " ",
            rating.difficulty === 0 ? "N/A" : `${rating.difficulty}/5`
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Raters: ",
            rating.nRating === 0 ? "N/A" : `${rating.nRating} raters`
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Take again: ",
            rating.takeAgain === 0 ? "N/A" : `${rating.takeAgain}%`
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold", children: [
            "Overall Score: ",
            rating.score === 0 ? "N/A" : `${rating.score}/100`
          ] })
        ] })
      ]
    }
  );
}
function LecLab({ leclab, className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("bg-secondary mt-2 rounded-md p-2", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "italic", children: capitalize(leclab.type ?? "lecture") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 opacity-50" }),
      leclab.prof,
      /* @__PURE__ */ jsxRuntimeExports.jsx(TeacherStats, { leclab })
    ] }),
    leclab.dayTimes.map((dayTime) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 opacity-50" }),
        dayTime.day,
        " ",
        dayTime.startTimeHhmm,
        "-",
        dayTime.endTimeHhmm
      ] }, dayTime.id);
    })
  ] });
}
function SectionCard({
  section,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex flex-col p-1", className), ...props, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
      section.course,
      ": ",
      section.domain,
      " ",
      section.code
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-heading text-base font-bold md:text-2xl", children: [
      section.section,
      " ",
      section.title
    ] }),
    section.leclabs.map((leclab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      LecLab,
      {
        leclab,
        className: cn("mt-2 rounded-md p-2")
      },
      leclab.id
    )),
    section.more !== "" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 opacity-70", children: section.more })
  ] });
}
function ExpandSection({
  section,
  bgColor,
  textColor,
  onRemoveSectionClicked,
  onMinimizeClicked
}) {
  const expandVariants = {
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1
    }
  };
  const cardVariants = {
    initial: {
      scale: 0.9
    },
    animate: {
      scale: 1
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      className: "absolute top-0 left-0 z-30 flex h-full w-full items-center justify-center rounded-md bg-white/30 text-xs backdrop-blur-md backdrop-filter md:text-base",
      initial: "initial",
      animate: "animate",
      exit: "initial",
      variants: expandVariants,
      onClick: () => {
        onMinimizeClicked();
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          className: "flex w-4/5 flex-col rounded-md p-1 shadow-xl",
          style: {
            backgroundColor: bgColor,
            color: textColor
          },
          onClick: (e) => {
            e.stopPropagation();
          },
          variants: cardVariants,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "basic",
                  className: "p-1 italic",
                  onClick: () => {
                    onRemoveSectionClicked();
                    onMinimizeClicked();
                  },
                  children: "Remove Class"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "basic",
                  onClick: onMinimizeClicked,
                  className: "p-1",
                  title: "minimize",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minimize, {})
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SectionCard,
              {
                section,
                className: cn({
                  "bg-black/10": textColor === "#000",
                  "bg-white/10": textColor === "#FFF"
                })
              }
            )
          ]
        }
      )
    }
  );
}
function SectionBlock({
  sectionId,
  colorIndex,
  disableRemove,
  disableControls,
  onRemoveSectionClicked
}) {
  const [expand, setExpand] = reactExports.useState(false);
  const { data: section } = useSection(sectionId);
  if (!section) return null;
  const card = {
    hover: {
      opacity: 1
    }
  };
  const { textColor, bgColor } = getColorFromIndex(colorIndex);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, { children: [
    section.viewData.map((times, index) => {
      const [d, [start, end]] = Object.entries(times)[0];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          className: cn(
            "relative z-10 box-border overflow-hidden rounded-md border-[3px]",
            "border-solid border-black/20 p-1"
          ),
          style: {
            gridColumn: d,
            gridRowStart: start,
            gridRowEnd: end,
            color: textColor,
            backgroundColor: bgColor
          },
          initial: disableControls ? void 0 : { opacity: 0, scale: 0.9 },
          animate: disableControls ? void 0 : { opacity: 1, scale: 1 },
          exit: disableControls ? void 0 : { opacity: 0, scale: 0.9 },
          transition: disableControls ? void 0 : { delay: index * 0.05 },
          variants: disableControls ? void 0 : card,
          whileHover: "hover",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "line-clamp-2 font-bold", children: section.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 line-clamp-1", children: section.code }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font", children: section.section }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 line-clamp-2", children: section.leclabs[0]?.prof }),
            disableControls ? null : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                className: "absolute bottom-0 left-0 flex w-full justify-between bg-white/10 p-2 backdrop-blur-sm backdrop-filter",
                variants: card,
                initial: { opacity: 0 },
                children: [
                  !disableRemove ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "basic",
                      className: "rounded-none p-0",
                      onClick: () => {
                        if (disableRemove || disableControls) return;
                        onRemoveSectionClicked();
                      },
                      title: "remove",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, {})
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "basis-full" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "basic",
                      className: "shrink-0 rounded-none p-0",
                      onClick: () => {
                        if (disableControls) return;
                        setExpand(true);
                      },
                      title: "expand",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize, {})
                    }
                  )
                ]
              }
            )
          ]
        },
        section.code + d + section.section + index.toString()
      );
    }),
    disableControls ? null : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: expand && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ExpandSection,
      {
        section,
        bgColor,
        textColor,
        onMinimizeClicked: () => setExpand(false),
        onRemoveSectionClicked
      }
    ) })
  ] }, `${section.code}-${section.section}-fragment`);
}
function GridView({ savedSections, ...props }) {
  return props.disableControls ? savedSections.map((param) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    SectionBlock,
    {
      ...param,
      ...props,
      onRemoveSectionClicked: () => {
      }
    },
    param.sectionId
  )) : (
    // TODO: onRemoveSectionClicked
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: savedSections.map((param) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionBlock,
      {
        ...param,
        ...props,
        onRemoveSectionClicked: () => {
        }
      },
      param.sectionId
    )) })
  );
}
function PreviewHover() {
  const search = useSearch({ strict: false });
  const previewSectionId = search.previewSectionId;
  if (!previewSectionId) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewHoverInner, { previewSectionId });
}
function PreviewHoverInner({ previewSectionId }) {
  const { data: section } = useSection(previewSectionId);
  if (!section) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 z-10 grid h-full w-full grid-cols-5 grid-rows-[repeat(20,1fr)] bg-transparent", children: section.viewData.map((times) => {
    const [d, [start, end]] = Object.entries(times)[0];
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "z-10 overflow-hidden rounded-md bg-white p-2 text-[8px] leading-2.5 text-black opacity-50 md:text-[14px] md:leading-3.5",
        style: {
          gridColumn: d,
          gridRowStart: start,
          gridRowEnd: end
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "line-clamp-2 font-bold", children: section.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 line-clamp-1", children: section.code }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font", children: section.section }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 line-clamp-2", children: section.leclabs[0]?.prof })
        ]
      },
      `${section.code}-${d}-${section.section}-hover`
    );
  }) });
}
function View({
  className,
  disableRemove,
  disableControls,
  savedSections
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "relative box-border grid w-full",
        "bg-primary text-bg-primary rounded-md p-2 md:p-4",
        disableControls ? "h-full grid-cols-5 grid-rows-[repeat(20,1fr)] md:h-full md:w-full md:p-2" : "h-160 grid-cols-[2rem_repeat(5,1fr)] grid-rows-[repeat(21,1fr)] md:h-full md:min-w-160 md:grid-cols-[3rem_repeat(5,1fr)]",
        className
      ),
      children: [
        !disableControls && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "absolute top-0 left-0 col-span-1 row-span-1 p-2 text-[0.5rem] md:text-xs", children: "Winter 2026 (December 11 pdf)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid-rows-[repeat(20,1fr) col-span-1 row-[span_21/span_21] mr-4 grid grid-cols-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Hours, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-5 col-start-2 flex", children: ["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "line-clamp-1 flex basis-1/5 items-center justify-center max-md:text-xs",
              children: day
            },
            day
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn(
              "relative grid grid-cols-5 grid-rows-[repeat(20,1fr)]",
              "bg-slate shadow-bg-primary/30 h-full rounded-md shadow-lg",
              "text-[8px] leading-2.5 md:text-[14px] md:leading-3.5",
              disableControls ? "col-span-full row-span-full md:text-[10px] md:leading-2.5" : "col-span-5 row-[span_20/span_20]"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 left-0 grid h-full w-full grid-cols-5 grid-rows-[repeat(20,1fr)]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full row-span-1" }),
                Array(19).fill(0).map((_, index) => {
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "col-span-full row-span-1 mx-2 box-border h-px -translate-y-1/2 rounded-full bg-gray-400"
                    },
                    index.toString()
                  );
                })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 left-0 grid h-full w-full grid-cols-5 grid-rows-[repeat(20,1fr)]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "invisible row-span-full" }),
                Array(4).fill(0).map((_, index) => {
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "row-span-full my-2 box-border w-px -translate-x-1/2 rounded-full bg-gray-400"
                    },
                    index.toString()
                  );
                })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GridView,
                {
                  disableRemove,
                  savedSections,
                  disableControls
                }
              ),
              !disableControls && /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewHover, {})
            ]
          }
        )
      ]
    }
  );
}
function Hours() {
  const initalMinutes = 8 * 60;
  const hours = Array(21).fill(0).map((_, index) => {
    const totalMinutes = index * 30 + initalMinutes;
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    return `${hour}:${minute === 0 ? "00" : minute}`;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: hours.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex translate-y-1/2 items-center text-[0.5rem] opacity-60 md:text-xs",
      children: h
    },
    h
  )) });
}
function MovingSchedule({ index, lastRef, pauseRef, worker }) {
  const [schedule, setSchedule] = reactExports.useState([]);
  const isGenerating = reactExports.useRef(false);
  const isStopped = reactExports.useRef(false);
  const ref = reactExports.useRef(null);
  const now = reactExports.useRef(0);
  const speedData = reactExports.useRef({
    dx: 0,
    x0: 0
  });
  const deltaT = 1 / 120;
  const requestNewSchedule = reactExports.useCallback(() => {
    worker?.postMessage({
      type: "mini-generate",
      index
    });
  }, [worker, index]);
  const nextFrame = reactExports.useCallback(
    (t) => {
      if (!ref.current) {
        return;
      }
      if (!isStopped.current) {
        requestAnimationFrame(nextFrame);
      }
      if (pauseRef.current) {
        return;
      }
      const dt = t - now.current;
      if (dt < deltaT * 1e3) {
        return;
      }
      now.current = t;
      const bounds = ref.current.getBoundingClientRect();
      const left = bounds.left;
      if (left > window.innerWidth + 50) {
        isGenerating.current = true;
        let ind = lastRef.current;
        while (ind === lastRef.current) {
          ind = Math.floor(Math.random() * 3);
        }
        lastRef.current = ind;
        const top = `${[-20, 10, 40][ind] + Math.random() * 10}%`;
        const zIndex = Math.floor(Math.random() * 1e3);
        const dx = 0.03 * (0.5 * Math.random() + 1);
        const newLeft = -(1200 + Math.random() * 600);
        speedData.current.dx = dx;
        speedData.current.x0 = newLeft;
        ref.current.style.top = top;
        ref.current.style.left = `${newLeft}px`;
        ref.current.style.zIndex = `${zIndex}`;
        requestNewSchedule();
      } else if (!isGenerating.current) {
        ref.current.style.left = `${left + speedData.current.dx / deltaT}px`;
      }
    },
    [lastRef, lastRef.current, pauseRef, requestNewSchedule]
  );
  reactExports.useEffect(() => {
    isStopped.current = false;
    const onMessage = (e) => {
      if (e.data.index !== index) {
        return;
      }
      if (e.data.schedule.length === 0) {
        requestNewSchedule();
        return;
      }
      setSchedule(e.data.schedule);
      isGenerating.current = false;
    };
    let id;
    let animationId;
    if (worker) {
      worker.addEventListener("message", onMessage);
      id = window.setTimeout(() => {
        animationId = requestAnimationFrame(nextFrame);
      }, 1e3 * index);
    }
    return () => {
      worker?.removeEventListener("message", onMessage);
      isStopped.current = true;
      clearTimeout(id);
      cancelAnimationFrame(animationId);
    };
  }, [worker, index, requestNewSchedule, nextFrame]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "absolute left-[110vw] h-160 w-[64.7rem] overflow-hidden shadow-[rgba(0,0,0,0.56)_0px_22px_70px_4px]",
      ref,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(View, { savedSections: schedule, disableControls: true })
    }
  );
}
function BgAnimation() {
  const last = reactExports.useRef(1);
  const pause = reactExports.useRef(false);
  const [vw, setVw] = reactExports.useState(Infinity);
  const [worker, setWorker] = reactExports.useState();
  reactExports.useEffect(() => {
    const worker2 = new Worker(
      new URL("../../workers/myWorker.ts", import.meta.url),
      {
        type: "module"
      }
    );
    setWorker(worker2);
    setVw(window.innerWidth);
    return () => {
      worker2.terminate();
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "from-bg-primary/75 to-primary/50 absolute top-0 left-0 -z-10 h-[200%] w-full bg-linear-to-b" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 -z-20 h-full w-full", children: Array(vw > 768 ? 10 : 5).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      MovingSchedule,
      {
        index: i,
        lastRef: last,
        pauseRef: pause,
        worker
      },
      i.toString()
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        className: "absolute right-4 bottom-4",
        variant: "basic",
        onClick: () => {
          pause.current = !pause.current;
        },
        children: "Pause Bg"
      }
    )
  ] });
}
function Welcome({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        className,
        "relative flex w-full items-center justify-center overflow-hidden"
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "box-border flex w-full flex-col items-center gap-4 bg-transparent text-xl tracking-tight", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-heading flex-1 text-center text-5xl tracking-tighter drop-shadow-[#000_0_0_20px]", children: "Jac Schedule Builder" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center drop-shadow-[#000_0_0_20px]", children: "The schedule builder you deserve" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/editor", search: { sections: [] }, className: "w-fit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "special",
              className: "drop-shadow-[rgba(0,0,0,0.5)_0_0_20px] max-md:p-1",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-1 tracking-tight", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Give it a try" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-5 md:h-7" })
              ] })
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BgAnimation, {})
      ]
    }
  );
}
function RouteComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "font-body text-text flex w-screen flex-col overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, { className: "fixed w-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Welcome, { id: "welcome", className: "h-screen" })
  ] });
}
export {
  RouteComponent as component
};
