import { twMerge } from "tailwind-merge";
import Card from "./Card";
import { getLocalJsonData } from "@/lib";

type GoalsTextType = {
  title: string;
  desc: string;
};

const AboutUs = async ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const data: GoalsTextType[] = await getLocalJsonData("goalsText");

  return (
    <div className={twMerge(className, "w-full")} {...props}>
      <div className="flex w-full flex-col items-center gap-4 bg-slate p-20 text-bgPrimary">
        <h2 className="font-heading text-5xl tracking-tighter">About Us</h2>
        <p className="max-w-5xl text-center text-2xl tracking-tight">
          As JAC students, we understand the difficulties of planning our
          schedules. We must meticulously arrange our compulsory courses while
          ensuring they don{"'"}t coincide with each other and have competent
          instructors. Moreover, the Schedule of Classes PDF can be
          overwhelming. Therefore, we have developed a schedule builder service
          for JAC students that alleviates all your worries and allows you to
          concentrate on creating your dream schedule.
        </p>
      </div>
      <div className="box-border w-full p-16 text-2xl">
        <h2 className="text-center font-heading text-5xl tracking-tighter">
          Our Goals
        </h2>
        <div className="mt-8 flex gap-6">
          {data.map(({ title, desc }, index) => {
            return (
              <Card
                key={title}
                className="box-border flex basis-1/3 flex-col gap-2"
                index={index}
              >
                <h3 className="font-heading text-3xl font-bold tracking-tight">
                  {title}
                </h3>
                {/* <hr /> */}
                <p className="tracking-tight">{desc}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
