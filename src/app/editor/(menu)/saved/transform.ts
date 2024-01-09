import { Class } from "@/types";

// basically binary search
const transform = (count: number, classes: [string, Class][]): string => {
  const middle = Math.floor(classes.length / 2);

  const [id, cl] = classes[middle];

  if (cl.count === count) return id;

  if (count < cl.count) return transform(count, classes.slice(0, middle));

  return transform(count, classes.slice(middle + 1));
};

export default transform;
